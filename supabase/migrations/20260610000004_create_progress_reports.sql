-- Migration to create class_progress_reports table (Epic 11)

CREATE TABLE IF NOT EXISTS public.class_progress_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  reporting_month varchar(7) NOT NULL, -- Format: 'YYYY-MM'
  
  -- Lessons completed
  lessons_completed integer NOT NULL DEFAULT 0,
  
  -- Ratings (1 to 5 stars)
  rating_comprehension integer NOT NULL CHECK (rating_comprehension BETWEEN 1 AND 5),
  rating_homework integer NOT NULL CHECK (rating_homework BETWEEN 1 AND 5),
  rating_attendance integer NOT NULL CHECK (rating_attendance BETWEEN 1 AND 5),
  rating_attitude integer NOT NULL CHECK (rating_attitude BETWEEN 1 AND 5),
  
  -- Tutor text feedback
  teacher_comments text NOT NULL,
  next_month_plan text,
  
  -- Tuition fee at the time of report creation
  tuition_fee numeric(12,2) NOT NULL,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT class_reports_class_month_unique UNIQUE (class_id, reporting_month)
);

CREATE INDEX IF NOT EXISTS class_reports_class_id_idx ON public.class_progress_reports(class_id);
CREATE INDEX IF NOT EXISTS class_reports_reporting_month_idx ON public.class_progress_reports(reporting_month);

-- Trigger to update updated_at
CREATE OR REPLACE TRIGGER class_progress_reports_set_updated_at
  BEFORE UPDATE ON public.class_progress_reports
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enable Row Level Security (RLS)
ALTER TABLE public.class_progress_reports ENABLE ROW LEVEL SECURITY;

-- 1. Admins have full access
DROP POLICY IF EXISTS "class_reports_admin_all" ON public.class_progress_reports;
CREATE POLICY "class_reports_admin_all"
  ON public.class_progress_reports
  FOR ALL
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- 2. Tutors can read reports of their assigned classes
DROP POLICY IF EXISTS "class_reports_tutor_read" ON public.class_progress_reports;
CREATE POLICY "class_reports_tutor_read"
  ON public.class_progress_reports
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      JOIN public.tutors t ON c.tutor_id = t.id
      WHERE c.id = class_progress_reports.class_id
        AND t.profile_id = auth.uid()
    )
  );

-- 3. Tutors can insert reports for their assigned classes
DROP POLICY IF EXISTS "class_reports_tutor_insert" ON public.class_progress_reports;
CREATE POLICY "class_reports_tutor_insert"
  ON public.class_progress_reports
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.classes c
      JOIN public.tutors t ON c.tutor_id = t.id
      WHERE c.id = class_progress_reports.class_id
        AND t.profile_id = auth.uid()
    )
  );

-- 4. Tutors can update reports of their assigned classes
DROP POLICY IF EXISTS "class_reports_tutor_update" ON public.class_progress_reports;
CREATE POLICY "class_reports_tutor_update"
  ON public.class_progress_reports
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      JOIN public.tutors t ON c.tutor_id = t.id
      WHERE c.id = class_progress_reports.class_id
        AND t.profile_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.classes c
      JOIN public.tutors t ON c.tutor_id = t.id
      WHERE c.id = class_progress_reports.class_id
        AND t.profile_id = auth.uid()
    )
  );

-- 5. Public read access to view report details online via UUID link without logging in
DROP POLICY IF EXISTS "class_reports_public_read" ON public.class_progress_reports;
CREATE POLICY "class_reports_public_read"
  ON public.class_progress_reports
  FOR SELECT
  TO public
  USING (true);
