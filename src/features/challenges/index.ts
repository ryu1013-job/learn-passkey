import { eq } from 'drizzle-orm'
import { db } from '~/lib/database'
import { challenges } from '~/lib/database/schema'

export async function getChallenge({ userId }: { userId: string }): Promise<string> {
  const result = await db
    .select({ challenge: challenges.challenge })
    .from(challenges)
    .where(eq(challenges.userId, userId))
    .limit(1)

  if (result.length === 0 || !result[0].challenge) {
    throw new Error('Failed to get challenge')
  }
  return result[0].challenge
}

export async function upsertChallenge({ userId, challenge }: { userId: string, challenge: string }): Promise<void> {
  const expiresAt = new Date(Date.now() + 300000) // 現在時刻 + 5分
  await db
    .insert(challenges)
    .values({
      userId,
      challenge,
      expiresAt,
    })
    .onConflictDoUpdate({
      target: [challenges.userId],
      set: {
        challenge,
        expiresAt,
      },
    })
}

export async function deleteChallenge({ userId }: { userId: string }): Promise<void> {
  await db
    .delete(challenges)
    .where(eq(challenges.userId, userId))
}
