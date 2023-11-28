import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CodeGPT",
  description: "AI Generated Code Prompts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn(inter.className, "w-screen h-screen bg-white dark:bg-black text-black dark:text-white")}>
        {children}
      </body>
    </html>
  );
}
