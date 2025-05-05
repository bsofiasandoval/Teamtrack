import { z } from "zod";
import axios from "axios";

export const formSchema = z.object({
    nombre: z.string().min(2, {
        message: "Nombre debe tener al menos 2 caracteres.",
    }),
    apellido: z.string().min(2, {
        message: "Apellido debe tener al menos 2 caracteres.",
    }),
    orgName: z.string().min(2, {
        message: "Nombre de la Organización debe tener al menos 2 caracteres.",
    }),
    orgEmail: z.string().email({
    }),
    orgPassword: z.string().min(8, {
        message: "Contraseña debe tener al menos 8 caracteres.",
    }),
});

export const useOrgSignUp = () => {
    const registerOrg = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("https://teamtrackbackend-production.up.railway.app/organizations/create", {
                org_name: values.orgName,
                domain: values.orgEmail.split("@")[1],
                first_name: values.nombre,
                last_name: values.apellido,
                email: values.orgEmail,
                password: values.orgPassword,
            });

            return { success: true, message: "Organización registrada exitosamente" };
        } catch (error) {
            console.error("Error creando organización:", error);
            const errorMessage = axios.isAxiosError(error) 
                ? error.response?.data?.error || "Error inesperado al registrar la organización."
                : "Error inesperado al registrar la organización.";
            return { success: false, error: errorMessage };
        }
    };

    return { registerOrg };
};
