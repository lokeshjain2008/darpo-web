import { supabase } from './supabaseClient';
import { roomSchema } from '@/schemas/room.schema';
import type { Room, RoomInsert, RoomUpdate } from '@/types/rooms';

export const getRooms = async (propertyId: string) => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('property_id', propertyId)
    .order('name');

  if (error) throw error;
  return data as Room[];
};

export const getRoom = async (id: string) => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Room;
};

export const createRoom = async (data: RoomInsert) => {
  const validated = roomSchema.parse(data);
  const { data: room, error } = await supabase
    .from('rooms')
    .insert(validated)
    .select()
    .single();

  if (error) throw error;
  return room as Room;
};

export const updateRoom = async (id: string, data: RoomUpdate) => {
  const validated = roomSchema.partial().parse(data);
  const { data: room, error } = await supabase
    .from('rooms')
    .update(validated)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return room as Room;
};

export const deleteRoom = async (id: string) => {
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', id);

  if (error) throw error;
};