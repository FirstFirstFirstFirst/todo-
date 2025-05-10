"use client";
import { ChangeEvent } from "react";
import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { UIMessage } from "ai";
import { Card } from "../ui/card";

interface PromptFormProps {
  messages: UIMessage[];
  handleInputChange: (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  input: string;
}

const PromptForm = ({
  messages,
  handleInputChange,
  input,
  handleSubmit,
}: PromptFormProps) => {
  const isSubmitted = messages.length !== 0;

  return (
    <div
      className={`px-6 w-full ${isSubmitted && "px-0 z-10 sticky bottom-0 "}`}
    >
      {!isSubmitted && (
        <div className="">
          <form
            className="flex flex-col gap-2 w-full rounded-md mt-4"
            onSubmit={handleSubmit}
          >
            <Textarea
              className="text-wrap whitespace-normal break-words min-h-28 "
              placeholder="Message Exclusive Chatbot"
              onChange={handleInputChange}
              value={input}
            />

            <Button className="w-full ">
              <ArrowUp />
            </Button>
          </form>
        </div>
      )}

      {isSubmitted && (
        <Card className="w-full p-3 rounded-b-none bg-blue-800 border-none flex flex-col">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2 w-full text-white rounded-md">
              <Textarea
                className="text-wrap whitespace-normal break-words min-h-28"
                placeholder="Message Exclusive Chatbot"
                onChange={handleInputChange}
                value={input}
              />
              <Button className="w-full ">
                <ArrowUp />
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};

export default PromptForm;
