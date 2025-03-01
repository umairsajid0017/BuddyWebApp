import { useState } from "react";
import { Button } from "./button";

export function CollapsibleText({ text, maxLength = 150 }: { text: string; maxLength?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // If text is shorter than maxLength, just show it
  if (!text || text.length <= maxLength) {
    return <div>{text}</div>;
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div className="text-sm text-muted-foreground">
        {isExpanded ? text : text.substring(0, maxLength) + "..."}
      </div>
      <Button 
        variant="link" 
        className="p-0 h-auto text-xs mt-1" 
        onClick={toggleExpand}
      >
        {isExpanded ? "See less" : "See more"}
      </Button>
    </div>
  );
}