"use client"

import { useCallback, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowRight, Check, Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import { toast, Toaster } from "sonner"
import EchoNoteLogo from "@/components/echonote-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiLogin, apiRegister } from "@/lib/api"
import { MOTION_SSR_SAFE } from "@/lib/motion-policy"
import { cn } from "@/lib/utils"

type AuthMode = "login" | "signup"

interface AuthScreensProps {
  onAuthSuccess: () => void
}

// Validation helpers
const validateEmail = (email: string): string | null => {
  if (!email) return "Email is required"
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format"
  return null
}

const validatePassword = (password: string): string | null => {
  if (!password) return "Password is required"
  if (password.length < 8) return "Password must be at least 8 characters"
  return null
}

const validateName = (name: string): string | null => {
  if (!name) return "Name is required"
  if (name.length < 2) return "Name must be at least 2 characters"
  return null
}

// Social login button component
const SocialButton = ({
  provider,
  icon,
  onClick
}: {
  provider: string
  icon: React.ReactNode
  onClick: () => void
}) => {
  return (
    <Button
      variant="outline"
      className="flex-1 h-12 bg-card/50 border-border/50 hover:bg-card hover:border-primary/30 transition-all duration-300"
      onClick={onClick}
    >
      {icon}
    </Button>
  )
}

// Google Icon
const GoogleIcon = () => {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  )
}

// Apple Icon
const AppleIcon = () => {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  )
}

/** Production: classic Framer entrance (`initial` opacity/y). Dev: `initial={false}` so login is visible without entrance. */
const AuthLogoShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      className="flex justify-center pt-8 pb-12"
      initial={MOTION_SSR_SAFE ? { opacity: 0, y: -20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  )
}

const AuthCardShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <motion.div
      className="flex-1 flex flex-col max-w-sm mx-auto w-full"
      initial={MOTION_SSR_SAFE ? { opacity: 0, y: 20 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

// Animated background
const AuthBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient orbs */}
      <motion.div
        className="absolute -top-1/3 -left-1/3 h-[600px] w-[600px] rounded-full bg-primary/8 blur-3xl"
        animate={{
          x: [0, 30, 0],
          y: [0, 20, 0]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute -bottom-1/3 -right-1/3 h-[500px] w-[500px] rounded-full bg-accent/8 blur-3xl"
        animate={{
          x: [0, -25, 0],
          y: [0, -15, 0]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Echo wave decoration — subtle breathe so motion is visible on static screenshots vs idle */}
      <motion.div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary"
        initial={{ opacity: 0.04 }}
        animate={{
          opacity: [0.04, 0.1, 0.04],
          scale: [1, 1.02, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <svg width="400" height="400" viewBox="0 0 400 400" fill="none">
          <circle
            cx="200"
            cy="200"
            r="180"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle
            cx="200"
            cy="200"
            r="140"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle
            cx="200"
            cy="200"
            r="100"
            stroke="currentColor"
            strokeWidth="1"
          />
          <circle
            cx="200"
            cy="200"
            r="60"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>
      </motion.div>
    </div>
  )
}

// Input field component with icon
const AuthInput = ({
  icon: Icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  showPasswordToggle = false,
  showPassword,
  onTogglePassword
}: {
  icon: React.ElementType
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  error?: string | null
  showPasswordToggle?: boolean
  showPassword?: boolean
  onTogglePassword?: () => void
}) => {
  return (
    <div className="space-y-2">
      <Label className="text-muted-foreground text-sm">{label}</Label>
      <div className="relative">
        <Icon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type={showPasswordToggle && showPassword ? "text" : type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "h-12 pl-10 pr-10 bg-card/50 border-border/50 focus:border-primary/50 focus:bg-card transition-all duration-300",
            error && "border-destructive focus:border-destructive"
          )}
        />
        {showPasswordToggle && (
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-xs text-destructive"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}

const AuthScreens = ({ onAuthSuccess }: AuthScreensProps) => {
  const [mode, setMode] = useState<AuthMode>("login")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // Error state
  const [errors, setErrors] = useState<{
    name?: string | null
    email?: string | null
    password?: string | null
  }>({})

  const [touched, setTouched] = useState<{
    name?: boolean
    email?: boolean
    password?: boolean
  }>({})

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      // Validate all fields
      const newErrors: typeof errors = {}

      if (mode === "signup") {
        newErrors.name = validateName(name)
      }
      newErrors.email = validateEmail(email)
      newErrors.password = validatePassword(password)

      setErrors(newErrors)
      setTouched({ name: true, email: true, password: true })

      // Check if any errors
      if (Object.values(newErrors).some((error) => error !== null)) {
        return
      }

      setIsLoading(true)

      try {
        if (mode === "signup") {
          const { tokens } = await apiRegister(email, name, password)
          localStorage.setItem("accessToken", tokens.accessToken)
          localStorage.setItem("refreshToken", tokens.refreshToken)
        } else {
          const { tokens } = await apiLogin(email, password)
          localStorage.setItem("accessToken", tokens.accessToken)
          localStorage.setItem("refreshToken", tokens.refreshToken)
        }
        onAuthSuccess()
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Authentication failed")
      } finally {
        setIsLoading(false)
      }
    },
    [mode, name, email, password, onAuthSuccess]
  )

  const handleSocialLogin = useCallback((_provider: string) => {
    toast.error("Social login is not supported yet")
  }, [])

  const toggleMode = useCallback(() => {
    setMode(mode === "login" ? "signup" : "login")
    setErrors({})
    setTouched({})
    setName("")
    setEmail("")
    setPassword("")
  }, [mode])

  return (
    <div
      className="relative min-h-screen bg-background flex flex-col"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <Toaster position="top-center" theme="dark" />
      <AuthBackground />

      <div className="relative z-10 flex-1 flex flex-col px-6 py-8">
        {/* Logo */}
        <AuthLogoShell>
          <EchoNoteLogo size="lg" animated />
        </AuthLogoShell>

        {/* Auth Card */}
        <AuthCardShell>
          {/* Header */}
          <div className="text-center mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode}
                initial={MOTION_SSR_SAFE ? { opacity: 0, y: 10 } : false}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <h1 className="text-2xl font-black tracking-tight text-foreground mb-2">
                  {mode === "login" ? "Welcome back" : "Create account"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {mode === "login"
                    ? "Sign in to continue capturing conversations"
                    : "Start your free trial today"}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Social Login */}
          <div className="flex gap-3 mb-6">
            <SocialButton
              provider="google"
              icon={<GoogleIcon />}
              onClick={() => handleSocialLogin("google")}
            />
            <SocialButton
              provider="apple"
              icon={<AppleIcon />}
              onClick={() => handleSocialLogin("apple")}
            />
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              or continue with email
            </span>
            <div className="flex-1 h-px bg-border/50" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "signup" && (
                <motion.div
                  key="name-field"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <AuthInput
                    icon={User}
                    label="Full Name"
                    value={name}
                    onChange={(value) => {
                      setName(value)
                      if (touched.name) {
                        setErrors((prev) => ({
                          ...prev,
                          name: validateName(value)
                        }))
                      }
                    }}
                    placeholder="John Doe"
                    error={touched.name ? errors.name : null}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <AuthInput
              icon={Mail}
              label="Email"
              type="email"
              value={email}
              onChange={(value) => {
                setEmail(value)
                if (touched.email) {
                  setErrors((prev) => ({
                    ...prev,
                    email: validateEmail(value)
                  }))
                }
              }}
              placeholder="you@example.com"
              error={touched.email ? errors.email : null}
            />

            <AuthInput
              icon={Lock}
              label="Password"
              type="password"
              value={password}
              onChange={(value) => {
                setPassword(value)
                if (touched.password) {
                  setErrors((prev) => ({
                    ...prev,
                    password: validatePassword(value)
                  }))
                }
              }}
              placeholder="Enter your password"
              error={touched.password ? errors.password : null}
              showPasswordToggle
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
            />

            {mode === "login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  className="text-xs text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-6 group"
              disabled={isLoading}
            >
              {isLoading ? (
                <motion.div
                  className="h-5 w-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                <>
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </form>

          {/* Password requirements for signup */}
          <AnimatePresence>
            {mode === "signup" && password.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 space-y-2"
              >
                <PasswordRequirement
                  met={password.length >= 8}
                  text="At least 8 characters"
                />
                <PasswordRequirement
                  met={/[A-Z]/.test(password)}
                  text="One uppercase letter"
                />
                <PasswordRequirement
                  met={/[0-9]/.test(password)}
                  text="One number"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle Mode */}
          <div className="mt-8 text-center">
            <span className="text-sm text-muted-foreground">
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-primary font-semibold hover:text-primary/80 transition-colors"
            >
              {mode === "login" ? "Sign Up" : "Sign In"}
            </button>
          </div>

          {/* Terms */}
          {mode === "signup" && (
            <motion.p
              className="mt-6 text-xs text-muted-foreground text-center leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              By creating an account, you agree to our{" "}
              <button className="text-primary hover:underline">
                Terms of Service
              </button>{" "}
              and{" "}
              <button className="text-primary hover:underline">
                Privacy Policy
              </button>
            </motion.p>
          )}
        </AuthCardShell>
      </div>
    </div>
  )
}

// Password requirement indicator
const PasswordRequirement = ({ met, text }: { met: boolean; text: string }) => {
  return (
    <motion.div
      className="flex items-center gap-2 text-xs"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
    >
      <div
        className={cn(
          "h-4 w-4 rounded-full flex items-center justify-center transition-colors duration-300",
          met ? "bg-green-500/20" : "bg-muted"
        )}
      >
        {met && <Check className="h-2.5 w-2.5 text-green-500" />}
      </div>
      <span
        className={cn(
          "transition-colors duration-300",
          met ? "text-green-500" : "text-muted-foreground"
        )}
      >
        {text}
      </span>
    </motion.div>
  )
}

export default AuthScreens
