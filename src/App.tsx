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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-red-600">
      <div className="w-full max-w-md p-8 space-y-8 bg-zinc-900 rounded-lg border border-zinc-800">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-100">
            {"Welcome to Codebuddy"}
          </h2>
        </div>
        {showSignup ? <SignupForm /> : <LoginForm />}
        <div className="text-center">
          <Button
            variant="link"
            className="text-zinc-400 hover:text-zinc-200"
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

  console.log('Session state:', session);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-zinc-950">
        <div className="flex flex-col items-center gap-3 bg-purple-500 border-2 border-purple-700 p-3">
          <div className="w-6 h-6 border-2 border-zinc-700 border-t-zinc-300 rounded-full animate-spin"></div>
          <p className="text-zinc-400 text-sm">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative bg-orange-500 border-2 border-orange-700 p-2">
      {!session ? (
        <AuthScreen showSignup={showSignup} setShowSignup={setShowSignup} />
      ) : (
        <div className="w-fit bg-pink-500 border-2 border-pink-700 p-2">
          <SubscribedApp 
            credits={999} // For now, assume all users have unlimited credits
            currentLanguage={currentLanguage}
            setLanguage={setCurrentLanguage}
          />
          <div className="bg-teal-500 border-2 border-teal-700">
            <UpdateNotification />
          </div>
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
            <div className="bg-indigo-500 border-2 border-indigo-700 p-2">
              <AppContent />
            </div>
          </AuthProvider>
        </ToastContext.Provider>
      </ToastProvider>
    </QueryClientProvider>
  )
}