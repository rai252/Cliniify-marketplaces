"use client";
import { useState, useEffect } from "react";
import DOMPurify from "dompurify";
import { Button } from "@/components/ui/button";

interface SummaryProps {
  summary: string;
}

const Summary: React.FC<SummaryProps> = ({ summary }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [displayedSummary, setDisplayedSummary] = useState("");

  useEffect(() => {
    const sanitizedSummary = DOMPurify.sanitize(summary || "");
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitizedSummary;
    const textContent = tempDiv.textContent || tempDiv.innerText || "";

    const truncatedText = textContent.substring(0, 300) + "...";

    setDisplayedSummary(isExpanded ? sanitizedSummary : truncatedText);
  }, [summary, isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <div
        className="  text-lg text-gray-700"
        dangerouslySetInnerHTML={{ __html: displayedSummary }}
      />
      {summary.length > 300 && (
        <Button
          onClick={toggleExpand}
          variant="link"
          className="  text-teal-600 p-0 mt-2"
        >
          {isExpanded ? "Show Less" : "Show More"}
        </Button>
      )}
    </div>
  );
};

export default Summary;
