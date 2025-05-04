"use client";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../ui/form";

import { Button } from "../ui/button";
import { ArrowUp } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { Card } from "../ui/card";
import { Message } from "@/app/chat/page";
interface PromptFormProps {
  isSubmitted: boolean;
  setIsSubmitted: (isSubmitted: boolean) => void;
  messages: Message[];
  setMessages: (messages: Message[]) => void;
}

const PromptForm = ({
  isSubmitted,
  setIsSubmitted,
  messages,
  setMessages,
}: PromptFormProps) => {
  const formSchema = z.object({
    prompt: z.string().max(500, {
      message: "Message is exceed 500 words, Please Try Again!",
    }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("value", values);
    setIsSubmitted(true);
    setMessages([
      ...messages,
      {
        role: "user",
        text: values.prompt,
      },
      {
        role: "assistant",
        text: "Waiting for response...",
      },
    ]);

    const response = await fetch("/api/generate-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: values.prompt }),
    });
    if (response.ok) {
      const data = await response.json();
      setMessages([
        ...messages,
        {
          role: "user",
          text: values.prompt,
        },
        {
          role: "assistant",
          text: data,
        },
      ]);
    }
  };

  return (
    <div
      className={`px-6 w-full ${isSubmitted && "px-0 z-10 sticky bottom-0 "}`}
    >
      {!isSubmitted && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2 w-full">
                  <FormControl className="text-white  flex rounded-md">
                    <Textarea
                      className="text-wrap whitespace-normal break-words min-h-28"
                      placeholder="Message Exclusive Chatbot"
                      {...field}
                    />
                  </FormControl>

                  <Button>
                    <ArrowUp />
                  </Button>

                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      )}
      {isSubmitted && (
        <Card className="w-full p-3 rounded-b-none bg-blue-800 border-none  flex flex-col">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-2 w-full">
                    <FormControl className="text-white  flex rounded-md">
                      <Textarea
                        className="text-wrap whitespace-normal break-words min-h-28"
                        placeholder="Message Exclusive Chatbot"
                        {...field}
                      />
                    </FormControl>

                    <Button>
                      <ArrowUp />
                    </Button>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </Card>
      )}
      {/* {isSubmitted && (
        <div className="flex flex-col text-white mt-12 justify-center gap-4 wrap-break-word items-end">
          <Card className="w-2/3 bg-red-950 text-white p-4 rounded-2xl border-none">
            {message}
          </Card>
        </div>
      )} */}
      {/* <ResponseMessage message={aiResponseMessage} /> */}
    </div>
  );
};

export default PromptForm;
