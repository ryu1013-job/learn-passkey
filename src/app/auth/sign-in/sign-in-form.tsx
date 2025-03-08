'use client'

import type { Users } from '~/types/database'
import { IconLoader2 } from 'justd-icons'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Form } from 'ui'
import { checkPasskeySupport, getPasskey } from '~/features/passkey'
import { checkUser, clearChallenge, getOptions, getUser, saveChallenge, verifyPasskey } from './actions'

export default function SignInForm() {
  const [isPending, startTransition] = useTransition()
  const [user, setUser] = useState<Users>()
  const [error, setError] = useState('')
  const { handleSubmit } = useForm()

  const signIn = () => {
    startTransition(async () => {
      setError('')
      setUser(undefined)

      // パスキーがサポートされているか確認
      const checkPasskeySupportResult = await checkPasskeySupport()
      if (!checkPasskeySupportResult.success) {
        console.error('checkPasskeySupportResult:', checkPasskeySupportResult)
        setError(checkPasskeySupportResult.error)
        return
      }

      // オプション取得
      const getOptionsResult = await getOptions()
      if (!getOptionsResult.success) {
        console.error('getOptionsResult:', getOptionsResult)
        setError(getOptionsResult.error)
        return
      }

      // パスキー情報を取得
      const getPasskeyResult = await getPasskey(getOptionsResult.data)
      if (!getPasskeyResult.success) {
        console.error('getPasskeyResult:', getPasskeyResult)
        setError(getPasskeyResult.error)
        return
      }

      // ユーザーが存在するか確認
      const userId = getPasskeyResult.data.response.userHandle!
      const checkUserResult = await checkUser(userId)
      if (!checkUserResult.success) {
        console.error('checkUserResult:', checkUserResult)
        setError(checkUserResult.error)
        return
      }

      // チャレンジを保存
      const saveChallengeResult = await saveChallenge(userId, getOptionsResult.data.challenge)
      if (!saveChallengeResult.success) {
        console.error('saveChallengeResult:', saveChallengeResult)
        setError(saveChallengeResult.error)
        return
      }

      // パスキーを検証
      const verifyPasskeyResult = await verifyPasskey(userId, getPasskeyResult.data)
      if (!verifyPasskeyResult.success) {
        console.error('verifyPasskeyResult:', verifyPasskeyResult)
        setError(verifyPasskeyResult.error)
        return
      }

      // チャレンジを削除
      const clearChallengeResult = await clearChallenge(userId)
      if (!clearChallengeResult.success) {
        console.error('clearChallengeResult:', clearChallengeResult)
        setError(clearChallengeResult.error)
        return
      }

      // ユーザー情報を取得
      const getUserResult = await getUser(userId)
      if (!getUserResult.success) {
        console.error('getUserResult:', getUserResult)
        setError(getUserResult.error)
        return
      }

      // ログイン成功
      setUser(getUserResult.data)
      alert('ログイン成功🎉')
    })
  }

  return (
    <Form onSubmit={handleSubmit(signIn)} className="space-y-4">
      <Button
        type="submit"
        autoFocus
        isDisabled={isPending}
        className="w-full"
      >
        Login
        {isPending && <IconLoader2 className="animate-spin" />}
      </Button>
      {error && <p className="text-red-500">{error}</p>}
      {user && <pre className="text-xs">{JSON.stringify(user, null, 2)}</pre>}
    </Form>
  )
}
