"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface User {
  id: number
  name: string
  email: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (name: string, email: string, password: string, checkPassword: string) => Promise<void>
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8080/user/userLogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error("로그인에 실패했습니다.")
      }

      const userData = await response.json()
      setUser({
        id: userData.id,
        name: userData.name,
        email: userData.email,
      })
    } catch (error) {
      console.error("Login error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
  }

  const register = async (name: string, email: string, password: string, checkPassword: string) => {
    if (password !== checkPassword) {
      throw new Error("비밀번호가 일치하지 않습니다.")
    }

    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8080/user/signUp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          checkPassword,
        }),
      })

      if (!response.ok) {
        throw new Error("회원가입에 실패했습니다.")
      }

      // 회원가입 성공 후 자동 로그인
      await login(email, password)
    } catch (error) {
      console.error("Register error:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
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
