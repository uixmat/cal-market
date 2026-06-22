"use client";

import type * as React from "react";

import { AgentReasoningResponse } from "@/components/agent-search/agent-reasoning";

export function AgentExchangeGhost({
  assistantText = "",
  isLoading,
  userText,
}: {
  assistantText?: string;
  isLoading?: boolean;
  userText: string;
}): React.ReactElement {
  const isStreaming = Boolean(isLoading);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <p className="font-medium text-muted-foreground text-xs uppercase tracking-[0.12em]">
          You asked
        </p>
        <p className="text-balance font-medium text-base text-foreground sm:text-lg">
          {userText}
        </p>
      </div>

      <AgentReasoningResponse
        isStreaming={isStreaming}
        responseKey={userText}
        text={assistantText}
      />
    </div>
  );
}
