import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CreateTutorForm } from '../create-tutor-form'
import { listTutors } from '../data'

export default async function AdminTutorsPage() {
  const tutors = await listTutors()
  const activeCount = tutors.filter((t) => t.profileActive && t.tutorActive).length

  return (
    <main className="container mx-auto space-y-8 px-6 py-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <Link href="/dashboard/admin" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
            Back to Admin Dashboard
          </Link>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Tutor management</h1>
            <p className="text-muted-foreground">Create, view, update, reset passwords, deactivate, or delete Tutor accounts.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-muted-foreground">Total Tutors</p>
            <p className="text-2xl font-semibold">{tutors.length}</p>
          </div>
          <div className="rounded-lg border bg-card px-4 py-3">
            <p className="text-muted-foreground">Active</p>
            <p className="text-2xl font-semibold">{activeCount}</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Tutor</CardTitle>
          <CardDescription>Create a Supabase Auth user, Tutor profile, and generated initial password.</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateTutorForm />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tutors</CardTitle>
          <CardDescription>Read and manage every Tutor account from one place.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Subjects</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tutors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No Tutors yet.</TableCell>
                </TableRow>
              ) : (
                tutors.map((tutor) => (
                  <TableRow key={tutor.tutorId}>
                    <TableCell>
                      <div className="font-medium">{tutor.fullName}</div>
                      <div className="text-xs text-muted-foreground">{tutor.specialties || 'No specialties set'}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tutor.profileActive && tutor.tutorActive ? 'default' : 'secondary'}>
                        {tutor.profileActive && tutor.tutorActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>{tutor.subjects || '-'}</TableCell>
                    <TableCell>{tutor.phone || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/admin/tutors/${tutor.tutorId}`}>View / Edit</Link>
                      </Button>
                    </TableCell>
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
