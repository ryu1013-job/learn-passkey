import { z } from 'zod'

export const signUpSchema = z.object({
  email: z.string().trim().min(1).email().max(254),
  userName: z.string().trim().min(1).max(60),
})

export type SignUp = z.infer<typeof signUpSchema>
