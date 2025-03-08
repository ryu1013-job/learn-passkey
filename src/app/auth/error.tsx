'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import PageLayout from '~/components/layout/page-layout'
import { Button } from '~/components/ui'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <PageLayout className="text-center space-y-4">
      <h2 className="text-danger">Something went wrong!</h2>
      <Button
        onPress={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </PageLayout>
  )
}
