"use server"

import { db } from "@/db"
import { chats } from "@/db/schema/chats"
import { generateRandomString } from "@/lib/utils"
import { revalidateTag } from "next/cache"

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"


export async function createChat() {

  const { getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user) {
     return {error: "not logged in"}
  }
  
  const id = generateRandomString(16)
  await db.insert(chats).values({
    id: id,
    name: id,
    userId: user.id,
  })

  revalidateTag("get-chats-for-chat-list")

  return {
    id
  }
}

export type CreateChat = typeof createChat