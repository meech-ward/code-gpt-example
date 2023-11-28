"use client";

import ChatInput from "@/components/chat-input";

export default function ChatContent() {
  const handleSubmit = (value: string, file?: File) => {
    console.log("submit", value, file);
  };
  return (
    <>
      <div className="max-w-4xl w-full mx-auto flex-1 px-10 py-5 overflow-x-hidden overflow-y-auto">
        AI Content goes here
      </div>
      <ChatInput onSubmit={handleSubmit} />
    </>
  );
}
