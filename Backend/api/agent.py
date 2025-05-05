from typing import List
from rich.pretty import pprint
from pydantic import BaseModel, Field
from agno.agent import Agent, RunResponse
from agno.models.openai import OpenAIChat
from dotenv import load_dotenv


load_dotenv()

class NotesData(BaseModel):
    title: str = Field(..., title="The title of the conversation.")
    summary: str = Field(..., title="A summarized version of the conversation only with the most important information and maximum length of 500 characters.")
    importantTopics: List[str] = Field(..., title="A list of the most important topics discussed in the conversation.")
    questions: List[str] = Field(..., title="A list of the most important questions raised in the conversation.")
    decisions: List[str] = Field(..., title="A list of the most important decisions made in the conversation.")

agentNotetaking = Agent(
    model=OpenAIChat(id="gpt-4o"),
    description="You are an AI Notetaker for a Company's Videoconferences and Meetings. Provide relevant notes about the key topics of a transcript of a meeting. Put the information in spanish",
    response_model=NotesData,
)

#create a function that will receive the text and return the data
def runNotetakingAgent(transcript: str):
    response = agentNotetaking.run(transcript)
    print(response.content.dict())
    return response.content.dict()

class ReportData(BaseModel):
    improvingPoints: List[str] = Field(..., title="A list of the most important points that can be improved in the conversation.")
    positiveFeedback: List[str] = Field(..., title="A list of the most positive feedback in the conversation.")
    negativeFeedback: List[str] = Field(..., title="A list of the most negative feedback in the conversation.")
    keywords: List[str] = Field(..., title="A list of the most important keywords discussed in the conversation.")
    nextSteps: List[str] = Field(..., title="A list of the next steps to be taken after the conversation.")

agentReport = Agent(
    model=OpenAIChat(id="gpt-4o"),
    description="You are an AI that can analyze a conversation and provide feedback on the most important points discussed in the conversation. Give the information in spanish",
    response_model=ReportData,
)

#create a function that will receive the text and return the data
def runReportAgent(transript: str):
    response = agentReport.run(transript)
    print(response.content.dict())
    return response.content.dict()

class EmailData(BaseModel):
    subject: str = Field(..., title="The subject of the email.")
    body: str = Field(..., title="The body of the email.")

agentEmail = Agent(
    model=OpenAIChat(id="gpt-4o"),
    description="You are an AI that can write emails giving the next steps to be taken after the conversation basing it on the information provided asume they know you are an agent so do not put names or emails. Give the information in spanish",
    response_model=EmailData,
)

def runEmailAgent(information: str):
    response = agentEmail.run(information)
    print(response.content.dict())
    return response.content.dict()




    
    
