import { supabase } from './supabaseClient';
import { userRoleSchema } from '@/schemas/user-role.schema';
import type { Profile, UserRole, UserRoleInsert, UserWithRole } from '@/types/users';

// Get users by organization
export const getUsersByOrganization = async (organizationId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      user_roles!inner(*)
    `)
    .eq('user_roles.scope', 'organization')
    .eq('user_roles.scope_id', organizationId);

  if (error) throw error;
  return data as UserWithRole[];
};

// Get users by property
export const getUsersByProperty = async (propertyId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      user_roles!inner(*)
    `)
    .eq('user_roles.scope', 'property') // cab be removed as the propertyId is unique
    .eq('user_roles.scope_id', propertyId);

  if (error) throw error;
  return data as UserWithRole[];
};

// Get users by properties
export const getUsersByProperties = async (propertyIds: string[]) => {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      user_roles!inner(*)
    `)
    .in('user_roles.scope_id', propertyIds);

  if (error) throw error;
  return data as UserWithRole[];
};


// Assign role to user
export const assignUserRole = async (data: UserRoleInsert) => {
  const validated = userRoleSchema.parse(data);
  const { data: role, error } = await supabase
    .from('user_roles')
    .insert(validated)
    .select()
    .single();

  if (error) throw error;
  return role as UserRole;
};

// Update user role
export const updateUserRole = async (userId: string, scopeId: string, data: UserRoleInsert) => {
  const validated = userRoleSchema.parse(data);
  const { data: role, error } = await supabase
    .from('user_roles')
    .update(validated)
    .eq('user_id', userId)
    .eq('scope_id', scopeId)
    .select()
    .single();

  if (error) throw error;
  return role as UserRole;
};

// Remove user role
export const removeUserRole = async (userId: string, scopeId: string) => {
  const { error } = await supabase
    .from('user_roles')
    .delete()
    .eq('user_id', userId)
    .eq('scope_id', scopeId);

  if (error) throw error;
};