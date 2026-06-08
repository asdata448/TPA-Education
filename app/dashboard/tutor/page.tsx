import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TutorDashboardPage() {
  return (
    <main className="container mx-auto flex min-h-screen items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Tutor Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Tutor dashboard content will be implemented in future stories.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}
