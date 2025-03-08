import type { AuthenticationResponseJSON, PublicKeyCredentialCreationOptionsJSON, RegistrationResponseJSON } from '@simplewebauthn/server'
import type { Result } from '~/types/result'
import { base64URLToBuffer, bufferToBase64URL } from '~/utils/buffer'

export async function checkPasskeySupport(): Promise<Result<null, string>> {
  try {
    if (!window.PublicKeyCredential
      || !PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable
      || !PublicKeyCredential.isConditionalMediationAvailable) {
      return {
        success: false,
        error: 'WebAuthn is not supported in this browser',
      }
    }

    return {
      success: true,
      data: null,
    }
  }
  catch (error) {
    console.error('Error checking passkey support:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

export async function createPasskey(options: PublicKeyCredentialCreationOptionsJSON): Promise<Result<RegistrationResponseJSON, string>> {
  try {
    // 無念の変換処理（他に良い方法があれば教えてください）
    const publicKey: PublicKeyCredentialCreationOptions = {
      ...options,
      challenge: new Uint8Array(base64URLToBuffer(options.challenge)),
      user: {
        ...options.user,
        id: new Uint8Array(base64URLToBuffer(options.user.id)),
      },
      excludeCredentials: options.excludeCredentials?.map(cred => ({
        ...cred,
        id: new Uint8Array(base64URLToBuffer(cred.id)),
        transports: cred.transports?.filter(transport => transport !== 'cable') as AuthenticatorTransport[],
      })),
    }

    const credential = await navigator.credentials.create({ publicKey }) as PublicKeyCredential | null
    if (!credential) {
      throw new Error('Failed to obtain credentials')
    }

    const credentialResponse = credential.response as AuthenticatorAttestationResponse
    const credentialData: RegistrationResponseJSON = {
      id: bufferToBase64URL(credential.rawId),
      rawId: bufferToBase64URL(credential.rawId),
      response: {
        attestationObject: bufferToBase64URL(credentialResponse.attestationObject),
        clientDataJSON: bufferToBase64URL(credentialResponse.clientDataJSON),
      },
      type: credential.type as 'public-key',
      clientExtensionResults: credential.getClientExtensionResults(),
    }

    return {
      success: true,
      data: credentialData,
    }
  }
  catch (error) {
    console.error('Error creating passkey:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}

export async function getPasskey(options: PublicKeyCredentialRequestOptionsJSON): Promise<Result<AuthenticationResponseJSON, string>> {
  try {
    const publicKey: PublicKeyCredentialRequestOptions = {
      ...options,
      userVerification: options.userVerification as UserVerificationRequirement,
      challenge: base64URLToBuffer(options.challenge),
      allowCredentials: options.allowCredentials?.map(cred => ({
        id: base64URLToBuffer(cred.id),
        transports: cred.transports?.filter((t): t is AuthenticatorTransport =>
          ['usb', 'ble', 'nfc', 'internal'].includes(t),
        ),
        type: 'public-key',
      })),

    }

    const credential = await navigator.credentials.get({
      publicKey,
    }) as PublicKeyCredential | null
    if (!credential) {
      throw new Error('Failed to obtain credentials')
    }

    const credentialResponse = credential.response as AuthenticatorAssertionResponse
    const credentialData: AuthenticationResponseJSON = {
      id: bufferToBase64URL(credential.rawId),
      rawId: bufferToBase64URL(credential.rawId),
      response: {
        clientDataJSON: bufferToBase64URL(credentialResponse.clientDataJSON),
        authenticatorData: bufferToBase64URL(credentialResponse.authenticatorData),
        signature: bufferToBase64URL(credentialResponse.signature),
        userHandle: credentialResponse.userHandle
          ? bufferToBase64URL(credentialResponse.userHandle)
          : undefined,
      },
      type: credential.type as 'public-key',
      clientExtensionResults: credential.getClientExtensionResults(),
    }

    return {
      success: true,
      data: credentialData,
    }
  }
  catch (error) {
    console.error('Error creating passkey:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    }
  }
}
