import { requireTutorId } from './classes-data'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function TutorDashboardPage() {
  await requireTutorId()
  return (
    <main className="container mx-auto min-h-screen space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>Tutor Dashboard</CardTitle>
          <CardDescription>Class workspace and open teaching opportunities.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/dashboard/tutor/classes">My classes</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/dashboard/tutor/open-classes">Open classes</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/tutor/library">Material library</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/tutor/document-feedback">Document feedback</Link>
          </Button>
          <Button asChild variant="outline" className="border-teal-500 hover:bg-teal-50 hover:text-teal-700 dark:hover:bg-teal-950/20 dark:hover:text-teal-400">
            <Link href="/dashboard/tutor/bank-settings">Thông tin thanh toán & QR</Link>
          </Button>
          <Button asChild variant="outline" className="border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 dark:hover:bg-indigo-950/20 dark:hover:text-indigo-400">
            <Link href="/dashboard/tutor/reports">Báo cáo học tập</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}


