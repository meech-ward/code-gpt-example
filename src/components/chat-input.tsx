"use client";

import { useState } from "react";
import GrowingTextArea from "./growing-text-area";
import { cn } from "@/lib/utils";

import ImageSelection from "./image-selection";

export default function ExpandingInput({
  onSubmit,
  onStop,
  isStreaming,
}: {
  onSubmit?: (value: string, file?: File) => void;
  onStop?: () => void;
  isStreaming?: boolean;
}) {
  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined
  );

  const submit = (value: string) => {
    onSubmit?.(value, selectedImage);
    setContent("");
    setSelectedImage(undefined);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(content);
  };

  const buttonDisabled = content.length === 0 || isStreaming;

  return (
    <div className="w-full my-10">
      <form
        onSubmit={handleSubmit}
        className="w-full flex flex-col gap-y-4 px-4 relative max-w-5xl mx-auto"
      >
        <ImageSelection
          selectedImage={selectedImage}
          setSelectedImage={setSelectedImage}
        />
        <GrowingTextArea
          className="w-full bg-transparent border border-gray-500 rounded-2xl outline-none resize-none pl-12 pr-14 py-4 scrollbar-content overflow-y-auto overflow-x-clip overscroll-contain"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className="flex absolute right-0 bottom-0 px-1 py-1 mr-7 mb-2 rounded-2xl z-10 w-10 h-10 items-center justify-center dark:fill-neutral-300 :fill-neutral-700 dark:hover:fill-neutral-100 hover:fill-neutral-900 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="m12,0C5.383,0,0,5.383,0,12s5.383,12,12,12,12-5.383,12-12S18.617,0,12,0Zm0,22c-5.514,0-10-4.486-10-10S6.486,2,12,2s10,4.486,10,10-4.486,10-10,10Zm2-15h-4c-1.654,0-3,1.346-3,3v4c0,1.654,1.346,3,3,3h4c1.654,0,3-1.346,3-3v-4c0-1.654-1.346-3-3-3Zm1,7c0,.551-.449,1-1,1h-4c-.551,0-1-.449-1-1v-4c0-.551.449-1,1-1h4c.551,0,1,.449,1,1v4Z" />
            </svg>
          </button>
        ) : (
          <button
            className={cn(
              "flex absolute right-0 bottom-0 px-1 py-1 mr-7 mb-2 dark:bg-white bg-black rounded-2xl z-10 w-10 h-10 items-center justify-center",
              buttonDisabled && "opacity-50"
            )}
            disabled={buttonDisabled}
            type="submit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              className="text-white dark:text-black w-7 h-7"
            >
              <title>Submit</title>
              <path
                d="M7 11L12 6L17 11M12 18V7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
        )}
      </form>
    </div>
  );
}
