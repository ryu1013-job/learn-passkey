'use client'

import type { Users } from '~/types/database'
import { IconLoader2 } from 'justd-icons'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { Button, Form } from 'ui'

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

      // オプション取得

      // パスキー情報を取得

      // ユーザーが存在するか確認

      // チャレンジを保存

      // パスキーを検証

      // チャレンジを削除

      // ユーザー情報を取得

      // ログイン成功
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
