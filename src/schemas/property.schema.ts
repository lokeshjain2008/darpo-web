import { z } from 'zod';
import type { PropertyInsert } from '@/types/properties';

export const propertySchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),
  address: z.string().optional(),
  description: z.string().optional(),
  organization_id: z.string().uuid()
}) satisfies z.ZodType<Partial<PropertyInsert>>;

export type PropertyFormData = z.infer<typeof propertySchema>;