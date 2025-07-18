"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: string
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    // 실제 로그인 로직 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUser({
      id: "1",
      name: "사용자",
      email: email,
    })
    setIsLoading(false)
  }

  const logout = () => {
    setUser(null)
  }

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true)
    // 실제 회원가입 로직 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setUser({
      id: "1",
      name: name,
      email: email,
    })
    setIsLoading(false)
  }

  return <AuthContext.Provider value={{ user, login, logout, register, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
