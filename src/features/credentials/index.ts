import type { VerifiedRegistrationResponse } from '@simplewebauthn/server'
import type { Credentials } from '~/types/database'
import { isoBase64URL } from '@simplewebauthn/server/helpers'
import { eq } from 'drizzle-orm'
import { db } from '~/lib/database'
import { credentials as credentialsTable } from '~/lib/database/schema'

export async function getCredentials({ userId }: { userId: string }) {
  const result = await db
    .select()
    .from(credentialsTable)
    .where(eq(credentialsTable.userId, userId))
    .limit(1)

  if (result.length === 0) {
    throw new Error('Failed to get credential')
  }

  return result[0]
}

export async function createCredentials({ userId, registrationInfo }: { userId: string, registrationInfo: VerifiedRegistrationResponse['registrationInfo'] }) {
  const { credential } = registrationInfo!

  await db.insert(credentialsTable).values({
    id: credential.id,
    publicKey: isoBase64URL.fromBuffer(credential.publicKey),
    aaguid: registrationInfo!.aaguid,
    userId,
    counter: credential.counter,
  })
}

export async function updateCredentials({
  userId,
  credentialData,
}: {
  userId: string
  credentialData: Credentials
}) {
  await db
    .update(credentialsTable)
    .set(credentialData)
    .where(eq(credentialsTable.userId, userId))
}
