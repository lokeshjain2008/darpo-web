# Supabase Roles & Permissions: Current Architecture and Recommendations

## How Roles and Permissions Work

### 1. **Role and Permission Model**
- **Roles** are defined at three scopes: app, organization, and property.
- **Permissions** are actions (like 'view', 'edit', 'delete') on specific entity types (like 'room', 'booking').
- **Junction tables** (`permission_role`, `user_organization_role`, `user_app_role`) link users/roles/permissions at the appropriate scope.
- **Profiles** table is the user base, linked to roles via these junction tables.

### 2. **Role Hierarchy**
- There is a clear hierarchy for each scope (e.g., app: god > admin > support; org: owner > admin > manager; property: manager > desk > reader).
- Helper functions (e.g., `get_role_level`) and policies enforce that users can only grant roles below their own level.

### 3. **Permission Checks**
- The `has_permission` function checks if a user has a given permission for an action/entity, first at the app level, then at the organization level.
- RLS (Row Level Security) policies use this function to restrict access to data and actions.

### 4. **Role Assignment and Elevation**
- RLS policies and triggers prevent users from elevating their own roles or granting roles above their level.
- The `can_grant_role` function and related policies ensure only users with sufficient privilege can assign or update roles.

### 5. **API Usage**
- The API layer (e.g., `src/api/users.ts`) uses these tables and functions to assign, update, and remove roles, always validating input with Zod schemas.
- All role/permission changes are subject to RLS and function checks in the database.

---

## Suggestions for Improvement

### 1. **Centralize Permission Definitions**
- Consider maintaining a single source of truth for all permissions (e.g., a `permissions.ts` file or a DB seed) to avoid drift between code and DB.

### 2. **Permission Caching**
- For performance, consider caching permission checks in the app layer for read-heavy endpoints, but always enforce RLS in the DB.

### 3. **Audit Logging**
- Add audit tables/triggers to log all role/permission changes for traceability and security reviews.

### 4. **Granular Property Permissions**
- If property-level permissions become complex, consider a more granular permission model (e.g., per-room or per-resource).

### 5. **UI/UX for Role Management**
- Build admin UI components that visualize the role hierarchy and make it easy to see who can grant what.

### 6. **Automated Tests for RLS**
- Add integration tests that verify RLS policies and permission boundaries, especially for edge cases (e.g., attempted privilege escalation).

### 7. **Documentation & Onboarding**
- Keep this document up to date as roles/permissions evolve, and add onboarding notes for new devs.

---

*This document summarizes the current roles and permissions system in Supabase, and provides actionable suggestions for future improvements. For schema and function details, see the migrations and referenced SQL in the codebase.*
