"use client";
import PageDescription from "@/components/chat/page-description";
import PromptForm from "@/components/chat/prompt-form";
import { Card } from "@/components/ui/card";
import { useRef, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@ai-sdk/react";
import ReactMarkdown from "react-markdown";
export interface Message {
  role: string;
  text: string;
}

const ChatPage = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/generate-response",
    onFinish: () => {
      console.log("onFinish");
      if (messagesEndRef.current && messagesEndRef.current.scrollIntoView) {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    },
  });

  const isSubmitted = messages.length !== 0;

  return (
    <div
      className={`flex flex-col h-full w-full relative bg-black text-white ${
        !isSubmitted && "justify-center"
      }`}
    >
      {!isSubmitted && <PageDescription />}
      {isSubmitted && (
        <div className="flex-1 py-6 px-4 bg-black">
          <ScrollArea className="bg-black">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex flex-col text-white justify-center gap-4 mt-4 ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <Card
                  className={`max-w-2xl  text-white p-4 rounded-2xl border-none break-words ${
                    message.role === "user" ? "bg-red-950" : "bg-black"
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </Card>
              </div>
            ))}
          </ScrollArea>
          <div ref={messagesEndRef} />
        </div>
      )}

      <PromptForm
        messages={messages}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        input={input}
      />
    </div>
  );
};

export default ChatPage;
