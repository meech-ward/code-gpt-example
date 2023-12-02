import { sql } from "drizzle-orm"
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core"

import { chats } from "./chats"
export const messages = sqliteTable("messages", {
  id: integer("id").notNull().primaryKey(),
  chatId: text("chat_id").notNull().references(() => chats.id),
  role: text("role", { enum: ["user", "assistant"] }).notNull(),
  content: text("content").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
})
// id
// chat_id
// content
// role 'user' | 'system' | 'assistant'
// created at
