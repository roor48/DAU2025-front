"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { useAuth } from "@/contexts/auth-context"
import {
  Trophy,
  CalendarIcon,
  CheckCircle,
  Clock,
  ArrowLeft,
  Target,
  Flame,
  Award,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

interface Challenge {
  id: string
  title: string
  description: string
  points: number
  difficulty: "easy" | "medium" | "hard"
  category: string
}

interface TodayChallenge {
  id: number
  title: string
  description: string
  point: number
  difficulty: "Easy" | "Medium" | "Hard"
}

interface ChallengeHistory {
  challengeId: number
  userId: number
  date: string
  title: string
  description: string
  point: number
  difficulty: "Easy" | "Medium" | "Hard"
  category: string
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
  const [challengeHistory, setChallengeHistory] = useState<ChallengeHistory[]>([])
  const [todayChallenge, setTodayChallenge] = useState<Challenge>()
  const [isLoading, setIsLoading] = useState(false)
  const [todayChallenges, setTodayChallenges] = useState<TodayChallenge[]>([])
  const [selectedChallengeId, setSelectedChallengeId] = useState<number | null>(null)
  const [completedTodayChallenge, setCompletedTodayChallenge] = useState<ChallengeHistory | null>(null)
  const [isChallengeLoading, setIsChallengeLoading] = useState(false)
  const [isCompletingChallenge, setIsCompletingChallenge] = useState(false)

  useEffect(() => {
    if (user?.id) {
      fetchTodayChallenges()
      fetchChallengeHistory()
    }
  }, [user])

  useEffect(() => {
    if (user?.id && todayChallenges.length > 0) {
      // 오늘 완료한 챌린지가 있는지 확인
      const today = getTodayDateString()
      const todayCompleted = challengeHistory.find((h: ChallengeHistory) => h.date === today)
      if (todayCompleted) {
        setCompletedTodayChallenge(todayCompleted)
        setSelectedChallengeId(todayCompleted.challengeId)
      }
    }
  }, [user, todayChallenges, challengeHistory])

  const fetchTodayChallenges = async () => {
    setIsChallengeLoading(true)
    try {
      const response = await fetch("http://localhost:8080/api/v1/challenge/todayChallenge", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("오늘의 챌린지를 가져오는데 실패했습니다.")
      }

      const challengesData = await response.json()
      setTodayChallenges(challengesData)
    } catch (error) {
      console.error("Today challenges fetch error:", error)
    } finally {
      setIsChallengeLoading(false)
    }
  }

  const fetchChallengeHistory = async () => {
    if (!user?.id) return

    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:8080/api/v1/challenge/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Number(user.id)),
      })

      if (!response.ok) {
        throw new Error("챌린지 히스토리를 가져오는데 실패했습니다.")
      }

      const historyData = await response.json()
      setChallengeHistory(historyData)

      // 오늘 완료한 챌린지가 있는지 확인
      const today = getTodayDateString()
      const todayCompleted = historyData.find((h: ChallengeHistory) => h.date === today)
      if (todayCompleted) {
        setCompletedTodayChallenge(todayCompleted)
        setSelectedChallengeId(todayCompleted.challengeId)
      }
    } catch (error) {
      console.error("Challenge history fetch error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // 챌린지 완료 후 히스토리 다시 불러오기
  const refreshAfterCompletion = async () => {
    if (user?.id) {
      await fetchChallengeHistory()
    }
  }

  const getTodayDateString = () => {
    const today = new Date()
    const year = today.getFullYear()
    const month = String(today.getMonth() + 1).padStart(2, "0")
    const day = String(today.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const getDateString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const isChallengeCompleted = (date: string, challengeId?: string) => {
    if (!challengeId) return false
    const challengeIdNum = Number.parseInt(challengeId)
    return challengeHistory.some((h) => h.date === date && h.challengeId === challengeIdNum)
  }

  const completeChallenge = (challengeId: string) => {
    // 실제 구현에서는 서버에 완료 요청을 보내야 함
    // 여기서는 임시로 로컬 상태만 업데이트
    const today = getTodayDateString()
    const selectedChallenge = todayChallenges.find((c) => c.id === Number.parseInt(challengeId))
    if (!selectedChallenge) return

    const newHistory: ChallengeHistory = {
      challengeId: Number.parseInt(challengeId),
      userId: user?.id || 0,
      date: today,
      title: selectedChallenge.title,
      description: selectedChallenge.description,
      point: selectedChallenge.point,
      difficulty: selectedChallenge.difficulty,
      category: "분리배출", // 기본값
    }

    setChallengeHistory((prev) => [
      ...prev.filter((h) => !(h.date === today && h.challengeId === Number.parseInt(challengeId))),
      newHistory,
    ])
  }

  const isTodayCompleted = () => {
    const today = getTodayDateString()
    return challengeHistory.some((h) => h.date === today)
  }

  const completeSelectedChallenge = async () => {
    if (!selectedChallengeId || !user?.id || isTodayCompleted()) return

    const selectedChallenge = todayChallenges.find((c) => c.id === selectedChallengeId)
    if (!selectedChallenge) return

    setIsCompletingChallenge(true)
    try {
      // 서버에 챌린지 완료 요청 보내기
      const response = await fetch("http://localhost:8080/api/v1/challenge/set/history", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          challengeId: selectedChallengeId,
          userId: Number(user.id),
          date: getTodayDateString(),
        }),
      })

      if (!response.ok) {
        throw new Error("챌린지 완료 요청이 실패했습니다.")
      }

      // 성공적으로 완료되면 히스토리 새로고침
      await refreshAfterCompletion()

      console.log("챌린지가 성공적으로 완료되었습니다!")
    } catch (error) {
      console.error("Challenge completion error:", error)
      // 에러 처리 - 사용자에게 알림을 보여줄 수 있습니다
      alert("챌린지 완료 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsCompletingChallenge(false)
    }
  }

  const getTotalPoints = () => {
    return challengeHistory.reduce((total, history) => {
      return total + history.point
    }, 0)
  }

  const getCompletedDaysCount = () => {
    const uniqueDates = new Set(challengeHistory.map((h) => h.date))
    return uniqueDates.size
  }

  const getConsecutiveDays = () => {
    if (challengeHistory.length === 0) return 0

    // 고유한 날짜들을 추출하고 정렬
    const uniqueDates = [...new Set(challengeHistory.map((h) => h.date))].sort()

    if (uniqueDates.length === 0) return 0

    let maxStreak = 1 // 최소 1일은 있으므로
    let currentStreak = 1

    // 연속된 날짜들을 확인
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i - 1])
      const currentDate = new Date(uniqueDates[i])

      // 하루 차이인지 확인 (밀리초 단위로 계산)
      const timeDiff = currentDate.getTime() - prevDate.getTime()
      const dayDiff = timeDiff / (1000 * 60 * 60 * 24)

      if (dayDiff === 1) {
        // 연속된 날짜
        currentStreak++
        maxStreak = Math.max(maxStreak, currentStreak)
      } else {
        // 연속이 끊어짐
        currentStreak = 1
      }
    }

    return maxStreak
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
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
    switch (difficulty.toLowerCase()) {
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

        {/* Loading indicator */}
        {(isLoading || isChallengeLoading) && (
          <div className="text-center mb-4">
            <p className="text-gray-600">챌린지 데이터를 불러오는 중...</p>
          </div>
        )}

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
              <div className="text-2xl font-bold">{getConsecutiveDays()}일</div>
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

            {!isTodayCompleted() ? (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">오늘의 챌린지를 선택하세요</CardTitle>
                  <CardDescription>
                    아래 챌린지 중 하나를 선택해서 완료해보세요. 하루에 하나만 완료할 수 있습니다.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    {todayChallenges.map((challenge) => (
                      <div
                        key={challenge.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedChallengeId === challenge.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedChallengeId(challenge.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{challenge.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                                {getDifficultyText(challenge.difficulty)}
                              </Badge>
                              <span className="text-xs text-gray-500">{challenge.point}P</span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                selectedChallengeId === challenge.id ? "border-blue-500 bg-blue-500" : "border-gray-300"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    onClick={completeSelectedChallenge}
                    disabled={!selectedChallengeId || isCompletingChallenge}
                    className="w-full"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    {isCompletingChallenge ? "완료 중..." : "선택한 챌린지 완료하기"}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl">오늘의 챌린지</CardTitle>
                  <CardDescription>
                    오늘은 이미 챌린지를 완료했습니다. 내일 새로운 챌린지에 도전해보세요!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {todayChallenges.map((challenge) => {
                      const isCompleted = challengeHistory.some(
                        (h) => h.date === getTodayDateString() && h.challengeId === challenge.id,
                      )

                      return (
                        <div
                          key={challenge.id}
                          className={`p-4 border rounded-lg ${
                            isCompleted ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50 opacity-60"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{challenge.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Badge className={`text-xs ${getDifficultyColor(challenge.difficulty)}`}>
                                  {getDifficultyText(challenge.difficulty)}
                                </Badge>
                                <span className="text-xs text-gray-500">{challenge.point}P</span>
                              </div>
                            </div>
                            <div className="ml-4">
                              {isCompleted ? (
                                <div className="flex items-center gap-2">
                                  <CheckCircle className="h-5 w-5 text-green-500" />
                                  <span className="text-sm font-medium text-green-600">완료됨</span>
                                </div>
                              ) : (
                                <span className="text-sm text-gray-400">미완료</span>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Calendar */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CalendarIcon className="h-6 w-6 text-green-500" />
              챌린지 달력
            </h2>

            <Card>
              <CardContent className="p-6">
                <div className="w-full max-w-md mx-auto">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    className="rounded-md border-0 w-full"
                    classNames={{
                      months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 w-full",
                      month: "space-y-4 w-full",
                      caption: "flex justify-center pt-1 relative items-center mb-4",
                      caption_label: "text-sm font-medium",
                      nav: "space-x-1 flex items-center",
                      nav_button:
                        "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 border border-input rounded-md hover:bg-accent hover:text-accent-foreground",
                      nav_button_previous: "absolute left-1",
                      nav_button_next: "absolute right-1",
                      table: "w-full border-collapse space-y-1",
                      head_row: "flex w-full gap-4",
                      head_cell: "text-muted-foreground rounded-md w-full font-normal text-[0.8rem] flex-1 text-center",
                      row: "flex w-full mt-2 gap-4",
                      cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1",
                      day: "h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground rounded-md",
                      day_selected:
                        "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                      day_today: "bg-accent text-accent-foreground",
                      day_outside:
                        "text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
                      day_disabled: "text-muted-foreground opacity-50",
                      day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                      day_hidden: "invisible",
                    }}
                    modifiers={{
                      completed: (date) => {
                        const dateString = getDateString(date)
                        return challengeHistory.some((h) => h.date === dateString)
                      },
                    }}
                    modifiersStyles={{
                      completed: {
                        backgroundColor: "#10b981",
                        color: "white",
                        fontWeight: "bold",
                      },
                    }}
                    components={{
                      IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                      IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                    }}
                  />
                </div>

                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">
                    {selectedDate.toLocaleDateString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </h4>

                  {challengeHistory.filter((h) => h.date === getDateString(selectedDate)).length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600 font-medium">✅ 챌린지 완료!</p>
                      {challengeHistory
                        .filter((h) => h.date === getDateString(selectedDate))
                        .map((history) => (
                          <div key={`${history.challengeId}-${history.date}`} className="text-sm text-gray-600">
                            • {history.title} (+{history.point}P)
                          </div>
                        ))}
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
