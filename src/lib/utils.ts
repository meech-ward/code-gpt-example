import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export async function* makeStreamAsyncIterator(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<string, void, undefined> {
  const textDecoder = new TextDecoder();
  while (true) {
    const { done, value } = await reader.read();
    const chunkAsString = textDecoder.decode(value);
    if (done) break;
    yield chunkAsString;
  }
}

export function generateRandomString(bytes: number) {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const crypto = require("crypto");
    return crypto.randomBytes(bytes).toString("hex");
  }

  const array = new Uint8Array(bytes);
  crypto.getRandomValues(array);
  return [...array].map((b) => b.toString(16).padStart(2, "0")).join("");
}

