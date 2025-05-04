import React from "react";
import ReactMarkdown from "react-markdown";
import { Card } from "../ui/card";

interface ResponseMessageProps {
  message: string | null | undefined;
}

const ResponseMessage = ({ message }: ResponseMessageProps) => {
  // return message ? (
  //   <div className="flex flex-col text-white mt-12 items-start justify-center gap-4 wrap-break-word">
  //     {/* <div>AI Response Message 🤖</div> */}
  //     <Card className="w-2/3 bg-black text-white p-4 rounded-2xl border-none">
  //       <ReactMarkdown>{message}</ReactMarkdown>
  //     </Card>
  //   </div>
  // ) : (
  // <div className="flex flex-col text-white mt-12 items-center justify-center gap-4">
  //   No message provided.
  // </div>
  // <div className="flex flex-col text-white mt-12 items-end justify-center gap-4">
  //   <Card className="w-2/3 bg-black text-white p-4 rounded-2xl border-none">
  //     No message provided.
  //   </Card>
  // </div>
  // );
  return (
    <div className="flex flex-col text-white mt-12 items-start justify-center gap-4 wrap-break-word">
      <Card className="w-2/3 bg-black text-white p-4 rounded-2xl border-none">
        <ReactMarkdown>{message}</ReactMarkdown>
      </Card>
    </div>
  );
};

export default ResponseMessage;
