"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { Recycle, Trophy, BookOpen, User, LogOut, UserPlus, LogIn, Leaf, Target, Calendar } from "lucide-react"

export default function HomePage() {
  const { user, login, logout, register, isLoading } = useAuth()
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" })
  const [loginOpen, setLoginOpen] = useState(false)
  const [registerOpen, setRegisterOpen] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(loginForm.email, loginForm.password)
    setLoginOpen(false)
    setLoginForm({ email: "", password: "" })
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    await register(registerForm.name, registerForm.email, registerForm.password)
    setRegisterOpen(false)
    setRegisterForm({ name: "", email: "", password: "" })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Recycle className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-gray-800">EcoLife</h1>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <div className="flex items-center gap-2 mr-4">
                  <User className="h-4 w-4" />
                  <span className="text-sm text-gray-600">{user.name}님</span>
                </div>
                <Button variant="outline" onClick={logout}>
                  <LogOut className="h-4 w-4 mr-2" />
                  로그아웃
                </Button>
              </>
            ) : (
              <>
                <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <LogIn className="h-4 w-4 mr-2" />
                      로그인
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>로그인</DialogTitle>
                      <DialogDescription>계정에 로그인하여 챌린지에 참여하세요.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div>
                        <Label htmlFor="email">이메일</Label>
                        <Input
                          id="email"
                          type="email"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="password">비밀번호</Label>
                        <Input
                          id="password"
                          type="password"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "로그인 중..." : "로그인"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>

                <Dialog open={registerOpen} onOpenChange={setRegisterOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      회원가입
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>회원가입</DialogTitle>
                      <DialogDescription>새 계정을 만들어 환경 보호에 동참하세요.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div>
                        <Label htmlFor="name">이름</Label>
                        <Input
                          id="name"
                          value={registerForm.name}
                          onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="reg-email">이메일</Label>
                        <Input
                          id="reg-email"
                          type="email"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="reg-password">비밀번호</Label>
                        <Input
                          id="reg-password"
                          type="password"
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? "가입 중..." : "회원가입"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Leaf className="h-12 w-12 text-green-600" />
            <h2 className="text-5xl font-bold text-gray-800">환경을 생각하는</h2>
          </div>
          <h3 className="text-4xl font-bold text-green-600 mb-4">분리배출 가이드</h3>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            올바른 분리배출로 지구를 보호하고, 매일 새로운 챌린지로 환경 보호 습관을 만들어보세요.
          </p>
        </div>

        {/* Main Navigation Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          <Link href="/guide">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-blue-100 rounded-full w-fit group-hover:bg-blue-200 transition-colors">
                  <BookOpen className="h-12 w-12 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">분리배출 가이드</CardTitle>
                <CardDescription className="text-lg">
                  플라스틱, 종이, 유리 등 각 재활용품의 올바른 분리배출 방법을 확인하세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <Button className="w-full" size="lg">
                    가이드 보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/challenge">
            <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-4 bg-green-100 rounded-full w-fit group-hover:bg-green-200 transition-colors">
                  <Trophy className="h-12 w-12 text-green-600" />
                </div>
                <CardTitle className="text-2xl">일일 챌린지</CardTitle>
                <CardDescription className="text-lg">
                  매일 새로운 환경 보호 챌린지에 도전하고 습관을 만들어보세요.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <Button className="w-full bg-transparent" size="lg" variant="outline">
                    {user ? "챌린지 참여하기" : "로그인 후 참여"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <Target className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <CardTitle>맞춤형 가이드</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">각 재활용품별 상세한 분리배출 방법과 주의사항을 제공합니다.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Calendar className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle>일일 챌린지</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">매일 새로운 환경 보호 미션으로 지속적인 실천을 도와드립니다.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Leaf className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <CardTitle>환경 보호</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 text-center">
                작은 실천이 모여 큰 변화를 만듭니다. 지구를 위한 첫걸음을 시작하세요.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Recycle className="h-6 w-6" />
            <span className="text-lg font-semibold">EcoLife</span>
          </div>
          <p className="text-gray-400">올바른 분리배출로 깨끗한 환경을 만들어가요 🌱</p>
        </div>
      </footer>
    </div>
  )
}
