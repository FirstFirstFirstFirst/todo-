import PageDescription from "@/components/chat/page-description";
import PromptForm from "@/components/chat/prompt-form";
import React from "react";

const ChatPage = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="w-screen h-full bg-black flex flex-col items-center justify-center space-y-6">
        <PageDescription />
        <PromptForm />
      </div>
      <div className="flex">Footer</div>
    </div>
  );
};

export default ChatPage;
