"use client"

import { useState, useRef } from "react"

import ChatInput from "@/components/chat-input"

import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus as dark } from "react-syntax-highlighter/dist/esm/styles/prism"

import { convertFileToBase64 } from "@/lib/utils"

export default function ChatContent({
  createChat,
  initialAssistantResponse = "",
}: {
  createChat: () => Promise<{id: string}>
  initialAssistantResponse?: string
}) {
  const [assisnantResponse, setAssistantResponse] = useState(initialAssistantResponse)
  const [isLoading, setIsLoading] = useState(false)
  const abortControllerRef = useRef<AbortController | null>(null)
  const [chatId, setChatId] = useState("")

  const handleSubmit = async (value: string, file?: File) => {
    let currentChatId = chatId
    if (!currentChatId) {
      // create a new chat in the database
      const chat = await createChat()
      currentChatId = chat.id
      // and get the id and store it in state
      setChatId(chat.id)
    }

    setIsLoading(true)
    setAssistantResponse("")

    let body = ""
    if (file) {
      const imageUrl = await convertFileToBase64(file)
      const content = [
        {
          type: "image_url",
          image_url: {
            url: imageUrl,
          },
        },
        {
          type: "text",
          text: value,
        },
      ]

      body = JSON.stringify({ content, chatId: currentChatId })
    } else {
      body = JSON.stringify({ content: value, chatId: currentChatId })
    }

    // console.log("submit", value, file);
    try {
      abortControllerRef.current = new AbortController()
      const res = await fetch("/api/message", {
        method: "POST",
        body: body,
        headers: {
          "Content-Type": "application/json",
        },
        signal: abortControllerRef.current.signal,
      })

      if (!res.ok || !res.body) {
        alert("Error sending message")
        return
      }

      const reader = res.body.getReader()

      const decoder = new TextDecoder()
      while (true) {
        const { value, done } = await reader.read()

        const text = decoder.decode(value)
        setAssistantResponse((currentValue) => currentValue + text)

        if (done) {
          break
        }
      }
    } catch (error: any) {
      if (error.name !== "AbortError") {
        alert("Error sending message")
      }
    }
    abortControllerRef.current = null
    setIsLoading(false)
  }

  const handleStop = () => {
    if (!abortControllerRef.current) {
      return
    }
    abortControllerRef.current.abort()
    abortControllerRef.current = null
  }

  return (
    <>
      <div className="max-w-4xl w-full mx-auto flex-1 px-10 py-5 overflow-x-hidden overflow-y-auto prose dark:prose-invert">
        <Markdown
          remarkPlugins={[remarkGfm]}
          components={{
            code(props) {
              const { children, className, node, ...rest } = props
              const match = /language-(\w+)/.exec(className || "")
              return match ? (
                <SyntaxHighlighter
                  PreTag="div"
                  children={String(children).replace(/\n$/, "")}
                  language={match[1]}
                  style={dark}
                  wrapLines={true}
                  wrapLongLines={true}
                />
              ) : (
                <code {...rest} className={className}>
                  {children}
                </code>
              )
            },
          }}
        >
          {assisnantResponse}
        </Markdown>
      </div>
      <ChatInput
        onSubmit={handleSubmit}
        isStreaming={isLoading}
        onStop={handleStop}
      />
    </>
  )
}
