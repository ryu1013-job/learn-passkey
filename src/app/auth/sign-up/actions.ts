'use server'

import type { PublicKeyCredentialCreationOptionsJSON, RegistrationResponseJSON, VerifiedRegistrationResponse } from '@simplewebauthn/server'
import type { Users } from '~/types/database'
import type { Result } from '~/types/result'
import { generateRegistrationOptions, verifyRegistrationResponse } from '@simplewebauthn/server'
import { getChallenge } from '~/features/challenges'
import { deleteChallenge, upsertChallenge } from '~/features/challenges/'
import { createCredentials } from '~/features/credentials'
import { createUser, getUserByEmail, getUserById } from '~/features/users'

export async function checkUser(email: string): Promise<Result<null, string>> {
  try {
    const user = await getUserByEmail(email)
    if (user) {
      return {
        success: false,
        error: 'User already exists',
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

export async function getOptions(userName: string, email: string): Promise<Result<PublicKeyCredentialCreationOptionsJSON, string>> {
  try {
    const options = await generateRegistrationOptions({
      rpName: 'Learn Passkey',
      rpID: process.env.DOMAIN || 'localhost',
      userName: email,
      userDisplayName: userName,
      authenticatorSelection: {
        authenticatorAttachment: 'platform',
      },
      timeout: 300000,
      attestationType: 'none',
      excludeCredentials: [],
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

export async function verifyPasskey(userId: string, response: RegistrationResponseJSON): Promise<Result<VerifiedRegistrationResponse['registrationInfo'], string>> {
  try {
    const challenge = await getChallenge({ userId })

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge: challenge,
      expectedOrigin: process.env.URL || 'http://localhost:3000',
      expectedRPID: process.env.DOMAIN || 'localhost',
      requireUserPresence: true,
      requireUserVerification: false,
    })
    const { verified, registrationInfo } = verification
    if (!verified || !registrationInfo) {
      return {
        success: false,
        error: 'Registration failed',
      }
    }

    return {
      success: true,
      data: registrationInfo,
    }
  }
  catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

export async function saveUser(userId: string, userName: string, email: string): Promise<Result<null, string>> {
  try {
    await createUser({ id: userId, name: userName, email })

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

export async function saveCredential(userId: string, registrationInfo: VerifiedRegistrationResponse['registrationInfo']): Promise<Result<null, string>> {
  try {
    await createCredentials({ userId, registrationInfo })

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
