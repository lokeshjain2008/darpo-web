# Project Context for GitHub Copilot

## Project Overview
This project helps hotels and home stays manage room bookings and customer documents in digital format. The application enables hotel/home stay owners to efficiently manage bookings, customer documents, and related tasks. The goal is a user-friendly interface for both hotel owners and customers, with easy access to booking information and document management.

### Problem This Project Is Solving
- Manage customer/visitor documents digitally and retrieve them for government rules (store for 5 years as per regulations).
- Allow hotel owners to manage multiple properties.
- Role-based permissions for hotel staff (e.g., some can add/manage users, others can only book rooms and manage visitor documents).
- Once visitor documents and rooms are assigned, enable communication, booking management, and (eventually) account creation.

## Architecture
- **Backend:** Supabase (database, auth, authorization, storage, REST API via JS SDK, RLS for permissions)
  - RLS policies are used for authorization and role-based access.
  - Storage is used for document management (scalable, cost-effective approach).
- **Frontend:**
  1. Dashboard for internal team and hotel owners (property/user/permission management).
  2. Separate mobile app (see below).

## Mobile Project
- The mobile app (built with Expo React Native) is maintained in a **separate repository**.
- local location "../darpo-mobile"
- Some types, schemas, and API contracts may be duplicated for consistency, but there is no direct code sharing.
- If you update a shared type or schema, consider manually syncing the change to the mobile repo.
- See the mobile repo’s own copilot-instructions.md for mobile-specific conventions and architecture.

## Technology Stack
- **Web:**
  - React (Vite)
  - TanStack Router (file-based routing, `@tanstack/react-router`)
  - TanStack Query (`@tanstack/react-query`)
  - Zustand (state management)
  - shadcn/ui (UI components, built on Tailwind CSS)
  - Tailwind CSS (utility-first CSS)
  - Zod (schema validation)
  - React Hook Form (form state/validation)
  - Supabase JS SDK (`@supabase/supabase-js`)
  - TypeScript
- **Backend:** Supabase (Auth, Database, Storage, Functions, JS SDK)
- **Other Tools:**
  - ESLint, Prettier (linting/formatting)
  - Vercel (deployment)

## Folder Structure
```
/ (root)
  package.json           # Project dependencies and scripts
  tailwind.config.js     # Tailwind CSS config
  tsconfig.json          # TypeScript config
  vite.config.ts         # Vite config
  public/                # Static assets
  src/
    api/                # Supabase API functions and business logic
    components/         # UI and app components
    config/             # App and auth config
    hooks/              # Custom React hooks
    lib/                # Utilities, query client, router devtools
    routes/             # File-based routes (TanStack Router)
    validators/         # Zod schemas for validation
    db/                 # Supabase db schema and client
    store/              # Zustand stores
    types/              # TypeScript types
    App.tsx
    main.tsx
  docs/                  # Project documentation
  supabase/              # Supabase migrations, config, schema.sql
```

## Coding Conventions
- Use clear, descriptive names for files, functions, and variables.
- Prefer functional components and hooks for React code.
- Keep business logic in hooks or the `api/` layer, not in UI components.
- Use Zod for schema validation and React Hook Form for forms.
- Use TanStack Query for data fetching/caching and TanStack Router for routing.
- Use Zustand for state management.
- When duplicating types or schemas for mobile, keep naming and structure consistent for easier manual syncing.
- Use shadcn/ui for UI components and Tailwind CSS for styling.
- Use TypeScript throughout for type safety.
- Place all API functions in `src/api/` and use them via hooks/components.
- Use consistent error handling and naming for API functions.

## Database Schema
- Database schema TypeScript types are loaded from the Supabase dashboard using `yarn run s:types` or `supabase gen types typescript`.
- Schema file location: `db/schema.ts`.
- Database is remote hosted connected via supbaseClient for the fast development.
- These types are used in hooks and API code, and should be manually copied to the mobile repo if shared.

## API Structure
- Keep API functions in `src/api/` and use them via hooks/components.
- Use consistent naming and error handling for API functions.
- [Add more details about API endpoints and data flow as needed.]

## Common Patterns
- Use hooks for business logic and data fetching.
- Use shadcn/ui for UI components.
- Use Zod schemas for validation.
- Use context or Zustand for global state.
- [Document any other common patterns used in the codebase.]

## Testing Strategy
- Prefer unit tests for business logic and integration tests for API/data flows.
- [Add more details about testing tools and approach.]

## Deployment
- Use Vercel or similar for web deployment.
- [Add more details about your deployment process.]

## Additional Context
- The web and mobile projects are maintained separately. This file is for the web project only.
- If you add or change a shared type/schema, update the mobile repo as needed. location "../darpo-mobile"
- [Any other information that would help Copilot assist you better]