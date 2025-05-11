import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { useAuth } from '@/contexts/auth'
import { ForgotPasswordForm } from '@/components/Auth/ForgotPasswordForm'

export function LoginForm({ 
  className, 
  setShowSignup,
  ...props 
}: React.ComponentPropsWithoutRef<'div'> & { 
  setShowSignup: (show: boolean) => void 
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { signIn } = useAuth()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signIn(email, password)
      if (error) {
        throw error
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (showForgotPassword) {
    return (
      <div className={cn('flex flex-col gap-6 bg-zinc-900 text-zinc-100', className)} {...props}>
        <ForgotPasswordForm />
        <div className="text-center">
          <Button
            variant="link"
            className="text-zinc-400 hover:text-zinc-200"
            onClick={() => setShowForgotPassword(false)}
          >
            Back to login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col gap-6 bg-zinc-900 text-zinc-100', className)} {...props}>
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription className="text-zinc-400">
            <Button
              variant="link"
              className="text-zinc-400 hover:text-zinc-200 p-0 h-auto"
              onClick={() => setShowSignup(true)}
            >
              Don't have an account? Sign up
            </Button>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email" className="text-zinc-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-600"
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password" className="text-zinc-300">Password</Label>
                  <Button
                    variant="link"
                    className="ml-auto text-sm text-zinc-400 hover:text-zinc-200 p-0 h-auto"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    Forgot your password?
                  </Button>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-600"
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
            
            
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
