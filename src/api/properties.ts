import { supabase } from '../db/supabaseClient';
import { propertySchema } from '@/validators/property.schema';
import type { Property, PropertyInsert, PropertyUpdate } from '@/types/properties';

export const getProperties = async (organizationId: string) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('organization_id', organizationId);

  if (error) throw error;
  return data as Property[];
};

export const getProperty = async (id: string) => {
  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Property;
};

export const createProperty = async (data: PropertyInsert) => {
  const validated = propertySchema.parse(data);
  const { data: property, error } = await supabase
    .from('properties')
    .insert(validated)
    .select()
    .single();

  if (error) throw error;
  return property as Property;
};

export const updateProperty = async (id: string, data: PropertyUpdate) => {
  const validated = propertySchema.partial().parse(data);
  const { data: property, error } = await supabase
    .from('properties')
    .update(validated)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return property as Property;
};

export const deleteProperty = async (id: string) => {
  const { error } = await supabase
    .from('properties')
    .delete()
    .eq('id', id);

  if (error) throw error;
};