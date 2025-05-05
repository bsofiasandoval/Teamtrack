import Vapi from "@vapi-ai/web";

const VAPI_TOKEN = process.env.NEXT_PUBLIC_VAPI_WEB_TOKEN;

if (!VAPI_TOKEN) {
  throw new Error("VAPI_WEB_TOKEN is not defined in environment variables");
}

export const vapi = new Vapi(VAPI_TOKEN);