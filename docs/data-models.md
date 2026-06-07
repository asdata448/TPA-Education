# Data Models

No active application data models, ORM schemas, SQL migrations, or server-side entities were found in the scanned web app implementation.

## Static Content Structures

The closest thing to a domain model is `lib/data.ts`, which holds:

- tutor records
- subject definitions
- FAQ entries
- consultation process steps
- commitment cards

## Gap

Environment configuration references Supabase/Postgres, but the current application code does not expose a live persistence layer.
