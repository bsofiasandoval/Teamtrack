import { CALL_STATUS } from "@/hooks/useVapi";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";

interface AssistantButtonProps {
  data: any;
  toggleCall: () => void;
  callStatus: CALL_STATUS;
  audioLevel: number;
}

export function AssistantButton({
  data,
  toggleCall,
  callStatus,
  audioLevel = 0,
}: AssistantButtonProps) {
  return (
    <Button
      onClick={toggleCall}
      className="bg-[#F0E6FF] hover:bg-[#E6D9FF] text-[#6941C6] hover:text-[#6941C6]"
    >
      {callStatus === "active" ? (
        <Mic className="h-4 w-4" style={{ opacity: audioLevel }} />
      ) : (
        <MicOff className="h-4 w-4" />
      )}
    </Button>
  );
}