'use server'

import type { AuthenticationResponseJSON } from '@simplewebauthn/server'
import type { Credentials, Users } from '~/types/database'
import type { Result } from '~/types/result'
import { generateAuthenticationOptions, verifyAuthenticationResponse } from '@simplewebauthn/server'
import { isoBase64URL } from '@simplewebauthn/server/helpers'
import { deleteChallenge, getChallenge, upsertChallenge } from '~/features/challenges'
import { getCredentials, updateCredentials } from '~/features/credentials'
import { getUserById } from '~/features/users'

export async function getOptions(): Promise<Result<PublicKeyCredentialRequestOptionsJSON, string>> {
  try {
    const options = await generateAuthenticationOptions({
      userVerification: 'preferred',
      timeout: 300000,
      rpID: process.env.DOMAIN || 'localhost',
    })

    return {
      success: true,
      data: options,
    }
  }
  catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

export async function checkUser(id: string): Promise<Result<null, string>> {
  try {
    const user = await getUserById(id)
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      }
    }

    return {
      success: true,
      data: null,
    }
  }
  catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

export async function saveChallenge(userId: string, challenge: string): Promise<Result<null, string>> {
  try {
    await upsertChallenge({ userId, challenge })

    return {
      success: true,
      data: null,
    }
  }
  catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

export async function verifyPasskey(userId: string, response: AuthenticationResponseJSON): Promise<Result<Credentials, string>> {
  try {
    const challenge = await getChallenge({ userId })
    const credentials = await getCredentials({ userId })
    const credential = {
      id: credentials.id,
      publicKey: isoBase64URL.toBuffer(credentials.publicKey),
      counter: credentials.counter || 0,
    }

    const verification = await verifyAuthenticationResponse({
      response,
      credential,
      expectedChallenge: challenge,
      expectedOrigin: process.env.URL || 'http://localhost:3000',
      expectedRPID: process.env.DOMAIN || 'localhost',
    })
    if (!verification.verified) {
      return {
        success: false,
        error: 'Authentication failed',
      }
    }

    return {
      success: true,
      data: credentials,
    }
  }
  catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

export async function updateCredentialCounter(userId: string, credentials: Credentials): Promise<Result<null, string>> {
  try {
    await updateCredentials({
      userId,
      credentialData: { ...credentials, counter: credentials.counter! + 1 },
    })

    return {
      success: true,
      data: null,
    }
  }
  catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

export async function clearChallenge(userId: string): Promise<Result<null, string>> {
  try {
    await deleteChallenge({ userId })

    return {
      success: true,
      data: null,
    }
  }
  catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

export async function getUser(userId: string): Promise<Result<Users, string>> {
  try {
    const user = await getUserById(userId)
    if (!user) {
      return {
        success: false,
        error: 'User not found',
      }
    }

    return {
      success: true,
      data: user,
    }
  }
  catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}
