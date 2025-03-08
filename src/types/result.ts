interface OK<T> {
  success: true
  data: T
}

interface Err<U> {
  success: false
  error: U
}

export type Result<T, U> = OK<T> | Err<U>
