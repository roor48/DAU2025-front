"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { Recycle, Leaf, Trophy, BookOpen, Users, Mail, Lock, User, LogIn, UserPlus, LogOut } from "lucide-react"

const recyclingItems = [
  {
    category: "플라스틱",
    items: ["페트병", "플라스틱 용기", "비닐봉지"],
    color: "bg-blue-100 text-blue-800",
    tips: "깨끗이 씻어서 분리배출",
  },
  {
    category: "종이",
    items: ["신문지", "박스", "책"],
    color: "bg-green-100 text-green-800",
    tips: "테이프, 스테이플러 제거 후 배출",
  },
  {
    category: "유리",
    items: ["병", "잔"],
    color: "bg-purple-100 text-purple-800",
    tips: "뚜껑 분리 후 배출",
  },
  {
    category: "금속",
    items: ["캔", "알루미늄 호일"],
    color: "bg-yellow-100 text-yellow-800",
    tips: "내용물 완전히 비운 후 배출",
  },
]

export default function HomePage() {
  const { user, login, logout, register, isLoading } = useAuth()
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "", checkPassword: "" })
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await login(loginForm.email, loginForm.password)
      setIsLoginOpen(false)
      setLoginForm({ email: "", password: "" })
    } catch (error) {
      setError(error instanceof Error ? error.message : "로그인에 실패했습니다.")
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    try {
      await register(registerForm.name, registerForm.email, registerForm.password, registerForm.checkPassword)
      setIsRegisterOpen(false)
      setRegisterForm({ name: "", email: "", password: "", checkPassword: "" })
    } catch (error) {
      setError(error instanceof Error ? error.message : "회원가입에 실패했습니다.")
    }
  }

  return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Recycle className="h-8 w-8 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-800">재활용 가이드</h1>
            </div>

            <div className="flex items-center gap-4">
              {user ? (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">안녕하세요, {user.name}님!</span>
                    <Button variant="outline" size="sm" onClick={logout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      로그아웃
                    </Button>
                  </div>
              ) : (
                  <div className="flex items-center gap-2">
                    <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <LogIn className="h-4 w-4 mr-2" />
                          로그인
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>로그인</DialogTitle>
                          <DialogDescription>계정에 로그인하여 더 많은 기능을 이용해보세요.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleLogin} className="space-y-4">
                          <div>
                            <Label htmlFor="email">이메일</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                  id="email"
                                  type="email"
                                  placeholder="이메일을 입력하세요"
                                  className="pl-10"
                                  value={loginForm.email}
                                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                  required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="password">비밀번호</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                  id="password"
                                  type="password"
                                  placeholder="비밀번호를 입력하세요"
                                  className="pl-10"
                                  value={loginForm.password}
                                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                  required
                              />
                            </div>
                          </div>
                          {error && <p className="text-sm text-red-600">{error}</p>}
                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "로그인 중..." : "로그인"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>

                    <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <UserPlus className="h-4 w-4 mr-2" />
                          회원가입
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>회원가입</DialogTitle>
                          <DialogDescription>새 계정을 만들어 재활용 챌린지에 참여해보세요.</DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleRegister} className="space-y-4">
                          <div>
                            <Label htmlFor="name">이름</Label>
                            <div className="relative">
                              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                  id="name"
                                  type="text"
                                  placeholder="이름을 입력하세요"
                                  className="pl-10"
                                  value={registerForm.name}
                                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                                  required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="register-email">이메일</Label>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                  id="register-email"
                                  type="email"
                                  placeholder="이메일을 입력하세요"
                                  className="pl-10"
                                  value={registerForm.email}
                                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                                  required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="register-password">비밀번호</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                  id="register-password"
                                  type="password"
                                  placeholder="비밀번호를 입력하세요"
                                  className="pl-10"
                                  value={registerForm.password}
                                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                                  required
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="check-password">비밀번호 확인</Label>
                            <div className="relative">
                              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                              <Input
                                  id="check-password"
                                  type="password"
                                  placeholder="비밀번호를 다시 입력하세요"
                                  className="pl-10"
                                  value={registerForm.checkPassword}
                                  onChange={(e) => setRegisterForm({ ...registerForm, checkPassword: e.target.value })}
                                  required
                              />
                            </div>
                          </div>
                          {error && <p className="text-sm text-red-600">{error}</p>}
                          <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "가입 중..." : "회원가입"}
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
              )}
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">지구를 위한 작은 실천</h2>
            <p className="text-xl text-gray-600 mb-8">올바른 분리배출로 환경을 보호해요</p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/guide">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <BookOpen className="h-5 w-5 mr-2" />
                  분리배출 가이드
                </Button>
              </Link>
              <Link href="/challenge">
                <Button size="lg" variant="outline">
                  <Trophy className="h-5 w-5 mr-2" />
                  일일 챌린지
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Guide */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {recyclingItems.map((item, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {item.category}
                      <Badge className={item.color}>{item.items.length}개</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {item.items.map((subItem, subIndex) => (
                          <li key={subIndex} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                            {subItem}
                          </li>
                      ))}
                    </ul>
                    <Separator className="my-3" />
                    <p className="text-sm text-gray-600">{item.tips}</p>
                  </CardContent>
                </Card>
            ))}
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <Leaf className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <CardTitle>환경 보호</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>올바른 분리배출로 자원을 재활용하고 환경 오염을 줄여보세요.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <CardTitle>일일 챌린지</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>매일 새로운 환경 보호 챌린지에 참여하고 포인트를 획득하세요.</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <CardTitle>커뮤니티</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>다른 사용자들과 환경 보호 경험을 공유하고 함께 실천해요.</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  )
}
