"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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
} from "lucide-react"

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
    title: "플라스틱 용기 분리배출하기",
    description: "오늘 사용한 플라스틱 용기를 깨끗이 씻어서 분리배출해보세요.",
    points: 5,
    difficulty: "easy",
    category: "분리배출",
  },
  {
    id: "2",
    title: "대중교통 이용하기",
    description: "자동차 대신 버스, 지하철, 도보, 자전거 등 친환경 교통수단 이용하세요.",
    points: 5,
    difficulty: "easy",
    category: "생활습관",
  },
  {
    id: "3",
    title: "텀블러 사용하기",
    description: "오늘 하루 카페나 외출 시 일회용 컵 대신 텀블러를 사용하세요.",
    points: 5,
    difficulty: "easy",
    category: "생활습관",
  },
  {
    id: "4",
    title: "종이 재활용하기",
    description: "집에 있는 신문지나 박스를 정리해서 분리배출해보세요.",
    points: 5,
    difficulty: "easy",
    category: "분리배출",
  },
  {
    id: "5",
    title: "전기제품 플러그 뽑기",
    description: "불필요한 플러그는 잠시 뽑아보세요",
    points: 5,
    difficulty: "easy",
    category: "생활습관",
  },
  {
    id: "15",
    title: "음식 남기지 않기",
    description: "식사량을 조절해 음식물 쓰레기를 줄여보세요.",
    points: 5,
    difficulty: "easy",
    category: "생활습관",
  },
  {
    id: "6",
    title: "일회용품 금지",
    description: "오늘 하루 일회용 컵이나 빨대 사용을 피해보세요.",
    points: 10,
    difficulty: "medium",
    category: "생활습관",
  },
  {
    id: "7",
    title: "친환경 제품 사용하기",
    description: "오늘 하루 친환경 세제나 제품을 사용해보세요.",
    points: 10,
    difficulty: "medium",
    category: "생활습관",
  },
  {
    id: "8",
    title: "조명 끄기",
    description: "방을 비울 땐 조명 꺼서 대기전력을 줄여보세요.",
    points: 10,
    difficulty: "medium",
    category: "생활습관",
  },
  {
    id: "9",
    title: "장바구니 들고 장보기",
    description: "비닐봉투 대신 장바구니 챙겨서 사용해보세요.",
    points: 10,
    difficulty: "medium",
    category: "생활습관",
  },
  {
    id: "10",
    title: "손수건 사용하기",
    description: "공공장소나 화장실에서 손수건을 사용해보세요.",
    points: 10,
    difficulty: "medium",
    category: "생활습관",
  },
  {
    id: "11",
    title: "헌 옷 기부하기",
    description: "집에 있는 입지 않는 옷은 기부처에 보내보세요.",
    points: 20,
    difficulty: "hard",
    category: "분리배출",
  },
  {
    id: "12",
    title: "업사이클링 DIY 만들기",
    description: "재활용품을 활용해 나만의 물건 만들어보세요. (예: 페트병 화분)",
    points: 20,
    difficulty: "hard",
    category: "분리배출",
  },
  {
    id: "13",
    title: "플로깅 하기",
    description: "조깅하면서 쓰레기를 주워보세요.",
    points: 20,
    difficulty: "hard",
    category: "생활습관",
  },
  {
    id: "14",
    title: "재사용 용기 챙기기",
    description: "식당이나 포장 주문 시 본인 용기를 사용해보세요.",
    points: 20,
    difficulty: "hard",
    category: "생활습관",
  },
  // 추가 챌린지 할 거 추천
]

// 오늘 날짜 YYYY-MM-DD 포맷 함수
const getTodayDateString = () => new Date().toISOString().split("T")[0]

// 난수 생성 함수 (날짜 기반 시드형 랜덤) — 날짜별 고정 결과 보장
function getSeededRandom(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
    hash |= 0 // 32bit 정수 변환
  }
  return () => {
    hash ^= hash << 13
    hash ^= hash >> 17
    hash ^= hash << 5
    return (hash >>> 0) / 0xffffffff
  }
}

