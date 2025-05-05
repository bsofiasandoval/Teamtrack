import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client
from dotenv import load_dotenv
from functools import wraps
import pymupdf
import tempfile
from agent import runReportAgent, runNotetakingAgent, runEmailAgent
import jwt
import json
import openai


load_dotenv()
app = Flask(__name__)
CORS(app)  # Allow all origins (for development)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # Limit upload size to 16MB

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
SUPABASE_JWT_SECRET =  os.environ.get("SUPABASE_JWT_SECRET")
openai.api_key = os.getenv("OPENAI_API_KEY")

supabase: Client = create_client(url, key)


# FUNCION para requerir JWT 
"""
Decorador @require_jwt para proteger rutas con autenticación JWT.

Verifica que la petición incluya un token válido en el header:
    Authorization: Bearer <access_token>

Decodifica el token usando SUPABASE_JWT_SECRET y guarda el payload en `request.decoded_user`.
Si el token es inválido o expiró, responde con error 401.

Ejemplo de uso:

    @app.route("/ruta/protegida", methods=["GET"])
    @require_jwt
    def ruta_protegida():
        user_data = request.decoded_user
        return jsonify({"message": "Acceso concedido", "usuario": user_data})
"""

#funcion para generar embeddings
def generate_embedding(text):
    response = openai.embeddings.create(
        model="text-embedding-3-small",  
        input=text
    )
    return response.data[0].embedding

