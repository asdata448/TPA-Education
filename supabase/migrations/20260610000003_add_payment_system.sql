-- Migration for Tuition & Tutor Payments Management System (Epic 10)

-- 1. Add bank information columns to public.tutors
ALTER TABLE public.tutors 
ADD COLUMN IF NOT EXISTS bank_name text,
ADD COLUMN IF NOT EXISTS bank_account_no text,
ADD COLUMN IF NOT EXISTS bank_account_name text,
ADD COLUMN IF NOT EXISTS bank_qr_key text;

-- Add update policy for tutors to manage their own bank info/profile details
DROP POLICY IF EXISTS "tutors_update_own" ON public.tutors;
CREATE POLICY "tutors_update_own"
  ON public.tutors
  FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

-- 2. Create public.class_payments table
CREATE TABLE IF NOT EXISTS public.class_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id uuid NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
  billing_month varchar(7) NOT NULL, -- Format 'YYYY-MM'
  
  -- Tuition status from parent
  tuition_fee numeric(12,2) NOT NULL,
  tuition_status text NOT NULL DEFAULT 'unpaid' CHECK (tuition_status IN ('unpaid', 'paid')),
  tuition_paid_at timestamptz,
  
  -- Payment status to tutor
  tutor_payment_status text NOT NULL DEFAULT 'unpaid' CHECK (tutor_payment_status IN ('unpaid', 'paid')),
  tutor_paid_at timestamptz,
  
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  
  CONSTRAINT class_payments_class_month_unique UNIQUE (class_id, billing_month)
);

CREATE INDEX IF NOT EXISTS class_payments_billing_month_idx ON public.class_payments(billing_month);
CREATE INDEX IF NOT EXISTS class_payments_tuition_status_idx ON public.class_payments(tuition_status);
CREATE INDEX IF NOT EXISTS class_payments_tutor_payment_status_idx ON public.class_payments(tutor_payment_status);

-- Add update trigger for updated_at
CREATE OR REPLACE TRIGGER class_payments_set_updated_at
  BEFORE UPDATE ON public.class_payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Row Level Security for class_payments
ALTER TABLE public.class_payments ENABLE ROW LEVEL SECURITY;

-- Admins can do everything
DROP POLICY IF EXISTS "class_payments_admin_all" ON public.class_payments;
CREATE POLICY "class_payments_admin_all"
  ON public.class_payments
  FOR ALL
  TO authenticated
  USING (public.is_active_admin())
  WITH CHECK (public.is_active_admin());

-- Tutors can read payments for classes they are assigned to
DROP POLICY IF EXISTS "class_payments_tutor_read" ON public.class_payments;
CREATE POLICY "class_payments_tutor_read"
  ON public.class_payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.classes c
      JOIN public.tutors t ON c.tutor_id = t.id
      WHERE c.id = class_payments.class_id
        AND t.profile_id = auth.uid()
    )
  );
