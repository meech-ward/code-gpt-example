"use client";

import { useState, useEffect, useRef, TextareaHTMLAttributes } from "react";

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

const GrowingTextArea = (props: Props) => {
  const [textAreaValue, setTextAreaValue] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [textAreaValue, props.value]);

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onChange
      ? props.onChange(event)
      : setTextAreaValue(event.target.value);
  };

  const handleContentKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const form = textAreaRef.current?.closest("form");
      if (form) {
        form.requestSubmit();
      }
    }
  };

  return (
    <textarea
      {...props}
      ref={textAreaRef}
      value={props.value ?? textAreaValue}
      onChange={handleInputChange}
      onKeyDown={handleContentKeyDown}
      style={{ resize: "none" }}
      rows={1}
    />
  );
};

export default GrowingTextArea;
