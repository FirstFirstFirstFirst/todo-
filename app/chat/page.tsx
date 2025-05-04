"use client";
import PageDescription from "@/components/chat/page-description";
import PromptForm from "@/components/chat/prompt-form";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface Message {
  role: string;
  text: string;
}

const ChatPage = () => {
  // const [isSubmitted, setIsSubmitted] = useState(false);
  //manipulate isSubmitted to show ai answer
  const [isSubmitted, setIsSubmitted] = useState(true);
  // const [messages, setMessages] = useState<string[]>(["test1", "test2"]);
  // const [aiResponseMessages, setAiResponseMessages] = useState<string[]>([
  //   "test answer1",
  //   "test answer2",
  // ]);
  const [messages, setMessages] = useState<Message[]>([
    { role: "user", text: "test1" },
    { role: "assistant", text: "test answer1" },
    { role: "user", text: "test2" },
    { role: "assistant", text: "test answer2" },
  ]);
  return (
    <div className="flex flex-col h-full relative bg-black">
      {!isSubmitted && <PageDescription />}
      {/* <div className="w-screen h-full bg-black flex flex-col items-center justify-center space-y-6"> */}
      {isSubmitted && (
        <ScrollArea className="flex-1 py-6 px-4 bg-black">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex flex-col text-white justify-center gap-4 wrap-break-word mt-4 ${
                message.role === "user" ? "items-end" : "items-start"
              }`}
            >
              <Card className="max-w-3xl bg-red-950 text-white p-4 rounded-2xl border-none">
                {message.text}
              </Card>
            </div>
          ))}
        </ScrollArea>
      )}
      <PromptForm
        isSubmitted={isSubmitted}
        setIsSubmitted={setIsSubmitted}
        messages={messages}
        setMessages={setMessages}
      />
      {/* </div> */}
      {/* <div className="bg-black">
        <Card className="h-32 rounded-b-none p-2">
          <PromptForm
            isSubmitted={!isSubmitted}
            setIsSubmitted={setIsSubmitted}
          />
        </Card>
      </div> */}
      {/* <div className="flex">Footer</div> */}
    </div>
  );
};

export default ChatPage;
