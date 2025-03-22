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

      // ユーザーが既に存在するか確認(or メールアドレス確認)

      // オプション取得

      // チャレンジを保存

      // パスキーを作成

      // パスキーを検証

      // ユーザーを保存

      // クレデンシャルを保存

      // チャレンジをクリア

      // ユーザー情報取得

      // 登録完了
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
