import ChatContent from "./chat-content"
import { createChat } from "./actions"

import { db } from "@/db"
import { eq, desc, and } from "drizzle-orm"
import { messages as messagesTable } from "@/db/schema/messages"

export default async function ChatContentWrapper({
  chatId,
}: {
  chatId: string
}) {
  const message = await db
    .select()
    .from(messagesTable)
    .where(
      and(eq(messagesTable.chatId, chatId), eq(messagesTable.role, "assistant"))
    )
    .orderBy(desc(messagesTable.createdAt))
    .get()

  return <ChatContent createChat={createChat} initialAssistantResponse={message?.content} />
}
