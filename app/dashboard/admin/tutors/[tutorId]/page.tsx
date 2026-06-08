import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getTutorDetail } from '../../data'
import { EditTutorForm } from './edit-tutor-form'

export default async function TutorDetailPage({ params }: { params: Promise<{ tutorId: string }> }) {
  const { tutorId } = await params
  const tutor = await getTutorDetail(tutorId)

  if (!tutor) notFound()

  return (
    <main className="container mx-auto space-y-6 px-6 py-12">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground"><Link href="/dashboard/admin" className="underline-offset-4 hover:underline">Back to Tutors</Link></p>
          <h1 className="text-3xl font-semibold tracking-tight">{tutor.fullName}</h1>
          <p className="text-muted-foreground">{tutor.email}</p>
        </div>
        <Badge variant={tutor.profileActive && tutor.tutorActive ? 'default' : 'secondary'}>
          {tutor.profileActive && tutor.tutorActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>

      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Edit Tutor profile</CardTitle>
          <CardDescription>Update internal profile data and Tutor access status.</CardDescription>
        </CardHeader>
        <CardContent>
          <EditTutorForm tutor={tutor} />
        </CardContent>
      </Card>
    </main>
  )
}