export default function ChallengePage() {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [completions, setCompletions] = useState<ChallengeCompletion[]>([])
  // 오늘 날짜에 랜덤으로 난이도별 하나씩 뽑힌 3개 미션
  const [todayChallenges, setTodayChallenges] = useState<Challenge[]>([])
  // 사용자가 선택한 미션 ID (오늘 날짜 기준)
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null)

  useEffect(() => {
    // 오늘 날짜 기준으로 랜덤하지만 고정된 3개 (쉬움, 보통, 어려움 각각 하나씩)
    const today = getTodayDateString()
    const rand = getSeededRandom(today)

    const easyList = challenges.filter((c) => c.difficulty === "easy")
    const mediumList = challenges.filter((c) => c.difficulty === "medium")
    const hardList = challenges.filter((c) => c.difficulty === "hard")

    const pickOne = (list: Challenge[]) =>
      list.length > 0 ? list[Math.floor(rand() * list.length)] : null

    const selected = [pickOne(easyList), pickOne(mediumList), pickOne(hardList)].filter(
      Boolean
    ) as Challenge[]
    setTodayChallenges(selected)

    // 로컬스토리지에서 완료 기록 불러오기
    const savedCompletions = localStorage.getItem("challenge-completions")
    if (savedCompletions) setCompletions(JSON.parse(savedCompletions))

    // 오늘 날짜 기준 선택 미션 아이디 불러오기
    const savedSelected = localStorage.getItem(`selected-challenge-${today}`)
    if (savedSelected) setSelectedChallengeId(savedSelected)
  }, [])

  // 날짜별 string 변환
  const getDateString = (date: Date) => date.toISOString().split("T")[0]

  // 특정 날짜, 챌린지 id의 완료 여부 확인
  const isChallengeCompleted = (date: string, challengeId: string) => {
    return completions.some(
      (c) => c.date === date && c.challengeId === challengeId && c.completed
    )
  }

  // 미션 선택 시 저장
  const selectChallenge = (challengeId: string) => {
    const today = getTodayDateString()
    setSelectedChallengeId(challengeId)
    localStorage.setItem(`selected-challenge-${today}`, challengeId)

  // 선택된 미션만 오늘 미션 리스트로 설정
    const selected = todayChallenges.find((c) => c.id === challengeId)
    if (selected) setTodayChallenges([selected])
  } 

  // 완료하기 버튼 클릭 시 완료 처리
  const completeSelectedChallenge = () => {
    if (!selectedChallengeId) return
    const today = getTodayDateString()
    // 중복 완료 제거 후 새 완료 저장
    const updated = [
      ...completions.filter(
        (c) => !(c.date === today && c.challengeId === selectedChallengeId)
      ),
      { date: today, challengeId: selectedChallengeId, completed: true },
    ]
    setCompletions(updated)
    localStorage.setItem("challenge-completions", JSON.stringify(updated))
  }

  // 총 포인트 계산
  const getTotalPoints = () => {
    return completions.reduce((total, completion) => {
      if (completion.completed) {
        const challenge = challenges.find((c) => c.id === completion.challengeId)
        return total + (challenge?.points || 0)
      }
      return total
    }, 0)
  }

  // 완료한 날짜 수 계산
  const getCompletedDaysCount = () => {
    const uniqueDates = new Set(completions.filter((c) => c.completed).map((c) => c.date))
    return uniqueDates.size
  }

  // 난이도에 따른 배경/텍스트 색상 클래스
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

  // 난이도 한글 텍스트
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

        {/* Stats: 총포인트, 완료한 날, 연속 달성 */}
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
              <div className="text-2xl font-bold">3일</div> {/* 이 부분은 너가 로직 추가 필요 */}
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* 오늘 날짜 미션 3개 중 하나 선택 UI */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Target className="h-6 w-6 text-blue-500" />
              오늘의 챌린지 (난이도별 3개 중 1개 선택)
            </h2>

            {todayChallenges.length === 0 && (
              <p>오늘의 챌린지가 없습니다.</p>
            )}

            {todayChallenges.map((challenge) => {
              const completed = isChallengeCompleted(getTodayDateString(), challenge.id)
              const isSelected = selectedChallengeId === challenge.id

              return (
                <Card
                  key={challenge.id}
                  className={`mb-4 border-2 ${
                    isSelected ? "border-blue-500" : "border-transparent"
                  } hover:shadow-md transition-shadow cursor-pointer`}
                  onClick={() => selectChallenge(challenge.id)}
                >
                  <CardHeader className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{challenge.title}</CardTitle>
                      <CardDescription>{challenge.description}</CardDescription>
                    </div>
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {getDifficultyText(challenge.difficulty)}
                    </Badge>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <div>
                      <Badge variant="outline">{challenge.points}P</Badge>
                    </div>
                    <div>
                      {completed ? (
                        <Button disabled className="bg-green-500 cursor-default">
                          <CheckCircle className="h-4 w-4 mr-2" />
                          완료됨
                        </Button>
                      ) : isSelected ? (
                        <Button onClick={completeSelectedChallenge}>
                          <Clock className="h-4 w-4 mr-2" />
                          완료하기
                        </Button>
                      ) : (
                        <Button variant="outline">선택하기</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* 달력 */}
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
                      return completions.some(
                        (c) => c.date === dateString && c.completed
                      )
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

                  {completions.filter(
                    (c) =>
                      c.date === getDateString(selectedDate) &&
                      c.completed
                  ).length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-green-600 font-medium">
                        ✅ 챌린지 완료!
                      </p>
                      {completions
                        .filter(
                          (c) =>
                            c.date === getDateString(selectedDate) &&
                            c.completed
                        )
                        .map((completion) => {
                          const challenge = challenges.find(
                            (c) => c.id === completion.challengeId
                          )
                          return challenge ? (
                            <div
                              key={completion.challengeId}
                              className="text-sm text-gray-600"
                            >
                              • {challenge.title} (+{challenge.points}P)
                            </div>
                          ) : null
                        })}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      이 날은 챌린지를 완료하지 않았습니다.
                    </p>
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