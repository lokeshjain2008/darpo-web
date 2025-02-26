import { z } from 'zod';
import type { RoomInsert } from '@/types/rooms';
import type { Database } from '@/api/types';

type RoomTypes = Database['public']['Enums']['room_types'];

export const roomSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),
  type: z.enum([
    'single_bed_room',
    'double_ded_room',
    'luxury',
    'suite',
    'room',
    'kitchen',
    'gym',
    'multi_purpose'
  ] as const satisfies readonly RoomTypes[]),
  floor: z.number().min(0).optional().nullable(),
  max_allowed: z.number().min(0).optional().nullable(),
  property_id: z.string().uuid()
}) satisfies z.ZodType<Partial<RoomInsert>>;

export type RoomFormData = z.infer<typeof roomSchema>;