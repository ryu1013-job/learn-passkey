import PageLayout from '~/components/layout/page-layout'
import { Card, Link } from '~/components/ui'
import SignInForm from './sign-in-form'

export default function SignIn() {
  return (
    <PageLayout>
      <Card className="max-w-md mx-auto">
        <Card.Header>
          <Card.Title>Login</Card.Title>
        </Card.Header>
        <Card.Content>
          <SignInForm />
        </Card.Content>
        <Card.Footer>
          <Link intent="primary" href="/auth/sign-up">Sign Up</Link>
        </Card.Footer>
      </Card>
    </PageLayout>
  )
}
