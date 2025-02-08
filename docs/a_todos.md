# About the project

This document outlines the requirements for a frontend dashboard application designed to manage users and resources(organizations and, properties, rooms, and visitor’s visits) based on a granular permission system. 
I am developing a hotel management web application with the following characteristics:

- Solo developer creating applications, web(vite reactjs app)
- Using supabse as the BE and databse, auth and storage in sort everthing BE is supabase.
- the hotel staff will have role based on the assigned roles. Where they add visitor’s ID card documents on supabase storage, for later retrieval and keep it for around 2 years for compliance purpose.
- Focus on developer experience using the latest tech
- Prioritizing simplicity over complexity
- Time to market and cost-effectiveness are crucial factorsbe well-structured, well-documented, and easy to maintain.


## Keep track of todos 
- [x] Add GAuth
- [x] Add authentication routes
- [x] Home Layout / Login layout 
- [x] Dashboard layout
- [ ] Create organisation CURD form
- [ ] Supabase RLS for organisation
- [ ] Full RLS
- [ ] Pull all the infra from SUPABASE


## context for the react app (darpo-web)
- @tanstack/query - query 
- supabasejs - database & BE
- z & react-hook-form - form and validation
- zustand - small state management
- shadcn-ui - tailwind based UI framework
- hooks - for interaction 
- @tansack/router - file based routing 


## next task

Create pages for the Orgnanization CURD operation.


1. Create Type Aliases for Better Readability

```ts

import { Database } from '@/api/types';

// Type aliases for common types
export type Organization = Database['public']['Tables']['organizations']['Row'];
export type Property = Database['public']['Tables']['properties']['Row'];
export type Room = Database['public']['Tables']['rooms']['Row'];

// For insert/update operations
export type OrganizationInsert = Database['public']['Tables']['organizations']['Insert'];
export type PropertyInsert = Database['public']['Tables']['properties']['Insert'];

```

1.5 Generate Zod Schema from Supabase Types

```ts

import { z } from 'zod';
import type { Database } from '@/api/types';

type OrganizationInsert = Database['public']['Tables']['organizations']['Insert'];

export const organizationSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
}) satisfies z.ZodType<Partial<OrganizationInsert>>;

// Type-safe form data type
export type OrganizationFormData = z.infer<typeof organizationSchema>;


```


2. Use Types in API Layer

```ts
import { supabase } from './supabaseClient';
import type { Organization, OrganizationInsert } from '@/types/database';

export const getOrganizations = async () => {
  const { data, error } = await supabase
    .from('organizations')
    .select('*');
  
  if (error) throw error;
  return data as Organization[];
};

// create org
import type { Database } from '@/api/types';
import { organizationSchema } from '@/schemas/organization';

type OrganizationRow = Database['public']['Tables']['organizations']['Row'];

export const createOrganization = async (data: OrganizationFormData) => {
  // Server-side validation as safety net
  const validated = organizationSchema.parse(data);
  const { data: organization, error } = await supabase
    .from('organizations')
    .insert(validated)
    .select()
    .single();

  if (error) throw error;
  return organization as OrganizationRow;
};


```

3. Use Types in Hooks

```ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { getOrganizations, createOrganization } from '@/api/organizations';
import type { OrganizationInsert } from '@/types/database';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrganizations, createOrganization } from '@/api/organizations';

export const useOrganizations = () => useQuery({
  queryKey: ['organizations'],
  queryFn: getOrganizations
});

export const useCreateOrganization = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] })
    }
  });
};


```

4. component exaple with the form validation

```ts

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { organizationSchema, type OrganizationFormData } from '@/schemas/organization';

export const OrganizationsList = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema)
  });
  
  const { mutate: createOrg, isPending } = useCreateOrganization();

  const onSubmit = (data: OrganizationFormData) => {
    createOrg(data, {
      onSuccess: () => reset()
    });
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2">
        <div>
          <Input {...register('name')} disabled={isPending} />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
        </div>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Creating...' : 'Create'}
        </Button>
      </form>
      {/* ...rest of the component */}
    </div>
  );
};

```

