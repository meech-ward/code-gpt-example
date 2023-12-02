"use server"

import { db } from "@/db"
import { chats } from "@/db/schema/chats"

import { generateRandomString } from "@/lib/utils"

import { revalidateTag } from "next/cache"

export async function createChat() {
  // user auth 
  const id = generateRandomString(16)

  await db.insert(chats).values({
    id: id,
    name: id,
  })

  revalidateTag("get-chats-for-chat-list")

  return {
    id
  }
}
