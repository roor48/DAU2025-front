"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { useAuth } from "@/contexts/auth-context"
import { Trophy, CalendarIcon, CheckCircle, Clock, ArrowLeft, Target, Flame, Award } from "lucide-react"

interface Challenge {
  id: string
  title: string
  description: string
  points: number
  difficulty: "easy" | "medium" | "hard"
  category: string
}

interface ChallengeCompletion {
  date: string
  challengeId: string
  completed: boolean
}

const challenges: Challenge[] = [
  {
    id: "1",
    title: "플라스틱 용기 5개 분리배출하기",
    description: "오늘 사용한 플라스틱 용기를 깨끗이 씻어서 분리배출해보세요.",
    points: 10,
    difficulty: "easy",
    category: "분리배출",
  },
  {
    id: "2",
    title: "일회용품 사용 줄이기",
    description: "오늘 하루 일회용 컵이나 빨대 사용을 피해보세요.",
    points: 15,
    difficulty: "medium",
    category: "생활습관",
  },
  {
    id: "3",
    title: "재활용품 분류 퀴즈 풀기",
    description: "재활용품 분류에 대한 퀴즈 5문제를 모두 맞춰보세요.",
    points: 20,
    difficulty: "hard",
    category: "학습",
  },
  {
    id: "4",
    title: "종이 재활용하기",
    description: "집에 있는 신문지나 박스를 정리해서 분리배출해보세요.",
    points: 10,
    difficulty: "easy",
    category: "분리배출",
  },
  {
    id: "5",
    title: "친환경 제품 사용하기",
    description: "오늘 하루 친환경 세제나 제품을 사용해보세요.",
    points: 15,
    difficulty: "medium",
    category: "생활습관",
  },
]

export default function ChallengePage() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [completions, setCompletions] = useState<ChallengeCompletion[]>([])
  const [todayChallenge, setTodayChallenge] = useState<Challenge>()

  useEffect(() => {
    // 오늘의 챌린지 설정 (날짜 기반으로 순환)
    const today = new Date()
    const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
    const challengeIndex = dayOfYear % challenges.length
    setTodayChallenge(challenges[challengeIndex])

    // 로컬 스토리지에서 완료 기록 불러오기
    const savedCompletions = localStorage.getItem("challenge-completions")
    if (savedCompletions) {
      setCompletions(JSON.parse(savedCompletions))
    }
  }, [])

  const getTodayDateString = () => {
    return new Date().toISOString().split("T")[0]
  }

  const getDateString = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const isChallengeCompleted = (date: string, challengeId?: string) => {
    if (!challengeId) return false
    return completions.some((c) => c.date === date && c.challengeId === challengeId && c.completed)
  }

  const completeChallenge = (challengeId: string) => {
    const today = getTodayDateString()
    const newCompletion: ChallengeCompletion = {
      date: today,
      challengeId,
      completed: true,
    }

    const updatedCompletions = [
      ...completions.filter((c) => !(c.date === today && c.challengeId === challengeId)),
      newCompletion,
    ]
    setCompletions(updatedCompletions)
    localStorage.setItem("challenge-completions", JSON.stringify(updatedCompletions))
  }

  const getTotalPoints = () => {
    return completions.reduce((total, completion) => {
      if (completion.completed) {
        const challenge = challenges.find((c) => c.id === completion.challengeId)
        return total + (challenge?.points || 0)
      }
      return total
    }, 0)
  }

  const getCompletedDaysCount = () => {
    const uniqueDates = new Set(completions.filter((c) => c.completed).map((c) => c.date))
    return uniqueDates.size
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "쉬움"
      case "medium":
        return "보통"
      case "hard":
        return "어려움"
      default:
        return "알 수 없음"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader className="text-center">
            <Trophy className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <CardTitle>로그인이 필요합니다</CardTitle>
            <CardDescription>챌린지에 참여하려면 먼저 로그인해주세요.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full">홈으로 돌아가기</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              홈으로
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className="text-4xl font-bold text-gray-800">일일 챌린지</h1>
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">총 포인트</CardTitle>
              <Award className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getTotalPoints()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">완료한 날</CardTitle>
              <CalendarIcon className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getCompletedDaysCount()}일</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">연속 달성</CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3일</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Today's Challenge */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-500" />
              오늘의 챌린지
            </h2>

            {todayChallenge && (
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">{todayChallenge.title}</CardTitle>
                      <CardDescription className="mt-2">{todayChallenge.description}</CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(todayChallenge.difficulty)}>
                      {getDifficultyText(todayChallenge.difficulty)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">포인트:</span>
                      <Badge variant="outline">{todayChallenge.points}P</Badge>
                    </div>

                    {isChallengeCompleted(getTodayDateString(), todayChallenge.id) ? (
                      <Button disabled className="bg-green-500">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        완료됨
                      </Button>
                    ) : (
                      <Button onClick={() => completeChallenge(todayChallenge.id)}>
                        <Clock className="h-4 w-4 mr-2" />
                        완료하기
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* All Challenges */}
            <h3 className="text-xl font-semibold mb-4">모든 챌린지</h3>
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium">{challenge.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {challenge.category}
                          </Badge>
                          <Badge className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                            {getDifficultyText(challenge.difficulty)}
                          </Badge>
                          <span className="text-xs text-gray-500">{challenge.points}P</span>
                        </div>
                      </div>

                      {isChallengeCompleted(getTodayDateString(), challenge.id) && (
                        <CheckCircle className="h-5 w-5 text-green-500 ml-4" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Calendar */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-green-500" />
              챌린지 달력
            </h2>

            <Card>
              <CardContent className="p-6">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                  modifiers={{
                    completed: (date) => {
                      const dateString = getDateString(date)
                      return completions.some((c) => c.date === dateString && c.completed)
                    },
                  }}
                  modifiersStyles={{
                    completed: {
                      backgroundColor: "#10b981",
                      color: "white",
                      fontWeight: "bold",
                    },
                  }}
                />

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">
                    {selectedDate.toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h4>

                  {completions.filter((c) => c.date === getDateString(selectedDate) && c.completed).length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600 font-medium">✅ 챌린지 완료!</p>
                      {completions
                        .filter((c) => c.date === getDateString(selectedDate) && c.completed)
                        .map((completion) => {
                          const challenge = challenges.find((c) => c.id === completion.challengeId)
                          return challenge ? (
                            <div key={completion.challengeId} className="text-sm text-gray-600">
                              • {challenge.title} (+{challenge.points}P)
                            </div>
                          ) : null
                        })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">이 날은 챌린지를 완료하지 않았습니다.</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
