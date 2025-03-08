import { eq } from 'drizzle-orm'
import { db } from '~/lib/database'
import { users } from '~/lib/database/schema'
import 'server-only'

export async function getUsers() {
  return await db.select().from(users)
}

export async function getUserById(id: string) {
  const data = await db.select().from(users).where(eq(users.id, id))
  if (data.length === 0)
    return null
  return data[0]
}

export async function getUserByEmail(email: string) {
  const data = await db.select().from(users).where(eq(users.email, email))
  if (data.length === 0)
    return null
  return data[0]
}

export async function createUser({ id, email, name }: { id: string, email: string, name: string }) {
  await db.insert(users).values({ id, email, displayName: name })
}
