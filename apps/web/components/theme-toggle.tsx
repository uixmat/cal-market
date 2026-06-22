"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import type * as React from "react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const iconTransition = { bounce: 0, duration: 0.3, type: "spring" as const };

export function ThemeToggle({
  className,
}: {
  className?: string;
}): React.ReactElement | null {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        aria-label="Toggle theme"
        className={className}
        size="icon"
        variant="ghost"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn("relative overflow-hidden", className)}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      size="icon"
      variant="ghost"
    >
      <motion.span
        animate={{
          filter: isDark ? "blur(4px)" : "blur(0px)",
          opacity: isDark ? 0 : 1,
          scale: isDark ? 0.25 : 1,
        }}
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        transition={iconTransition}
      >
        <SunIcon />
      </motion.span>
      <motion.span
        animate={{
          filter: isDark ? "blur(0px)" : "blur(4px)",
          opacity: isDark ? 1 : 0,
          scale: isDark ? 1 : 0.25,
        }}
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        transition={iconTransition}
      >
        <MoonIcon />
      </motion.span>
    </Button>
  );
}
