"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import {
  Recycle,
  Leaf,
  Users,
  Award,
  BookOpen,
  Calendar,
  ChevronRight,
  Package,
  BoxIcon as Bottle,
  FileText,
  Battery,
  Lightbulb,
  User,
  LogOut,
  LogIn,
  UserPlus,
} from "lucide-react"

const recyclingItems = [
  {
    category: "플라스틱",
    icon: <Bottle className="h-6 w-6" />,
    items: ["페트병", "플라스틱 용기", "비닐봉지", "스티로폼"],
    color: "bg-blue-50 border-blue-200",
    iconColor: "text-blue-600",
  },
  {
    category: "종이",
    icon: <FileText className="h-6 w-6" />,
    items: ["신문지", "잡지", "골판지", "종이팩"],
    color: "bg-green-50 border-green-200",
    iconColor: "text-green-600",
  },
  {
    category: "유리",
    icon: <Package className="h-6 w-6" />,
    items: ["유리병", "유리컵", "거울", "유리창"],
    color: "bg-purple-50 border-purple-200",
    iconColor: "text-purple-600",
  },
  {
    category: "금속",
    icon: <Battery className="h-6 w-6" />,
    items: ["캔", "철제품", "알루미늄", "구리선"],
    color: "bg-orange-50 border-orange-200",
    iconColor: "text-orange-600",
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
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Recycle className="h-8 w-8 text-green-600" />
                <h1 className="text-2xl font-bold text-gray-800">재활용 가이드</h1>
              </div>

              <div className="flex items-center gap-4">
                {user ? (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">{user.name}님</span>
                      </div>
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
                              <Label htmlFor="login-email">이메일</Label>
                              <Input
                                  id="login-email"
                                  type="email"
                                  value={loginForm.email}
                                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                                  required
                              />
                            </div>
                            <div>
                              <Label htmlFor="login-password">비밀번호</Label>
                              <Input
                                  id="login-password"
                                  type="password"
                                  value={loginForm.password}
                                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                  required
                              />
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
                              <Label htmlFor="register-name">이름</Label>
                              <Input
                                  id="register-name"
                                  type="text"
                                  value={registerForm.name}
                                  onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                                  required
                              />
                            </div>
                            <div>
                              <Label htmlFor="register-email">이메일</Label>
                              <Input
                                  id="register-email"
                                  type="email"
                                  value={registerForm.email}
                                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                                  required
                              />
                            </div>
                            <div>
                              <Label htmlFor="register-password">비밀번호</Label>
                              <Input
                                  id="register-password"
                                  type="password"
                                  value={registerForm.password}
                                  onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                                  required
                              />
                            </div>
                            <div>
                              <Label htmlFor="register-check-password">비밀번호 확인</Label>
                              <Input
                                  id="register-check-password"
                                  type="password"
                                  value={registerForm.checkPassword}
                                  onChange={(e) => setRegisterForm({ ...registerForm, checkPassword: e.target.value })}
                                  required
                              />
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
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">올바른 분리배출로 지구를 지켜요</h2>
            <p className="text-xl text-gray-600 mb-8">재활용품을 올바르게 분류하고 배출하는 방법을 알아보세요</p>

            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link href="/guide">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  <BookOpen className="h-5 w-5 mr-2" />
                  재활용 가이드 보기
                </Button>
              </Link>
              <Link href="/challenge">
                <Button size="lg" variant="outline">
                  <Award className="h-5 w-5 mr-2" />
                  챌린지 참여하기
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <Recycle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800">85%</h3>
                <p className="text-gray-600">재활용 가능률</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Leaf className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800">12톤</h3>
                <p className="text-gray-600">CO2 절약량</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800">1,234</h3>
                <p className="text-gray-600">참여 사용자</p>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-6">
                <Award className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800">567</h3>
                <p className="text-gray-600">완료된 챌린지</p>
              </CardContent>
            </Card>
          </div>

          {/* Recycling Categories */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">재활용품 분류</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recyclingItems.map((item, index) => (
                  <Card key={index} className={`${item.color} hover:shadow-lg transition-shadow cursor-pointer`}>
                    <CardHeader className="text-center">
                      <div className={`${item.iconColor} mx-auto mb-2`}>{item.icon}</div>
                      <CardTitle className="text-xl">{item.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {item.items.map((subItem, subIndex) => (
                            <Badge key={subIndex} variant="secondary" className="mr-2 mb-2">
                              {subItem}
                            </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <BookOpen className="h-12 w-12 text-blue-600 mb-4" />
                <CardTitle>상세한 가이드</CardTitle>
                <CardDescription>각 재활용품별 올바른 분리배출 방법을 자세히 알아보세요</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/guide">
                  <Button variant="outline" className="w-full bg-transparent">
                    가이드 보기 <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Calendar className="h-12 w-12 text-green-600 mb-4" />
                <CardTitle>일일 챌린지</CardTitle>
                <CardDescription>매일 새로운 재활용 챌린지에 참여하고 포인트를 획득하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/challenge">
                  <Button variant="outline" className="w-full bg-transparent">
                    챌린지 참여 <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <Lightbulb className="h-12 w-12 text-yellow-600 mb-4" />
                <CardTitle>팁 & 노하우</CardTitle>
                <CardDescription>재활용을 더 효과적으로 할 수 있는 유용한 팁들을 확인하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full bg-transparent">
                  팁 보기 <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Call to Action */}
          <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
            <CardContent className="p-8 text-center">
              <h3 className="text-3xl font-bold mb-4">지금 시작해보세요!</h3>
              <p className="text-xl mb-6">작은 실천이 큰 변화를 만듭니다</p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/guide">
                  <Button size="lg" variant="secondary">
                    가이드 시작하기
                  </Button>
                </Link>
                <Link href="/challenge">
                  <Button
                      size="lg"
                      variant="outline"
                      className="text-white border-white hover:bg-white hover:text-green-600 bg-transparent"
                  >
                    챌린지 도전하기
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
  )
}
