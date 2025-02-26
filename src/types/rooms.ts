import { Database } from '@/api/types';

export type Room = Database['public']['Tables']['rooms']['Row'];
export type RoomInsert = Database['public']['Tables']['rooms']['Insert'];
export type RoomUpdate = Database['public']['Tables']['rooms']['Update'];
export type RoomType = Database['public']['Enums']['room_types'];