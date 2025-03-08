import PageLayout from '~/components/layout/page-layout'
import { Card, Link } from '~/components/ui'
import SignUpForm from './sign-up-form'

export default function SignIn() {
  return (
    <PageLayout>
      <Card className="max-w-md mx-auto">
        <Card.Header>
          <Card.Title>Sign Up</Card.Title>
        </Card.Header>
        <Card.Content>
          <SignUpForm />
        </Card.Content>
        <Card.Footer>
          <Link intent="primary" href="/auth/sign-in">Login</Link>
        </Card.Footer>
      </Card>
    </PageLayout>
  )
}
