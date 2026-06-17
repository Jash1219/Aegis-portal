"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ClipboardCopyIcon } from "lucide-react";
import MonacoViewer from "./MonacoViewer";

interface TechnicalDetailsAccordionProps {
  requestJson: string;
  responseJson: string | null;
}

export default function TechnicalDetailsAccordion({
  requestJson,
  responseJson,
}: TechnicalDetailsAccordionProps) {
  const handleCopy = (json: string) => {
    navigator.clipboard.writeText(json);
  };

  return (
    <Accordion>
      <AccordionItem value="request-payload">
        <AccordionTrigger>Request Payload</AccordionTrigger>
        <AccordionContent>
          <div className="space-y-3">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(requestJson)}
                className="gap-1.5"
              >
                <ClipboardCopyIcon className="h-3.5 w-3.5" />
                Copy JSON
              </Button>
            </div>
            <MonacoViewer value={requestJson} height="320px" />
          </div>
        </AccordionContent>
      </AccordionItem>
      {responseJson && (
        <AccordionItem value="response-payload">
          <AccordionTrigger>Response Payload</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(responseJson)}
                  className="gap-1.5"
                >
                  <ClipboardCopyIcon className="h-3.5 w-3.5" />
                  Copy JSON
                </Button>
              </div>
              <MonacoViewer value={responseJson} height="320px" />
            </div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  );
}