def require_jwt(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization', None)

        if not auth_header or not auth_header.startswith('Bearer '):
            return jsonify({"error": "Authorization header missing or malformed"}), 401

        token = auth_header.split(" ")[1]

        try:
            decoded = jwt.decode(token,SUPABASE_JWT_SECRET,algorithms=["HS256"],options={"verify_aud": False})
            request.decoded_user = decoded
        except jwt.ExpiredSignatureError:
            return jsonify({"error": "Token has expired"}), 401
        except jwt.InvalidTokenError as e:
            return jsonify({"error": f"Invalid token: {str(e)}"}), 401
        except Exception as e:
            return jsonify({"error": f"Unexpected token error: {str(e)}"}), 401

        return f(*args, **kwargs)
    return decorated_function

def require_user(role=None):
    """Base decorator for user authentication and role checking.
    Args:
        role (str, optional): Required role ('admin' or 'employee' or leader). If None, any role is accepted.
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            data = request.get_json()
            if not data or 'user_id' not in data:
                return {"error": "user_id is required"}, 400

            user_id = data.get("user_id")
            try:
                # Select fields based on whether we need to check role
                fields = ["organization_id", "emp_role"] if role else ["organization_id"]
                role_response = supabase.table("employee").select(",".join(fields)).eq("auth_user_id", user_id).execute()
                
                if not role_response.data:
                    return {"error": "User not found"}, 404
                
                # Check role if specified
                if role and role_response.data[0]["emp_role"] != role:
                    return {"error": "User is not authorized"}, 403
                
                # Add organization_id to the request context
                request.org_id = role_response.data[0]["organization_id"]
                return f(*args, **kwargs)
            except Exception as e:
                return {"error": str(e)}, 500
        return decorated_function
    return decorator

# Specialized decorators using the base decorator
def require_admin(f):
    return require_user(role="admin")(f)

def require_employee(f):
    return require_user(role="employee")(f)

def require_auth(f):
    return require_user()(f)

def require_leader(f):
    return require_user(role="leader")(f)

# Decorator for checking if organization is active
def require_active_org(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        try:
            # Get org_id from request context (set by require_user decorators)
            org_id = request.org_id
            org_response = supabase.table("organization").select("is_active").eq("id", org_id).execute()
            
            if not org_response.data:
                return {"error": "Organization not found"}, 404
            if not org_response.data[0]["is_active"]:
                return {"error": "Organization is not active"}, 403
                
            return f(*args, **kwargs)
        except Exception as e:
            return {"error": str(e)}, 500
    return decorated_function

@app.route("/", methods=["GET"])
def index():
    """
    Root endpoint to check if the API is running.
    
    Request: No parameters required
    
    Returns:
        - 200: Welcome message
            {"message": "Welcome to the Teamtrack API!"}
    """
    return jsonify({"message": "Welcome to the Teamtrack API!"})

## ADMIN ENDPOINTS
@app.route("/organizations/create", methods=["POST"])
def post_new_organization():
    """
    Create a new organization.
    
    Request Body:
        - org_name (str): Name of the organization
        - domain (str): Domain of the organization (e.g., 'example.com')
        - first_name (str): First name of the admin user
        - last_name (str): Last name of the admin user
        - email (str): Email of the admin user
        - password (str): Password for the admin user
    
    Returns:
        - 201: JSON with created organization and employee details
            {
                "organization": {organization_object},
                "employee": {employee_object}
            }
        - 400: Error if required fields are missing
        - 500: Error if organization creation, authentication, or employee creation fails
    """
    # Parse the incoming request data
    data = request.get_json()

    # Define the required fields for creating an organization
    required_fields = ["org_name", "domain", "first_name", "last_name", "email", "password"]
    
    # Validate that all required fields are present in the request data
    if not data or not all(field in data for field in required_fields):
        return {"error": "Missing required fields"}, 400

    # Extract the required fields from the request data
    org_name = data.get("org_name")
    domain = data.get("domain")
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    password = data.get("password")
    
    try:
        # Step 1: Create the organization in the database with active status
        org_response = supabase.table("organization").insert({
            "org_name": org_name,
            "domain": domain,
            "is_active": True
        }).execute()
        
        # Check if the organization creation was successful
        if not org_response.data:
            return jsonify({"error": "Error creating the organization"}), 500
        
        # Retrieve the organization ID from the response
        org_id = org_response.data[0]["id"]
        
        # Step 2: Create the user in the authentication system
        try:
            auth_response = supabase.auth.sign_up({
                "email": email,
                "password": password
            })
        except Exception as auth_error:
            # If the first attempt fails, try the alternative method
            try:
                auth_response = supabase.auth.sign_up(
                    email=email,
                    password=password
                )
            except Exception as alt_auth_error:
                # Clean up the created organization if auth fails
                supabase.table("organization").delete().eq("id", org_id).execute()
                return jsonify({"error": f"Authentication error: {str(alt_auth_error)}"}), 500
        
        # Validate the structure of the authentication response
        if isinstance(auth_response, dict) and "user" in auth_response:
            user_id = auth_response["user"]["id"]
        elif hasattr(auth_response, "user") and auth_response.user:
            user_id = auth_response.user.id
        else:
            # Clean up the created organization if auth response is invalid
            supabase.table("organization").delete().eq("id", org_id).execute()
            return jsonify({"error": "Unexpected auth response format"}), 500
        
        # Step 3: Create the admin employee linked to the organization
        emp_response = supabase.table("employee").insert({
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "emp_role": "admin",
            "organization_id": org_id,
            "auth_user_id": user_id
        }).execute()
        
        # Check if the employee creation was successful
        if not emp_response.data:
            # Clean up the created organization and auth user if employee creation fails
            supabase.table("organization").delete().eq("id", org_id).execute()
            return jsonify({"error": "Error creating the employee"}), 500
        
        # Return the created organization and employee details
        return jsonify({
            "organization": org_response.data[0],
            "employee": emp_response.data[0]
        }), 201
    except Exception as e:
        # Handle any unexpected errors during the process
        # If org_id exists, clean up the created organization
        if 'org_id' in locals():
            supabase.table("organization").delete().eq("id", org_id).execute()
        return jsonify({"error": str(e)}), 500

@app.route("/organization/update", methods=["POST"])
@require_admin
@require_active_org
def update_organization():
    """
    Update an existing organization.
    
    Request Body:
        - user_id (str): ID of the authenticated admin user
        - org_id (str): ID of the organization to update
        - org_name (str, optional): New name for the organization
        - domain (str, optional): New domain for the organization
    
    Returns:
        - 200: JSON with updated organization details
            {updated_organization_object}
        - 400: Error if required fields are missing
        - 403: Error if user is not authorized
        - 404: Error if organization is not found
        - 500: Error if organization update fails
    """
    data = request.get_json()
    try:
        # Extract the fields to update
        org_name = data.get("org_name")
        domain = data.get("domain")

        if not org_name or not domain:
            return {"error": "org_name and domain are required"}, 400

        # Update the organization in the database
        update_response = supabase.table("organization").update({
            "org_name": org_name,
            "domain": domain
        }).eq("id", request.org_id).execute()

        # Check if the update was successful
        if not update_response.data:
            return {"error": "Error updating the organization"}, 500

        # Return the updated organization details
        return jsonify(update_response.data[0]), 200

    except Exception as e:
        # Handle unexpected errors
        return {"error": str(e)}, 500

@app.route("/organization/deactivate", methods=["POST"])
@require_admin
def deactivate_organization():
    """
    Deactivate an organization.
    
    Request Body:
        - user_id (str): ID of the authenticated admin user
        - org_id (str): ID of the organization to deactivate
    
    Returns:
        - 200: Success message
            {"message": "Organization deactivated successfully"}
        - 400: Error if required fields are missing
        - 403: Error if user is not authorized
        - 404: Error if organization is not found
        - 500: Error if organization deactivation fails
    """
    org_id = request.org_id
    try:
        # Deactivate the organization in the database
        deactivate_response = supabase.table("organization").update({
            "is_active": False
        }).eq("id", org_id).execute()

        # Check if the deactivation was successful
        if not deactivate_response.data:
            return {"error": "Error deactivating the organization"}, 500

        # Return a success message
        return jsonify({"message": "Organization deactivated successfully"}), 200

    except Exception as e:
        # Handle unexpected errors
        return {"error": str(e)}, 500

@app.route("/organization/clients", methods=["GET"])
@require_admin
@require_active_org
def get_organization_clients():
    """
    Get all clients of a specific organization.
    
    Request Body:
        - user_id (str): ID of the authenticated user
    
    Returns:
        - 200: JSON array of client objects
            [{client_object}, {client_object}, ...]
        - 400: Error if required fields are missing
        - 403: Error if user is not authorized or organization is not active
        - []: Error if no clients are found
        - 500: Error if client retrieval fails
    """
    org_id = request.org_id
    try:
        # Fetch the clients of the organization
        client_response = supabase.table("client").select("*").eq("organization_id", org_id).execute()

        # Validate the client response
        if not client_response.data:
            return jsonify([]), 200

        # Return the list of clients
        return jsonify(client_response.data), 200

    except Exception as e:
        # Handle unexpected errors
        return {"error": str(e)}, 500

@app.route("/employee/create", methods=["POST"])
@require_admin
@require_active_org
def create_employee():
    """
    Create a new employee.
    
    Request Body:
        - user_id (str): ID of the authenticated admin user
        - first_name (str): First name of the new employee
        - last_name (str): Last name of the new employee
        - email (str): Email of the new employee
        - emp_role (str): Role of the new employee ('admin', 'employee', or 'leader')
    
    Returns:
        - 201: JSON with created employee details
            {employee_object}
        - 400: Error if required fields are missing
        - 403: Error if user is not authorized or organization is not active
        - 500: Error if employee creation fails
    """
    data = request.get_json()
    required_fields = ["first_name", "last_name", "email", "emp_role"]
    
    # Validate that all required fields are present in the request data
    if not data or not all(field in data for field in required_fields):
        return {"error": "Missing required fields"}, 400

    # Extract the required fields from the request data
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    emp_role = data.get("emp_role")

    try:
        # Create the employee in the database
        emp_response = supabase.table("employee").insert({
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "emp_role": emp_role,
            "organization_id": request.org_id
        }).execute()

        # Check if the employee creation was successful
        if not emp_response.data:
            return jsonify({"error": "Error creating the employee"}), 500

        # Return the created employee details
        return jsonify(emp_response.data[0]), 201

    except Exception as e:
        # Handle unexpected errors during employee creation
        return jsonify({"error": str(e)}), 500

# ruta para probar el embedding.
@app.route("/call/embedding/new", methods=["POST"])
def create_call_embedding():
    data = request.get_json()
    transcript = data.get("transcript")
    call_id = data.get("call_id")
    
    if not transcript or not call_id:
        return jsonify({"error": "Missing transcript or call_id"}), 400

    try:
        # Obtener el project_id asociado a la llamada
        call_response = supabase.table("call").select("projectid").eq("id", call_id).execute()
        if not call_response.data:
            return jsonify({"error": "Call not found"}), 404
        project_id = call_response.data[0]["projectid"]

        # Verificar si ya existe embedding
        existing = supabase.table("transcript_embeddings").select("id").eq("call_id", call_id).execute()
        if existing.data:
            return jsonify({"message": "Embedding already exists"}), 200

        # Generar el embedding
        embedding = generate_embedding(transcript)

        # Insertar el embedding
        insert_response = supabase.table("transcript_embeddings").insert({
            "project_id": project_id,
            "call_id": call_id,
            "embedding": embedding
        }).execute()

        if not insert_response.data:
            return jsonify({"error": "Error inserting embedding"}), 500

        return jsonify({"message": "Embedding created successfully"}), 201
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500







@app.route("/project/create", methods=["POST"])
@require_admin
@require_active_org
def create_project():
    """
    Create a new project.
    
    Request Body:
        - user_id (str): ID of the authenticated admin user
        - project_name (str): Name of the new project
        - client_id (str): ID of the client associated with the project
        - start_date (str): Start date of the project (ISO format)
        - end_date (str, optional): End date of the project (ISO format)
        - description (str, optional): Description of the project
    
    Returns:
        - 201: JSON with created project details
            {project_object}
        - 400: Error if required fields are missing
        - 403: Error if user is not authorized or organization is not active
        - []: Error if client is not found
        - 500: Error if project creation fails
    """
    data = request.get_json()
    required_fields = ["project_name", "description", "client_id"]
    
    # Validate that all required fields are present in the request data
    if not data or not all(field in data for field in required_fields):
        return {"error": "Missing required fields"}, 400

    # Extract the required fields from the request data
    project_name = data.get("project_name")
    description = data.get("description")
    start_date = data.get("start_date")
    end_date = data.get("end_date")

    try:
        # Create the project in the database
        project_response = supabase.table("project").insert({
            "project_name": project_name,
            "description": description,
            "start_date": start_date,
            "end_date": end_date,
            "organization_id": request.org_id
        }).execute()

        # Check if the project creation was successful
        if not project_response.data:
            return jsonify({"error": "Error creating the project"}), 500

        # Return the created project details
        return jsonify(project_response.data[0]), 201

    except Exception as e:
        # Handle unexpected errors during project creation
        return jsonify({"error": str(e)}), 500

@app.route("/project/assign", methods=["POST"])
@require_admin
@require_active_org
def assign_employee():
    """
    Assign an employee to a project.
    
    Request Body:
        - user_id (str): ID of the authenticated admin user
        - employee_id (str): ID of the employee to assign
        - project_id (str): ID of the project to assign the employee to
        - role (str, optional): Role of the employee in the project
    
    Returns:
        - 201: JSON with assignment details
            {assignment_object}
        - 400: Error if required fields are missing
        - 403: Error if user is not authorized or organization is not active
        - 404: Error if employee or project is not found
        - 500: Error if assignment fails
    """
    data = request.get_json()
    required_fields = ["employee_id", "project_id"]
    
    # Validate that all required fields are present in the request data
    if not data or not all(field in data for field in required_fields):
        return {"error": "Missing required fields"}, 400

    # Extract the required fields from the request data
    employee_id = data.get("employee_id")
    project_id = data.get("project_id")

    # Verify that the employee exists
    employee_response = supabase.table("employee").select("id").eq("id", employee_id).execute()
    if not employee_response.data:
        return jsonify({"error": "Employee not found"}), 404

    project_response = supabase.table("project").select("id").eq("id", project_id).execute()
    if not project_response.data:
        return jsonify({"error": "Project not found"}), 404

    # Verify that the employee is not already assigned to the project
    assignment_response = supabase.table("project_employee").select("id").eq("employee_id", employee_id).eq("project_id", project_id).execute()
    if assignment_response.data:
        return jsonify({"error": "Employee is already assigned to this project"}), 400
    
    
    try:
        # Assign the employee to the project in the database
        assign_response = supabase.table("project_employee").insert({
            "employee_id": employee_id,
            "project_id": project_id
        }).execute()

        # Check if the assignment was successful
        if not assign_response.data:
            return jsonify({"error": "Error assigning the employee to the project"}), 500

        # Return a success message
        return jsonify({"message": "Employee assigned to project successfully"}), 200

    except Exception as e:
        # Handle unexpected errors during assignment
        return jsonify({"error": str(e)}), 500




@app.route("/employee/projects", methods=["GET"])
def get_employee_projects():
    """
    Get all projects assigned to an employee and the calls related to those projects.
    
    Query Parameters:
        - user_id (str): ID of the authenticated employee
    
    Returns:
        - 200: JSON array of project assignments
            [{project_assignment_object}, {project_assignment_object}, ...]
        - 400: Error if required fields are missing
        - 403: Error if user is not authorized or organization is not active
        - []: Error if no projects are found
        - 500: Error if project retrieval fails
    """
    user_id = request.args.get("user_id")
    try:
        # Fetch the projects assigned to the employee
        project_response = supabase.table("project_employee").select("*").eq("employee_id", user_id).execute()

        # Now fetch the project details
        project_ids = [project["project_id"] for project in project_response.data]
        projects = []
        for project_id in project_ids:
            project_details = supabase.table("project").select("*").eq("id", project_id).execute()
            projects.append(project_details.data[0])
        
        # Fetch the calls related to the projects
        for project in projects:
            call_response = supabase.table("call").select("*").eq("projectid", project["id"]).execute()
            project["calls"] = call_response.data


        
        # Validate the project response
        if not projects:
            return jsonify([]), 200

        # Return the list of projects
        return jsonify(projects), 200

    except Exception as e:
        # Handle unexpected errors
        return {"error": str(e)}, 500

@app.route("/employee/clients", methods=["GET"])
@require_employee
@require_active_org
def get_employee_clients():
    """
    Get all clients related to the projects assigned to an employee.
    
    Request Body:
        - user_id (str): ID of the authenticated employee
    
    Returns:
        - 200: JSON array of client objects
            [{client_object}, {client_object}, ...]
        - 400: Error if required fields are missing
        - 403: Error if user is not authorized or organization is not active
        - []: Error if no clients are found
        - 500: Error if client retrieval fails
    """
    user_id = request.get("user_id")
    try:
        # Fetch the clients related to the projects assigned to the employee
        client_response = supabase.table("client").select("*").eq("auth_user_id", user_id).execute()

        # Validate the client response
        if not client_response.data:
            return jsonify([]), 200

        # Return the list of clients
        return jsonify(client_response.data), 200

    except Exception as e:
        # Handle unexpected errors
        return {"error": str(e)}, 500

@app.route("/employee/calls/schedule", methods=["POST"])
@require_employee
@require_active_org
def schedule_call():
    """
    Schedule a call for a project assigned to an employee.
    
    Request Body:
        - user_id (str): ID of the authenticated employee
        - project_id (str): ID of the project for the call
        - call_date (str): Date of the call (ISO format)
        - call_time (str): Time of the call
        - call_duration (int, optional): Duration of the call in minutes
        - call_notes (str, optional): Notes for the call
        - subclient_id (str, optional): ID of the subclient for the call
    
    Returns:
        - 201: JSON with scheduled call details
            {call_object}
        - 400: Error if required fields are missing
        - 403: Error if user is not authorized or organization is not active
        - 404: Error if project is not found
        - 500: Error if call scheduling fails
    """
    data = request.get_json()
    required_fields = ["project_id", "call_time", "duration"]
    
    # Validate that all required fields are present in the request data
    if not data or not all(field in data for field in required_fields):
        return {"error": "Missing required fields"}, 400

    # Extract the required fields from the request data
    project_id = data.get("project_id")

    project_response = supabase.table("project").select("id").eq("id", project_id).execute()
    if not project_response.data:
        return jsonify({"error": "Project not found"}), 404

    # verify that the project is assigned to the employee
    project_assignment_response = supabase.table("project_employee").select("id").eq("employee_id", request.user_id).eq("project_id", project_id).execute()
    if not project_assignment_response.data:
        return jsonify({"error": "Project not assigned to this employee"}), 403
    
    # verify that a subclient is assigned to the project
    subclient_response = supabase.table("subclient").select("id").eq("project_id", project_id).execute()
    if not subclient_response.data:
        return jsonify({"error": "No subclient assigned to this project"}), 403


    call_time = data.get("call_time")
    duration = data.get("duration")
    # designated = data.get("designated")
    
    try:
        # Schedule the call in the database
        call_response = supabase.table("call").insert({
            "project_id": project_id,
            "datetime": call_time,
            "duration": duration,
            # "teamtracker" : designated,
        }).execute()

        # Check if the scheduling was successful
        if not call_response.data:
            return jsonify({"error": "Error scheduling the call"}), 500

        # Return the scheduled call details
        return jsonify(call_response.data[0]), 201

    except Exception as e:
        # Handle unexpected errors during scheduling
        return jsonify({"error": str(e)}), 500



@app.route("/employee/calls/recent", methods=["GET"])
@require_employee
@require_active_org
def get_employee_recent_calls():
    """
    Get all calls related to the projects assigned to an employee.
    
    Request Body:
        - user_id (str): ID of the authenticated employee
    
    Returns:
        - 200: JSON array of call objects
            [{call_object}, {call_object}, ...]
        - 400: Error if required fields are missing
        - 403: Error if user is not authorized or organization is not active
        - []: Error if no calls are found
        - 500: Error if call retrieval fails
    """
    user_id = request.get_json().get("user_id")
    try:
        # Fetch the calls related to the projects assigned to the employee
        call_response = supabase.table("call").select("*").eq("employee_id", user_id).execute()

        # Validate the call response
        if not call_response.data:
            return jsonify([]), 200

        # Return the list of calls
        return jsonify(call_response.data), 200

    except Exception as e:
        # Handle unexpected errors
        return {"error": str(e)}, 500

@app.route("/project/call/insight", methods=["GET"])
@require_employee
@require_active_org
def get_call_insights():
    """
    Get insights for a specific call related to a project assigned to an employee.
    
    Request Body:
        - user_id (str): ID of the authenticated employee
        - call_id (str): ID of the call to get insights for
    
    Returns:
        - 200: JSON array of insight objects
            [{insight_object}, {insight_object}, ...]
        - 400: Error if required fields are missing
        - 403: Error if user is not authorized or organization is not active
        - []: Error if no insights are found
        - 500: Error if insight retrieval fails
    """
    data = request.get_json()
    required_fields = ["call_id"]
    
    # Validate that all required fields are present in the request data
    if not data or not all(field in data for field in required_fields):
        return {"error": "Missing required fields"}, 400

    # Extract the required fields from the request data
    call_id = data.get("call_id")

    # Verify that the call exists
    call_response = supabase.table("call").select("id").eq("id", call_id).execute()
    if not call_response.data:
        return jsonify({"error": "Call not found"}), 404

    try:
        # Fetch the insights for the specified call
        insight_response = supabase.table("call_insights").select("*").eq("call_id", call_id).execute()

        # Validate the insight response
        if not insight_response.data:
            return jsonify([]), 200

        # Return the list of insights
        return jsonify(insight_response.data), 200

    except Exception as e:
        # Handle unexpected errors
        return {"error": str(e)}, 500


# link a subclient to a client
@app.route("/client/subclient/create", methods=["POST"])
@require_auth
@require_active_org
def create_subclient():
    """
    Create a new subclient for an existing client.
    
    Request Body:
        - user_id (str): ID of the authenticated user
        - client_id (str): ID of the parent client
        - subclient_name (str): Name of the new subclient
        - subclient_email (str, optional): Email of the subclient
        - subclient_phone (str, optional): Phone number of the subclient
    
    Returns:
        - 201: JSON with created subclient details
            {subclient_object}
        - 400: Error if required fields are missing
        - 403: Error if user is not authorized or organization is not active
        - 404: Error if client is not found
        - 500: Error if subclient creation fails
    """
    data = request.get_json()
    required_fields = ["client_id", "subclient_name"]
    
    # Validate that all required fields are present in the request data
    if not data or not all(field in data for field in required_fields):
        return {"error": "Missing required fields"}, 400

    # Extract the required fields from the request data
    client_id = data.get("client_id")

    # Verify that the client exists
    client_response = supabase.table("client").select("id").eq("id", client_id).execute()
    if not client_response.data:
        return jsonify({"error": "Client not found"}), 404
    # Verify that the client is associated with the authenticated user

    client_association_response = supabase.table("client").select("id").eq("id", client_id).eq("organization_id", request.org_id).execute()
    if not client_association_response.data:
        return jsonify({"error": "Client not associated with this organization"}), 403

    subclient_name = data.get("subclient_name")

    try:
        # Create the subclient in the database
        subclient_response = supabase.table("subclient").insert({
            "client_id": client_id,
            "subclient_name": subclient_name,
            "organization_id": request.org_id
        }).execute()

        # Check if the subclient creation was successful
        if not subclient_response.data:
            return jsonify({"error": "Error creating the subclient"}), 500

        # Return the created subclient details
        return jsonify(subclient_response.data[0]), 201

    except Exception as e:
        # Handle unexpected errors during subclient creation
        return jsonify({"error": str(e)}), 500

@app.route("/client/subclient/update", methods=["POST"])
@require_auth
@require_active_org
def update_subclient():
    """
    Update an existing subclient.
    
    Request Body:
        - user_id (str): ID of the authenticated user
        - subclient_id (str): ID of the subclient to update
        - subclient_name (str, optional): New name for the subclient
        - subclient_email (str, optional): New email for the subclient
        - subclient_phone (str, optional): New phone number for the subclient
    
    Returns:
        - 200: JSON with updated subclient details
            {subclient_object}
        - 400: Error if required fields are missing
        - 403: Error if user is not authorized or organization is not active
        - 404: Error if subclient is not found
        - 500: Error if subclient update fails
    """
    data = request.get_json()
    required_fields = ["subclient_id", "subclient_name"]
    
    # Validate that all required fields are present in the request data
    if not data or not all(field in data for field in required_fields):
        return {"error": "Missing required fields"}, 400

    # Extract the required fields from the request data
    subclient_id = data.get("subclient_id")
    subclient_name = data.get("subclient_name")

    try:
        # Update the subclient in the database
        update_response = supabase.table("subclient").update({
            "subclient_name": subclient_name
        }).eq("id", subclient_id).execute()

        # Check if the update was successful
        if not update_response.data:
            return jsonify({"error": "Error updating the subclient"}), 500

        # Return the updated subclient details
        return jsonify(update_response.data[0]), 200

    except Exception as e:
        # Handle unexpected errors during subclient update
        return jsonify({"error": str(e)}), 500

@app.route("/client/subclient/delete", methods=["POST"])
@require_auth
@require_active_org
def delete_subclient():
    """
    Delete a subclient.
    
    Request Body:
        - user_id (str): ID of the authenticated user
        - subclient_id (str): ID of the subclient to delete
    
    Returns:
        - 200: Success message
            {"message": "Subclient deleted successfully"}
        - 400: Error if required fields are missing
        - 403: Error if user is not authorized or organization is not active
        - 500: Error if subclient deletion fails
    """
    data = request.get_json()
    required_fields = ["subclient_id"]
    
    # Validate that all required fields are present in the request data
    if not data or not all(field in data for field in required_fields):
        return {"error": "Missing required fields"}, 400

    # Extract the required fields from the request data
    subclient_id = data.get("subclient_id")

    try:
        # Delete the subclient from the database
        delete_response = supabase.table("subclient").delete().eq("id", subclient_id).execute()

        # Check if the deletion was successful
        if not delete_response.data:
            return jsonify({"error": "Error deleting the subclient"}), 500

        # Return a success message
        return jsonify({"message": "Subclient deleted successfully"}), 200

    except Exception as e:
        # Handle unexpected errors during subclient deletion
        return jsonify({"error": str(e)}), 500


# 


# Authentication Endpoint: Handles Google OAuth callback for employee login or sign-up.
# - Verifies if the user's email belongs to a registered organization.
# - If the employee exists, updates their auth_user_id if necessary.
# - If the employee does not exist, creates a new employee record with a default role.
# - Returns user details, role, and associated organization information.
@app.route("/auth/google/callback", methods=["POST"])
def google_auth_callback():
    """
    Handle Google OAuth callback for employee login or sign-up.
    
    Request Body:
        - user_id (str): Google Auth user ID
        - full_name (str): Full name of the user from Google
        - email (str): Email of the user from Google
    
    Returns:
        - 200: JSON with user authentication details
            {
                "success": true,
                "userId": "user_id",
                "firstName": "first_name",
                "userEmail": "email",
                "userRole": "role",
                "organizationId": "org_id"
            }
        - 400: Error if required user information is missing
        - 403: Error if email is not associated with any registered organization
        - 500: Error if authentication process fails
    """
    data = request.get_json()
    user_id = data.get("user_id")
    full_name = data.get("full_name")

    # Validate that user_id and full_name are present in the request data
    name_parts = full_name.split(" ", 1)
    first_name = name_parts[0]
    last_name = name_parts[1] if len(name_parts) > 1 else ""
    email = data.get("email")
    
    if not user_id or not email:
        return jsonify({"error": "Missing user information"}), 400
    
    try:
        # Check if the email belongs to an organization
        domain = email.split("@")[1]
        org = supabase.table("organization").select("id").eq("domain", domain).execute().data
        
        if not org:
            return jsonify({"error": "Email not associated with any registered organization"}), 403
        
        # Check if employee exists
        emp_data = supabase.table("employee").select("*").eq("email", email).execute().data

      
        print(emp_data)
        if emp_data:
            emp = emp_data[0]
            user_id = emp["id"]
            # Update auth_user_id if needed
            if not emp.get("auth_user_id"):
                supabase.table("employee").update({"auth_user_id": user_id}).eq("id", emp["id"]).execute()
        else:
            # Create a new employee record if none exists
            emp_response = supabase.table("employee").insert({
                "first_name": first_name,
                "last_name": last_name,
                "email": email,
                "emp_role": "user",  # Default role
                "auth_user_id": user_id,
                "organization_id": org[0]["id"]
            }).execute()
            emp = emp_response.data[0]
            user_id = emp["id"]
        
        print(user_id)
        # Return user data and role information
        return jsonify({
            "success": True,
            "userId": user_id,
            "firstName": first_name,
            "userEmail": email,
            "userRole": emp.get("emp_role"),
            "organizationId": emp.get("organization_id")
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def log_auth_attempt(email, resultado, mensaje):
    try:
        supabase.table("auth_logs").insert({
            "email": email,
            "resultado": resultado,
            "mensaje": mensaje
        }).execute()
    except Exception as e:
        print("Error registrando auth_log:", e)




# Agent API endpoints



def extract_text_from_pdf(pdf_file):
    """Extract text from a PDF file."""
    text = ""
    try:
        # Create a temporary file to save the uploaded PDF
        with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as temp:
            temp.write(pdf_file.read())
            temp_path = temp.name
        
        # Open the PDF with PyMuPDF
        doc = pymupdf.open(temp_path)
        
        # Extract text from each page
        for page in doc:
            text += page.get_text()
        
        # Close the document
        doc.close()
        
        # Clean up the temporary file
        os.unlink(temp_path)
        
        return text
    except Exception as e:
        print(f"Error extracting text from PDF: {e}")
        return None

# modified version of /agent/txt route that will process a call but also smart insert call insight
# into the database
# and return the call insight object
@app.route('/call/insight/new', methods=['POST'])
@require_auth
def new_call_insight():
    data = request.json
    user_id = data.get("user_id")
    transcript = data.get("transcript")
    call_id = data.get("call_id")  # Optional: Accept from frontend

    if not transcript:
        return jsonify({'error': 'No transcript provided'}), 400

    # Fetch latest call if call_id not provided
    if not call_id:
        try:
            response = supabase.rpc("get_latest_call", {"auth_uid": user_id}).execute()
            if not response.data:
                return jsonify({"error": "No calls found for this employee"}), 404
            call_id = response.data[0]["call_id"]
        except Exception as e:
            return jsonify({"error": f"Error fetching latest call: {str(e)}"}), 500

    # Update transcription for the call
    try:
        update_response = supabase.table("call").update({"transcription": transcript}).eq("id", call_id).execute()
        if not update_response.data:
            return jsonify({"error": "Failed to update call transcription"}), 500
    except Exception as e:
        return jsonify({"error": f"Error updating call transcription: {str(e)}"}), 500

    # Generate insights using agents
    try:
        notes = runNotetakingAgent(transcript)
        report = runReportAgent(transcript)
        
        # Insert insight into Supabase
        insight_data = {
            "call_id": call_id,
            "insightsjson": json.dumps({"notes": notes, "report": report})  # Insert as JSON object
        }
        insight_response = supabase.table("insight").insert(insight_data).execute()
        if not insight_response.data:
            return jsonify({"error": "Error creating the insight"}), 500
        
        return jsonify(insight_data), 201
    except Exception as e:
        return jsonify({'error': f'Error processing text with agent: {str(e)}'}), 500

@app.route('/agent/txt', methods=['POST'])
@require_auth # to ensure that user is in org and to be able to determine 
def agent_txt():
    """
    Process text with AI agents to generate notes and a report.
    
    Request Body:
        - transcript (str): The text content to be processed
    
    Returns:
        - 200: JSON with generated notes and report
            {
                "notes": {notes_object},
                "report": {report_object}
            }
        - 400: Error if no transcript is provided
        - 500: Error if processing fails
    """
    data = request.json
    
    if not data or 'transcript' not in data:
        return jsonify({'error': 'No transcript provided in request'}), 400
    
    text = data['transcript']
    
    try:
        notes = runNotetakingAgent(text)
        report = runReportAgent(text)
        
        return jsonify({
            'notes': notes,
            'report': report
        })

    except Exception as e:
        return jsonify({'error': f'Error processing text with agent: {str(e)}'}), 500

@app.route('/agent/email', methods=['POST'])
def agent_email():
    """
    Generate an email based on provided information using an AI agent.
    
    Request Body:
        - information (str): The information to be used for email generation
    
    Returns:
        - 200: JSON with generated email
            {
                "email": {
                    "subject": "email_subject",
                    "body": "email_body"
                }
            }
        - 400: Error if no information is provided
        - 500: Error if email generation fails
    """
    data = request.json
    
    if not data or 'information' not in data:
        return jsonify({'error': 'No information provided in request'}), 400
    
    information = data['information']
    
    try:
        email = runEmailAgent(information)
        return jsonify({
            'email': email
        })
    except Exception as e:
        return jsonify({'error': f'Error processing information with agent: {str(e)}'}), 500




if __name__ == "__main__":
    app.run(debug=True, port=5000, host='0.0.0.0')

    
    