'use client'

import type { SignUp } from './schema'
import type { Users } from '~/types/database'
import { zodResolver } from '@hookform/resolvers/zod'
import { IconLoader2 } from 'justd-icons'
import { useState, useTransition } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Button, FieldError, Form, TextField } from 'ui'
import { checkPasskeySupport, createPasskey } from '~/features/passkey'
import { checkUser, clearChallenge, getOptions, getUser, saveChallenge, saveCredential, saveUser, verifyPasskey } from './actions'
import { signUpSchema } from './schema'

export default function SignUpForm() {
  const [isPending, startTransition] = useTransition()
  const [user, setUser] = useState<Users>()
  const [error, setError] = useState('')
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(signUpSchema),
  })

  const signUp = (data: SignUp) => {
    startTransition(async () => {
      setError('')
      setUser(undefined)

      const { userName, email } = data

      // パスキーがサポートされているか確認
      const checkPasskeySupportResult = await checkPasskeySupport()
      if (!checkPasskeySupportResult.success) {
        console.error('checkPasskeySupportResult:', checkPasskeySupportResult)
        setError(checkPasskeySupportResult.error)
        return
      }

      // ユーザーが既に存在するか確認(or メールアドレス確認)
      const checkUserResult = await checkUser(email)
      if (!checkUserResult.success) {
        console.error('checkUserResult:', checkUserResult)
        setError(checkUserResult.error)
        return
      }

      // オプション取得
      const getOptionsResult = await getOptions(userName, email)
      if (!getOptionsResult.success) {
        console.error('getOptionsResult:', getOptionsResult)
        setError(getOptionsResult.error)
        return
      }

      // チャレンジを保存
      const userId = getOptionsResult.data.user.id
      const saveChallengeResult = await saveChallenge(userId, getOptionsResult.data.challenge)
      if (!saveChallengeResult.success) {
        console.error('saveChallengeResult:', saveChallengeResult)
        setError(saveChallengeResult.error)
        return
      }

      // パスキーを作成
      const createPasskeyResult = await createPasskey(getOptionsResult.data)
      if (!createPasskeyResult.success) {
        console.error('createPasskeyResult:', createPasskeyResult)
        setError(createPasskeyResult.error)
        return
      }

      // パスキーを検証
      const verifyPasskeyResult = await verifyPasskey(userId, createPasskeyResult.data)
      if (!verifyPasskeyResult.success) {
        console.error('verifyPasskeyResult:', verifyPasskeyResult)
        setError(verifyPasskeyResult.error)
        return
      }

      // ユーザーを保存
      const saveUserResult = await saveUser(userId, userName, email)
      if (!saveUserResult.success) {
        console.error('saveUserResult:', saveUserResult)
        setError(saveUserResult.error)
        return
      }

      // クレデンシャルを保存
      const saveCredentialResult = await saveCredential(userId, verifyPasskeyResult.data)
      if (!saveCredentialResult.success) {
        console.error('saveCredentialResult:', saveCredentialResult)
        setError(saveCredentialResult.error)
        return
      }

      // チャレンジをクリア
      const clearChallengeResult = await clearChallenge(userId)
      if (!clearChallengeResult.success) {
        console.error('clearChallengeResult:', clearChallengeResult)
        setError(clearChallengeResult.error)
        return
      }

      // ユーザー情報取得
      const getUserResult = await getUser(userId)
      if (!getUserResult.success) {
        console.error('getUserResult:', getUserResult)
        setError(getUserResult.error)
        return
      }

      // 登録完了
      setUser(getUserResult.data)
      alert('登録完了🚀')
    })
  }

  return (
    <Form onSubmit={handleSubmit(signUp)} className="space-y-4">
      <Controller
        name="userName"
        control={control}
        render={({ field }) => (
          <TextField
            isRequired
            autoFocus
            label="User Name"
            isDisabled={isPending}
            {...field}
          />
        )}
      />
      <FieldError>{errors.userName?.message}</FieldError>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextField
            isRequired
            label="Email"
            isDisabled={isPending}
            type="email"
            {...field}
          />
        )}
      />
      <FieldError>{errors.email?.message}</FieldError>
      <Button
        type="submit"
        isDisabled={isPending}
        className="w-full"
      >
        Sign Up
        {isPending && <IconLoader2 className="animate-spin" />}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
      {user && <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>}
    </Form>
  )
}
