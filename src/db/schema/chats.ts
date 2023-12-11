import { sql } from "drizzle-orm"
import { sqliteTable, text, index } from "drizzle-orm/sqlite-core"

export const chats = sqliteTable(
  "chats",
  {
    id: text("id").notNull().primaryKey(),
    userId: text("user_id").notNull(),
    name: text("name").notNull(),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  },
  (table) => {
    return {
      userIdIndex: index("chats_auth_user_id_idx").on(table.userId),
    }
  }
)

//  id
// name
// created
