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

// similar to LoginForm.tsx, we're using supabase's auth functions directly,
// and not the abstrcated helper methods. 
export function SignupForm({ 
  className, 
  setShowSignup,
  ...props 
}: React.ComponentPropsWithoutRef<'div'> & { 
  setShowSignup: (show: boolean) => void 
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { signUp } = useAuth()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== repeatPassword) {
      setError('Passwords do not match')
      return
    }
    setIsLoading(true)

    try {
      const { error } = await signUp(email, password)
      if (error) throw error
      setSuccess(true)
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn('flex flex-col gap-6 bg-zinc-900 text-zinc-100', className)} {...props}>
      {success ? (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl">Almost done!</CardTitle>
            <CardDescription className="text-zinc-400">Check your email to verify your account before logging in. It may take a minute!</CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="link"
              className="text-zinc-400 hover:text-zinc-200 p-0 h-auto"
              onClick={() => setShowSignup(false)}
            >
              Back to sign in
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription className="text-zinc-400">
              <Button
                variant="link"
                className="text-zinc-400 hover:text-zinc-200 p-0 h-auto"
                onClick={() => setShowSignup(false)}
              >
                Already have an account? Sign in
              </Button>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp}>
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
                <div className="grid gap-2">
                  <div className="flex items-center">
                    <Label htmlFor="repeat-password" className="text-zinc-300">Repeat Password</Label>
                  </div>
                  <Input
                    id="repeat-password"
                    type="password"
                    required
                    value={repeatPassword}
                    onChange={(e) => setRepeatPassword(e.target.value)}
                    className="bg-zinc-800 text-zinc-100 border-zinc-700 focus:border-zinc-600"
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Creating an account...' : 'Sign up'}
                </Button>
              </div>
              

            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
