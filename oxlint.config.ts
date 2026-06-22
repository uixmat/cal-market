import { defineConfig } from "oxlint";
import core from "ultracite/oxlint/core";
import next from "ultracite/oxlint/next";
import react from "ultracite/oxlint/react";

export default defineConfig({
  extends: [core, react, next],
  ignorePatterns: [
    ...core.ignorePatterns,
    "**/.agents/**",
    "**/.claude/**",
    "**/node_modules/**",
    "**/components/ui/**",
    "**/hooks/**",
  ],
  overrides: [
    {
      files: ["apps/agent/**"],
      rules: {
        "unicorn/filename-case": "off",
      },
    },
    {
      files: ["packages/**", "apps/**"],
      rules: {
        "func-style": "off",
        "oxc/no-barrel-file": "off",
        "prefer-named-capture-group": "off",
        "require-await": "off",
        "require-unicode-regexp": "off",
      },
    },
  ],
});
