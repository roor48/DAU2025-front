"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Recycle,
  BoxIcon as Bottle,
  FileText,
  Wine,
  Zap,
  Trash2,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ArrowLeft,
} from "lucide-react"

const recyclingData = {
  plastic: {
    title: "플라스틱",
    icon: Bottle,
    color: "bg-blue-500",
    items: [
      {
        name: "PET병",
        method: "라벨 제거 후 압축하여 배출",
        tips: ["내용물을 완전히 비우고 헹구기", "뚜껑은 분리하여 일반쓰레기로"],
        canRecycle: true,
      },
      {
        name: "플라스틱 용기",
        method: "깨끗이 씻어서 배출",
        tips: ["음식물 찌꺼기 완전 제거", "색깔별로 분리 불필요"],
        canRecycle: true,
      },
      {
        name: "비닐봉지",
        method: "깨끗한 것만 모아서 배출",
        tips: ["이물질이 묻은 것은 일반쓰레기", "투명하고 깨끗한 것만"],
        canRecycle: true,
      },
    ],
  },
  paper: {
    title: "종이",
    icon: FileText,
    color: "bg-green-500",
    items: [
      {
        name: "신문지",
        method: "물에 젖지 않게 묶어서 배출",
        tips: ["끈으로 묶거나 종이박스에 담기", "비닐 코팅된 광고지 제외"],
        canRecycle: true,
      },
      {
        name: "골판지",
        method: "테이프, 스테이플러 침 제거 후 배출",
        tips: ["접어서 부피 줄이기", "물에 젖으면 재활용 불가"],
        canRecycle: true,
      },
      {
        name: "코팅된 종이컵",
        method: "일반쓰레기로 배출",
        tips: ["플라스틱 코팅으로 재활용 불가", "내용물은 완전히 비우기"],
        canRecycle: false,
      },
    ],
  },
  glass: {
    title: "유리",
    icon: Wine,
    color: "bg-amber-500",
    items: [
      {
        name: "유리병",
        method: "뚜껑 제거 후 색깔별 분리배출",
        tips: ["투명, 갈색, 녹색으로 분리", "라벨 제거 불필요"],
        canRecycle: true,
      },
      {
        name: "깨진 유리",
        method: "신문지에 싸서 일반쓰레기로 배출",
        tips: ["안전을 위해 신문지로 포장", "재활용 불가능"],
        canRecycle: false,
      },
    ],
  },
  metal: {
    title: "캔류",
    icon: Zap,
    color: "bg-gray-500",
    items: [
      {
        name: "알루미늄 캔",
        method: "내용물 비우고 압축하여 배출",
        tips: ["물로 헹구기", "담배꽁초 등 이물질 제거"],
        canRecycle: true,
      },
      {
        name: "철캔",
        method: "라벨 제거 후 배출",
        tips: ["자석에 붙는 캔", "녹슨 것도 재활용 가능"],
        canRecycle: true,
      },
    ],
  },
}

export default function RecyclingGuide() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredData = Object.entries(recyclingData).filter(([key, category]) => {
    if (selectedCategory !== "all" && key !== selectedCategory) return false
    if (searchTerm === "") return true

    return (
      category.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.items.some((item) => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  })

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
            <Recycle className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-800">분리배출 가이드</h1>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            올바른 분리배출로 환경을 보호하고 자원을 재활용해요. 각 품목별 올바른 배출 방법을 확인하세요.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-md mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="재활용품을 검색하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">전체</TabsTrigger>
            <TabsTrigger value="plastic">플라스틱</TabsTrigger>
            <TabsTrigger value="paper">종이</TabsTrigger>
            <TabsTrigger value="glass">유리</TabsTrigger>
            <TabsTrigger value="metal">캔류</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Important Notice */}
        <Alert className="mb-8 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>중요:</strong> 분리배출 전 반드시 내용물을 비우고 깨끗이 씻어주세요. 오염된 재활용품은 전체 재활용
            과정에 악영향을 미칠 수 있습니다.
          </AlertDescription>
        </Alert>

        {/* Recycling Categories */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
          {filteredData.map(([key, category]) => {
            const IconComponent = category.icon
            return (
              <Card key={key} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{category.title}</CardTitle>
                      <CardDescription>{category.items.length}개 품목</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {category.items.map((item, index) => (
                      <div key={index} className="border rounded-lg p-4 bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          <Badge variant={item.canRecycle ? "default" : "destructive"}>
                            {item.canRecycle ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {item.canRecycle ? "재활용 가능" : "일반쓰레기"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{item.method}</p>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-gray-700">주의사항:</p>
                          {item.tips.map((tip, tipIndex) => (
                            <p key={tipIndex} className="text-xs text-gray-600 flex items-start gap-1">
                              <span className="text-green-500 mt-0.5">•</span>
                              {tip}
                            </p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredData.length === 0 && (
          <div className="text-center py-12">
            <Trash2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">검색 결과가 없습니다.</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>올바른 분리배출로 깨끗한 환경을 만들어가요 🌱</p>
          <p className="mt-2">지역별 배출 방법이 다를 수 있으니 관할 구청에 문의하세요.</p>
        </div>
      </div>
    </div>
  )
}
