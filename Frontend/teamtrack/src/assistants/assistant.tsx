import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";

export const createAssistant = (data: any): CreateAssistantDTO | any => {
  console.log("Creating assistant with data:", data);
  
  const config = {
    name: `Teambot-${Date.now()}`,
    transcriber: {
    provider: "deepgram",
    language: "es",
    
  },
    model: {
      provider: "openai",
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      systemPrompt: `Eres Teambot, un asistente AI que ayuda a analizar transcripciones de llamadas y documentos. Cuando se proporciona un documento, utiliza el contexto en tus respuestas para proporcionar insights relevantes y responder preguntas sobre el contenido. Siempre comunica en español y mantiene un tono profesional y útil.

Contexto del documento:
${JSON.stringify(data, null, 2)}`,
    },
    voice: {
      provider: "openai",
      voiceId: "echo",
    },
    firstMessage: "Hola, soy Teambot. ¿En qué puedo ayudarte con el análisis del documento?",
    serverUrl: process.env.NEXT_PUBLIC_SERVER_URL
      ? process.env.NEXT_PUBLIC_SERVER_URL
      : "https://08ae-202-43-120-244.ngrok-free.app/api/webhook",
  };
  
  console.log("Assistant configuration:", config);
  return config;
};