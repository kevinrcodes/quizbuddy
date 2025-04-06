import { AuthProvider } from "./contexts/auth"
import { useAuth } from "./contexts/auth"
import { LoginForm } from "./components/Auth/LoginForm"
import { SignupForm } from "./components/Auth/SignupForm"
import { useState, useEffect } from "react"
import { Button } from "./components/ui/button"
import SubscribedApp from "./_pages/SubscribedApp"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ToastProvider } from "./components/ui/toast"
import { ToastContext } from "./contexts/toast"
import { UpdateNotification } from "./components/UpdateNotification"

// Create a React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: Infinity,
      retry: 1,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 1
    }
  }
})

function AuthScreen({ showSignup, setShowSignup }: { showSignup: boolean, setShowSignup: (show: boolean) => void }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white/5 rounded-lg">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">
            {showSignup ? "Create an Account" : "Sign In"}
          </h2>
        </div>
        {showSignup ? <SignupForm /> : <LoginForm />}
        <div className="text-center">
          <Button
            variant="link"
            className="text-white/60 hover:text-white"
            onClick={() => setShowSignup(!showSignup)}
          >
            {showSignup
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </Button>
        </div>
      </div>
    </div>
  )
}

function AppContent() {
  const { session, loading, signOut } = useAuth()
  const [showSignup, setShowSignup] = useState(false)
  const [currentLanguage, setCurrentLanguage] = useState("python")

  console.log('Session state:', session); // Log the session state
  // TODO when running with ./stealth_run.sh, it goes directly to the app
  // when there is no session! let's make sure we check for a session before
  // rendering the app

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-white/20 border-t-white/80 rounded-full animate-spin"></div>
          <p className="text-white/60 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {!session ? (
        <AuthScreen showSignup={showSignup} setShowSignup={setShowSignup} />
      ) : (
        <div className="w-fit">
          <SubscribedApp 
            credits={999} // For now, assume all users have unlimited credits
            currentLanguage={currentLanguage}
            setLanguage={setCurrentLanguage}
          />
          <UpdateNotification />
        </div>
      )}
    </div>
  )
}

export default function App() {
  const [toastState, setToastState] = useState({
    open: false,
    title: "",
    description: "",
    variant: "neutral" as "neutral" | "success" | "error"
  })

  const showToast = (title: string, description: string, variant: "neutral" | "success" | "error") => {
    setToastState({
      open: true,
      title,
      description,
      variant
    })
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <ToastContext.Provider value={{ showToast }}>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ToastContext.Provider>
      </ToastProvider>
    </QueryClientProvider>
  )
}