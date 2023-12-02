import OpenAI from "openai"

import { OpenAIStream, StreamingTextResponse } from "ai"

import { initialProgrammerMessages } from "./messages"

import { db } from "@/db"
import { chats } from "@/db/schema/chats"
import { messages } from "@/db/schema/messages"
import { eq } from "drizzle-orm"

export const runtime = "edge"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  const { content, chatId } = await req.json()

  // check if the user is logged in
  // make sure that chat belongs to them
  if (!chatId) {
    return new Response("chatId is required", { status: 400 })
  }

  const chat = await db.select().from(chats).where(eq(chats.id, chatId)).get()

  if (!chat) {
    return new Response("chat is not found", { status: 400 })
  }

  const allDBMessages = await db
    .select({
      role: messages.role,
      content: messages.content,
    })
    .from(messages)
    .where(eq(messages.chatId, chatId))
    .orderBy(messages.createdAt)
    .all()

  const chatCompletion = await openai.chat.completions.create({
    messages: [...initialProgrammerMessages, ...allDBMessages, { role: "user", content }],
    model: "gpt-4-vision-preview",
    stream: true,
    max_tokens: 4096,
  })

  const stream = OpenAIStream(chatCompletion, {
    onStart: async () => {},
    onToken: async (token: string) => {},
    onCompletion: async (completion: string) => {
      try {
        await db.insert(messages).values([
          {
            chatId,
            role: "user",
            content,
          },
          {
            chatId,
            role: "assistant",
            content: completion,
          },
        ])
      } catch (e) {
        console.error(e)
      }
    },
  })

  return new StreamingTextResponse(stream)
}
