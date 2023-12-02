import { db } from "@/db"
import { chats as chatsTable } from "@/db/schema/chats"
import { unstable_cache as cache } from "next/cache"
import Link from "next/link"

const getChats = cache(
  async () =>
    await db
      .select({ id: chatsTable.id, name: chatsTable.name })
      .from(chatsTable)
      .all(),
  ["get-chats-for-chat-list"],
  {
    tags: ["get-chats-for-chat-list"],
  }
)

export default async function ChatList() {
  const chats = await getChats()

  return (
    <div className="flex flex-col p-10 gap-y-4">
      {chats.map((chat) => (
        <Link key={chat.id} href={`/${chat.id}`} className="truncate">
          {chat.name}
        </Link>
      ))}
    </div>
  )
}

export function ChatListSkeleton() {
  return (
    <div className="flex flex-col p-10 gap-y-4">
      {[...Array(5)].map((_, index) => (
        <div key={index} className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 h-10 w-10"></div>
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-gray-300 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-gray-300 rounded col-span-2"></div>
                <div className="h-2 bg-gray-300 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
