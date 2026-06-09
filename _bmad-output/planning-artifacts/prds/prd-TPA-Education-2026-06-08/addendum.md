# Addendum

## Deferred / Architecture-Relevant Notes
- Recommended stack discussed: Next.js on Vercel + Supabase for auth, database, storage, and role-based access.
- Recommended future enhancement: Zalo block parsing intake for Admin, deferred from MVP.
- Recommended future enhancement: automated report delivery to parents, deferred from MVP.
- Future possible domains: attendance, payroll, schedule change requests, lesson logs.

## Scope Update - 2026-06-08
- Open Class browsing/request flow added to MVP.
- Schedule Proposal workflow removed from MVP; Tutors self-coordinate schedule changes with parents outside the app.
- Teaching Material Library added to MVP.
- 5% monthly center fee excluded from app scope.
- Chatbot lesson-prep assistant deferred.

## Storage Decision Update - 2026-06-08
- Teaching Materials live in private Cloudflare R2.
- Web app stores and displays R2 object metadata/keys for Material Library only; Document Feedback stays in app DB as a lightweight workflow.
- R2 bucket remains private; app authorization and controlled download access remain required.
- Direct browser uploads/downloads via presigned URLs are optional later optimization; MVP may use server-mediated upload/download.
