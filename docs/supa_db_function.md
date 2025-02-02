## Plan for Using switch_organization Function
* Enable RPC (Remote Procedure Call)
* Create TypeScript helper
* Add security policy
* Example usage

```sql
-- Enable RPC access to the function
grant execute on function public.switch_organization(uuid) to authenticated;
grant execute on function public.get_current_organization() to authenticated;
```
Create api for the calling rpc 

```typescript

import { supabase } from './supabaseClient';

export const switchOrganization = async (orgId: string) => {
  const { data, error } = await supabase
    .rpc('switch_organization', { org_id: orgId });
  
  if (error) throw error;
  return data;
};

export const getCurrentOrganization = async () => {
  const { data, error } = await supabase
    .rpc('get_current_organization');
  
  if (error) throw error;
  return data;
};
```

Create hook to use in the components

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { switchOrganization, getCurrentOrganization } from '@/api/organization';

export const useOrganization = () => {
  const queryClient = useQueryClient();

  const { data: currentOrg } = useQuery({
    queryKey: ['currentOrganization'],
    queryFn: getCurrentOrganization
  });

  const { mutate: switchOrg } = useMutation({
    mutationFn: switchOrganization,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentOrganization'] });
    }
  });

  return { currentOrg, switchOrg };
};

```