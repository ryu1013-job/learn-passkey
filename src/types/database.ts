import type { challenges, credentials, users } from '~/lib/database/schema'

export type Users = typeof users['$inferSelect']
export type Credentials = typeof credentials['$inferSelect']
export type Challenges = typeof challenges['$inferSelect']
