import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CreateTutorForm } from './create-tutor-form'
import { listTutors } from './data'

function resultValue<T>(result: PromiseSettledResult<T>, fallback: T) {
  return result.status === 'fulfilled' ? result.value : fallback
}

function resultError(result: PromiseSettledResult<unknown>, label: string) {
  if (result.status === 'fulfilled') return null
  return `${label}: ${result.reason instanceof Error ? result.reason.message : 'Unable to load data'}`
}

export default async function AdminDashboardPage() {
  const tutorsResult = await Promise.allSettled([listTutors()])
  const tutors = resultValue(tutorsResult[0], [])
  const loadErrors = [resultError(tutorsResult[0], 'Tutors')].filter(Boolean)

  return (
    <main className="container mx-auto space-y-8 px-6 py-12">
      {loadErrors.length > 0 && (
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle>Some admin data could not load</CardTitle>
            <CardDescription>The forms still work. Check these data sources:</CardDescription>
          </CardHeader>
          <CardContent className="space-y-1 text-sm text-destructive">
            {loadErrors.map((error) => <p key={error}>{error}</p>)}
          </CardContent>
        </Card>
      )}

      <Card className="mx-auto w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Create Tutor account</CardTitle>
          <CardDescription>Create a private Tutor login and operational profile.</CardDescription>
        </CardHeader>
        <CardContent><CreateTutorForm /></CardContent>
      </Card>

      <Card className="mx-auto w-full max-w-6xl">
        <CardHeader>
          <CardTitle>Tutors</CardTitle>
          <CardDescription>Review Tutor accounts, status, and profile details.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tutors.length === 0 ? (
                <TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No Tutors yet. Create the first Tutor account above.</TableCell></TableRow>
              ) : (
                tutors.map((tutor) => (
                  <TableRow key={tutor.tutorId}>
                    <TableCell className="font-medium">{tutor.fullName}</TableCell>
                    <TableCell><Badge variant={tutor.profileActive && tutor.tutorActive ? 'default' : 'secondary'}>{tutor.profileActive && tutor.tutorActive ? 'Active' : 'Inactive'}</Badge></TableCell>
                    <TableCell>{tutor.subjects || '-'}</TableCell>
                    <TableCell>{tutor.phone || '-'}</TableCell>
                    <TableCell><Link className="text-sm font-medium text-primary underline-offset-4 hover:underline" href={`/dashboard/admin/tutors/${tutor.tutorId}`}>Open detail</Link></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}
