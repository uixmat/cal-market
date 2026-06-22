"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const suggestions = [
  "Show me dentists nearby",
  "Book me a dentist nearby",
  "Find ski instructors in Tahoe",
  "Show me veterinarians in Oakland",
];

export default function SearchPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col px-6 py-10">
      <div className="mb-8">
        <h1 className="font-semibold text-3xl tracking-tight">AI Search</h1>
        <p className="mt-2 text-muted-foreground">
          Ask Discover to find or book local services. Try natural language like
          &quot;Show me dentists nearby&quot;.
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <Button
            disabled={isLoading}
            key={suggestion}
            onClick={() => {
              setInput(suggestion);
              void sendMessage({ text: suggestion });
            }}
            size="sm"
            variant="outline"
          >
            {suggestion}
          </Button>
        ))}
      </div>

      <div className="mb-6 min-h-[320px] space-y-4 rounded-2xl border bg-card p-4">
        {messages.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Start a conversation to search listings or get a Cal.com booking
            link.
          </p>
        ) : (
          messages.map((message) => (
            <div
              className={
                message.role === "user"
                  ? "ml-auto max-w-[85%] rounded-xl bg-muted px-4 py-3 text-sm"
                  : "max-w-[85%] rounded-xl border px-4 py-3 text-sm"
              }
              key={message.id}
            >
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <p
                      className="whitespace-pre-wrap"
                      key={`${message.id}-${index}`}
                    >
                      {part.text}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          ))
        )}
      </div>

      <form
        className="flex gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!input.trim() || isLoading) {
            return;
          }
          void sendMessage({ text: input });
          setInput("");
        }}
      >
        <Input
          disabled={isLoading}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Ask Discover..."
          value={input}
        />
        <Button disabled={isLoading || !input.trim()} type="submit">
          Send
        </Button>
      </form>
    </div>
  );
}
