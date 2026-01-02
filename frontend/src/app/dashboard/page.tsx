import { getContentFiles, parseDeadlines } from "@/lib/content"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  CheckCircle2,
  Circle,
  Target,
  TrendingUp,
  Clock,
  AlertTriangle,
} from "lucide-react"

export default async function DashboardPage() {
  const files = await getContentFiles()
  const deadlinesFile = files.find((f) => f.slug === "deadlines")
  const deadlines = deadlinesFile ? parseDeadlines(deadlinesFile.content) : []

  const pendingDeadlines = deadlines.filter((d) => !d.completed)
  const completedDeadlines = deadlines.filter((d) => d.completed)

  const categorizedPending = pendingDeadlines.reduce(
    (acc, d) => {
      if (!acc[d.category]) acc[d.category] = []
      acc[d.category].push(d)
      return acc
    },
    {} as Record<string, typeof pendingDeadlines>
  )

  const progress = deadlines.length > 0
    ? Math.round((completedDeadlines.length / deadlines.length) * 100)
    : 0

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Track your deadlines, opportunities, and progress.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="col-span-2 glow">
          <CardHeader className="pb-2">
            <CardDescription>Overall Progress</CardDescription>
            <CardTitle className="text-4xl">{progress}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {completedDeadlines.length} of {deadlines.length} tasks completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Circle className="h-3 w-3" />
              Pending
            </CardDescription>
            <CardTitle className="text-3xl">{pendingDeadlines.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              Tasks awaiting
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Completed
            </CardDescription>
            <CardTitle className="text-3xl">{completedDeadlines.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <Target className="h-3 w-3 mr-1" />
              Tasks finished
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Circle className="h-3 w-3" />
            Pending ({pendingDeadlines.length})
          </TabsTrigger>
          <TabsTrigger value="completed" className="gap-2">
            <CheckCircle2 className="h-3 w-3" />
            Completed ({completedDeadlines.length})
          </TabsTrigger>
          <TabsTrigger value="all" className="gap-2">
            <Calendar className="h-3 w-3" />
            All ({deadlines.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <div className="space-y-6">
            {Object.entries(categorizedPending).map(([category, items]) => (
              <Card key={category}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {category === "Deadlines" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                      {category === "Conferences" && <Calendar className="h-4 w-4 text-blue-500" />}
                      {category === "Opportunities" && <TrendingUp className="h-4 w-4 text-green-500" />}
                      {category}
                    </CardTitle>
                    <Badge variant="secondary">{items.length}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {items.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors group"
                      >
                        <Checkbox className="mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm break-words">{item.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            {pendingDeadlines.length === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground py-8">
                    No pending tasks - you&apos;re all caught up!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                Completed Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {completedDeadlines.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <Checkbox checked disabled className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-muted-foreground line-through break-words">
                        {item.text}
                      </p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                ))}
                {completedDeadlines.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No completed tasks yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">All Tasks</CardTitle>
              <CardDescription>Complete overview of all deadlines and opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {deadlines.map((item, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                      item.completed ? "bg-muted/20" : "bg-muted/30 hover:bg-muted/50"
                    }`}
                  >
                    <Checkbox checked={item.completed} disabled className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm break-words ${item.completed ? "text-muted-foreground line-through" : ""}`}>
                        {item.text}
                      </p>
                      <Badge variant="outline" className="mt-1 text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Separator className="my-8" />

      <div>
        <h2 className="text-xl font-semibold mb-4">Category Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categorizedPending).map(([category, items]) => (
            <Card key={category}>
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">{category}</CardDescription>
                <CardTitle className="text-2xl">{items.length}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(items.length / pendingDeadlines.length) * 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
