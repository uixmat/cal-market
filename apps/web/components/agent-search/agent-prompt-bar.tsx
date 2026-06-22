"use client";

import { ArrowUpIcon } from "lucide-react";
import type * as React from "react";

import { AgentReasoningResponse } from "@/components/agent-search/agent-reasoning";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export function AgentPromptBar({
  disabled,
  onSubmit,
  placeholder = "Ask Discover — e.g. Show me dentists nearby",
  value,
  onChange,
  className,
}: {
  disabled?: boolean;
  onSubmit: () => void;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  className?: string;
}): React.ReactElement {
  return (
    <form
      className={cn("w-full", className)}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <InputGroup className="h-auto rounded-full border border-border/70 bg-background/60 p-1.5 ps-4 shadow-none ring-0 backdrop-blur-sm before:hidden has-[input:focus-visible]:border-border has-[input:focus-visible]:bg-background">
        <InputGroupInput
          aria-label="Search prompt"
          className="h-10 text-base"
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          value={value}
        />
        <InputGroupAddon align="inline-end" className="pe-0 has-[>button]:me-0">
          <Button
            aria-label="Send prompt"
            className="size-10 shrink-0 rounded-full"
            disabled={disabled || !value.trim()}
            size="icon-lg"
            type="submit"
            variant="ghost"
          >
            <ArrowUpIcon className="size-4.5" />
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}

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
    <div className="flex flex-col gap-4 border-border/70 border-t py-5">
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
