import type { Database } from '@/api/types';

export type AppRoleType = Database['public']['Enums']['app_role_type'];
export type OrganizationRoleType = Database['public']['Enums']['organization_role_type'];
export type PropertyRoleType = Database['public']['Enums']['property_role_type'];
export type RoleScopeType = Database['public']['Enums']['role_scope_type'];
export type RoomTypes = Database['public']['Enums']['room_types'];

export const ORG_ROLES: OrganizationRoleType[] = ['owner', 'admin', 'manager'];
export const APP_ROLES: AppRoleType[] = ['god', 'admin', 'support'];
export const PROPERTY_ROLES: PropertyRoleType[] = ['manager', 'desk', 'reader'];
export const ROLE_SCOPES: RoleScopeType[] = ['app', 'organization', 'property'];
export const ROOM_TYPES: RoomTypes[] = ['single_bed_room', 'double_ded_room', 'kitchen', 'luxury', 'room', 'suite', "gym", "multi_purpose"];