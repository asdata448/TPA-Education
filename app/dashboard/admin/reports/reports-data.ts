import { createAdminClient } from '@/lib/supabase/admin'

export async function getAllProgressReports() {
  try {
    const admin = createAdminClient()
    const { data, error } = await admin
      .from('class_progress_reports')
      .select(`
        *,
        classes (
          student_name,
          subjects (name),
          tutors (
            profiles (full_name)
          )
        )
      `)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    return (data || []).map((r: any) => {
      const c = r.classes
      const tutor = Array.isArray(c?.tutors) ? c.tutors[0] : c?.tutors
      const tutorName = tutor?.profiles?.full_name || 'Không rõ'
      const subjectName = (Array.isArray(c?.subjects) ? c.subjects[0]?.name : c?.subjects?.name) || 'Không rõ'

      return {
        id: r.id,
        reportingMonth: r.reporting_month,
        lessonsCompleted: r.lessons_completed,
        ratingComprehension: r.rating_comprehension,
        ratingHomework: r.rating_homework,
        ratingAttendance: r.rating_attendance,
        ratingAttitude: r.rating_attitude,
        teacherComments: r.teacher_comments,
        nextMonthPlan: r.next_month_plan,
        tuitionFee: Number(r.tuition_fee),
        createdAt: r.created_at,
        studentName: c?.student_name || 'Học sinh',
        subjectName,
        tutorName,
      }
    })
  } catch (error) {
    console.error('Error fetching all reports for admin:', error)
    return []
  }
}
