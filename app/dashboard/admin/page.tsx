import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CreateClassForm, RequestReviewForm } from './create-class-form'
import { CreateTutorForm } from './create-tutor-form'
import { getAdminClassData } from './classes-data'
import { listTutors } from './data'

function resultValue<T>(result: PromiseSettledResult<T>, fallback: T) { return result.status === 'fulfilled' ? result.value : fallback }
function resultError(result: PromiseSettledResult<unknown>, label: string) { return result.status === 'fulfilled' ? null : `${label}: ${result.reason instanceof Error ? result.reason.message : 'Unable to load data'}` }

export default async function AdminDashboardPage() {
  const [tutorsResult, classDataResult] = await Promise.allSettled([listTutors(), getAdminClassData()])
  const tutors = resultValue(tutorsResult, [])
  const classData = resultValue(classDataResult, {subjects:[], tutors:[], classes:[], requests:[]})
  const loadErrors = [resultError(tutorsResult, 'Tutors'), resultError(classDataResult, 'Classes')].filter(Boolean)
  return <main className="container mx-auto space-y-8 px-6 py-12">
    {loadErrors.length>0&&<Card className="border-destructive"><CardHeader><CardTitle>Some admin data could not load</CardTitle></CardHeader><CardContent className="space-y-1 text-sm text-destructive">{loadErrors.map(e=><p key={e}>{e}</p>)}</CardContent></Card>}
    <Card><CardHeader><CardTitle>Create class</CardTitle><CardDescription>Admin creates class context, parent contact, tuition fee, assignment/open status, and schedule notes.</CardDescription></CardHeader><CardContent><CreateClassForm subjects={classData.subjects} tutors={classData.tutors}/></CardContent></Card>
    <Card><CardHeader><CardTitle>Class requests</CardTitle><CardDescription>Approve Tutor requests for open classes.</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Class</TableHead><TableHead>Tutor</TableHead><TableHead>Message</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{classData.requests.length===0?<TableRow><TableCell colSpan={4} className="py-8 text-center text-muted-foreground">No pending requests.</TableCell></TableRow>:classData.requests.map(r=><TableRow key={r.id}><TableCell>{r.classLabel}</TableCell><TableCell>{r.tutorName}</TableCell><TableCell>{r.message||'-'}</TableCell><TableCell><RequestReviewForm request={r}/></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
    <Card><CardHeader><CardTitle>Classes</CardTitle><CardDescription>All classes, assignment state, schedule context, and pricing.</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Student</TableHead><TableHead>Subject</TableHead><TableHead>Tutor</TableHead><TableHead>Status</TableHead><TableHead>Parent</TableHead><TableHead>Tuition fee</TableHead><TableHead>Schedule</TableHead></TableRow></TableHeader><TableBody>{classData.classes.length===0?<TableRow><TableCell colSpan={7} className="py-8 text-center text-muted-foreground">No classes yet.</TableCell></TableRow>:classData.classes.map(c=><TableRow key={c.id}><TableCell className="font-medium">{c.studentName}{c.studentGrade?` (${c.studentGrade})`:''}</TableCell><TableCell>{c.subjectName||'-'}</TableCell><TableCell>{c.tutorName||'Open'}</TableCell><TableCell><Badge variant={c.status==='open'?'secondary':'default'}>{c.status}</Badge></TableCell><TableCell>{c.parentName||'-'}{c.parentPhone?` / ${c.parentPhone}`:''}</TableCell><TableCell>{c.tuitionFee??'-'}</TableCell><TableCell>{c.scheduleNotes||'-'}</TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
    <Card className="mx-auto w-full max-w-3xl"><CardHeader><CardTitle>Create Tutor account</CardTitle><CardDescription>Create a private Tutor login and operational profile.</CardDescription></CardHeader><CardContent><CreateTutorForm /></CardContent></Card>
    <Card><CardHeader><CardTitle>Tutors</CardTitle><CardDescription>Review Tutor accounts, status, and profile details.</CardDescription></CardHeader><CardContent><Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Status</TableHead><TableHead>Subjects</TableHead><TableHead>Phone</TableHead><TableHead>Action</TableHead></TableRow></TableHeader><TableBody>{tutors.length===0?<TableRow><TableCell colSpan={5} className="py-8 text-center text-muted-foreground">No Tutors yet.</TableCell></TableRow>:tutors.map(t=><TableRow key={t.tutorId}><TableCell className="font-medium">{t.fullName}</TableCell><TableCell><Badge variant={t.profileActive&&t.tutorActive?'default':'secondary'}>{t.profileActive&&t.tutorActive?'Active':'Inactive'}</Badge></TableCell><TableCell>{t.subjects||'-'}</TableCell><TableCell>{t.phone||'-'}</TableCell><TableCell><Link className="text-sm font-medium text-primary underline-offset-4 hover:underline" href={`/dashboard/admin/tutors/${t.tutorId}`}>Open detail</Link></TableCell></TableRow>)}</TableBody></Table></CardContent></Card>
  </main>
}
