'use client';

import { useVapi } from "@/hooks/useVapi";
import { AssistantButton } from "../assistantButton";
import { useEffect } from "react";

interface AssistantProps {
  data: any;
}

export function Assistant({ data }: AssistantProps) {
  const { callStatus, audioLevel, toggleCall, updateData } = useVapi();

  useEffect(() => {
    console.log("Assistant received new data:", data);
    if (data) {
      console.log("Updating VAPI with data:", data);
      updateData(data);
    }
  }, [data, updateData]);

  return (
    <AssistantButton 
      data={data}
      callStatus={callStatus}
      audioLevel={audioLevel}
      toggleCall={toggleCall}
    />
  );
}