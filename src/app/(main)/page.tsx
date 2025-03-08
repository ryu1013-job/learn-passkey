import PageLayout from '~/components/layout/page-layout'
import { Card, Link } from '~/components/ui'

export default function Home() {
  return (
    <PageLayout>
      <Card className="max-w-md mx-auto">
        <Card.Header>
          <Card.Title>Home</Card.Title>
        </Card.Header>
        <Card.Content>
          Hello World
        </Card.Content>
        <Card.Footer>
          <Link intent="primary" href="/auth/sign-in">Login</Link>
          <span className="mx-1">/</span>
          <Link intent="primary" href="/auth/sign-up">Sign Up</Link>
        </Card.Footer>
      </Card>
    </PageLayout>
  )
}
