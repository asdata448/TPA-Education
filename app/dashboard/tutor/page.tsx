import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
export default function TutorDashboardPage(){return <main className="container mx-auto min-h-screen space-y-6 p-6"><Card><CardHeader><CardTitle>Tutor Dashboard</CardTitle><CardDescription>Class workspace and open teaching opportunities.</CardDescription></CardHeader><CardContent className="flex flex-wrap gap-3"><Button asChild><Link href="/dashboard/tutor/classes">My classes</Link></Button><Button asChild variant="secondary"><Link href="/dashboard/tutor/open-classes">Open classes</Link></Button></CardContent></Card></main>}
