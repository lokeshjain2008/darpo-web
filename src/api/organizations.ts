import { supabase } from '../db/supabaseClient';
import type { Organization, OrganizationInsert, OrganizationUpdate } from '@/types/organizations';
import { organizationSchema } from '@/validators/organization.schema';

export const getOrganizations = async () => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*');
  
  if (error) throw error;
  return data as Organization[];
};

export const getOrganization = async (id: string) => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data as Organization;
};

export const createOrganization = async (data: OrganizationInsert) => {
  const validated = organizationSchema.parse(data);
  const { data: organization, error } = await supabase
    .from('organizations')
    .insert(validated)
    .select()
    .single();

  if (error) throw error;
  return organization as Organization;
};

export const updateOrganization = async (id: string, data: OrganizationUpdate) => {
  const validated = organizationSchema.partial().parse(data);
  const { data: organization, error } = await supabase
    .from('organizations')
    .update(validated)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return organization as Organization;
};

export const deleteOrganization = async (id: string) => {
  const { error } = await supabase
    .from('organizations')
    .delete()
    .eq('id', id);

  if (error) throw error;
};