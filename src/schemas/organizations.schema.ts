import { z } from 'zod';
import type { OrganizationInsert } from '@/types/organizations';

export const organizationSchema = z.object({
  name: z.string()
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),
  description: z.string().optional(),
}) satisfies z.ZodType<Partial<OrganizationInsert>>;

export type OrganizationFormData = z.infer<typeof organizationSchema>;