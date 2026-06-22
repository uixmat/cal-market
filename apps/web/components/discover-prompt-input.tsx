"use client";

import { ArrowUpIcon } from "lucide-react";
import type * as React from "react";
import { useState } from "react";

import { AiOrb } from "@/components/ai-orb";
import type { AiOrbState } from "@/components/ai-orb";
import {
  TypingPlaceholderOverlay,
  promptInputFieldClassName,
} from "@/components/typing-placeholder";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { cn } from "@/lib/utils";

export const discoverPromptInputClassName =
  "h-auto rounded-full border border-white/20 bg-black/45 p-1.5 shadow-lg ring-0 backdrop-blur-md before:hidden dark:border-white/15 dark:bg-black/70 has-[input:focus-visible]:border-white/35 has-[input:focus-visible]:ring-[3px] has-[input:focus-visible]:ring-white/15";

function resolveOrbState(focused: boolean, working: boolean): AiOrbState {
  if (working) {
    return "thinking";
  }

  if (focused) {
    return "active";
  }

  return "resting";
}

export function DiscoverPromptInput({
  className,
  disabled = false,
  onChange,
  onSubmit,
  value,
  working = false,
}: {
  className?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
  value: string;
  working?: boolean;
}): React.ReactElement {
  const [focused, setFocused] = useState(false);
  const orbState = resolveOrbState(focused, working);

  return (
    <form
      className={cn("w-full", className)}
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <InputGroup
        className={cn(discoverPromptInputClassName, "text-left")}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) {
            setFocused(false);
          }
        }}
        onFocus={() => setFocused(true)}
      >
        <InputGroupAddon
          align="inline-start"
          className="self-center shrink-0 ps-0.5 pe-1.5"
        >
          <AiOrb size={36} state={orbState} />
        </InputGroupAddon>
        <div
          className={cn(
            "relative min-w-0 flex-1 self-center",
            promptInputFieldClassName
          )}
        >
          {!value && !working && !focused && (
            <TypingPlaceholderOverlay active className="z-0" />
          )}
          <InputGroupInput
            aria-label="Ask Discover"
            className={cn(
              "relative z-10 [&_[data-slot=input]]:placeholder:text-transparent",
              !value && !focused && "[&_[data-slot=input]]:caret-transparent",
              (value || focused) && "[&_[data-slot=input]]:caret-white"
            )}
            disabled={disabled}
            onChange={(event) => onChange(event.target.value)}
            placeholder=""
            unstyled
            value={value}
          />
        </div>
        <InputGroupAddon align="inline-end" className="pe-0 has-[>button]:me-0">
          <Button
            aria-label="Send prompt"
            className="size-10 shrink-0 rounded-full text-white hover:bg-white/15 hover:text-white"
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
