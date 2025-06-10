import { z } from 'zod';
import type { UserRoleInsert } from '@/types/users';
// import type { Database } from '@/api/types';

// type RoleScopeType = Database['public']['Enums']['role_scope_type'];
// type AppRoleType = Database['public']['Enums']['app_role_type'];
// type OrgRoleType = Database['public']['Enums']['organization_role_type'];
// type PropRoleType = Database['public']['Enums']['property_role_type'];

export const userRoleSchema = z.object({
  user_id: z.string().uuid(),
  scope: z.enum(['app', 'organization', 'property'] as const),
  scope_id: z.string().uuid().optional().nullable(),
  app_role: z.enum(['god', 'admin', 'support'] as const).optional().nullable(),
  organization_role: z.enum(['owner', 'admin', 'manager'] as const).optional().nullable(),
  property_role: z.enum(['manager', 'desk', 'reader'] as const).optional().nullable(),
}).refine(
  (data) => {
    // Validate role matches scope
    if (data.scope === 'app' && !data.app_role) return false;
    if (data.scope === 'organization' && !data.organization_role) return false;
    if (data.scope === 'property' && !data.property_role) return false;
    
    // Validate scope_id presence
    if (data.scope !== 'app' && !data.scope_id) return false;
    if (data.scope === 'app' && data.scope_id) return false;
    
    return true;
  },
  { message: "Invalid role configuration" }
) satisfies z.ZodType<Partial<UserRoleInsert>>;

export type UserRoleFormData = z.infer<typeof userRoleSchema>;