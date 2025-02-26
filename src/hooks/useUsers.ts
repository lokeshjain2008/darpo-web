import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getUsersByOrganization, 
  getUsersByProperty,
  assignUserRole,
  updateUserRole,
  removeUserRole 
} from '@/api/users';
import type { UserRoleInsert } from '@/types/users';

export const useOrganizationUsers = ({ organizationId }: { organizationId: string }) => {
  return useQuery({
    queryKey: ['users', 'organization', organizationId],
    queryFn: () => getUsersByOrganization(organizationId)
  });
};

export const usePropertyUsers = ({propertyId}:{propertyId: string}) => {
  return useQuery({
    queryKey: ['users', 'property', propertyId],
    queryFn: () => getUsersByProperty(propertyId)
  });
};

export const useAssignUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: UserRoleInsert) => assignUserRole(data),
    onSuccess: (_, variables) => {
      // Invalidate relevant queries based on scope
      if (variables.scope === 'organization') {
        queryClient.invalidateQueries({ 
          queryKey: ['users', 'organization', variables.scope_id] 
        });
      } else if (variables.scope === 'property') {
        queryClient.invalidateQueries({ 
          queryKey: ['users', 'property', variables.scope_id] 
        });
      }
    }
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, scopeId, data }: { 
      userId: string; 
      scopeId: string; 
      data: UserRoleInsert 
    }) => updateUserRole(userId, scopeId, data),
    onSuccess: (_, variables) => {
      if (variables.data.scope === 'organization') {
        queryClient.invalidateQueries({ 
          queryKey: ['users', 'organization', variables.scopeId] 
        });
      } else if (variables.data.scope === 'property') {
        queryClient.invalidateQueries({ 
          queryKey: ['users', 'property', variables.scopeId] 
        });
      }
    }
  });
};

export const useRemoveUserRole = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ userId, scopeId }: { userId: string; scopeId: string }) => 
      removeUserRole(userId, scopeId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['users', 'organization', variables.scopeId] 
      });
      queryClient.invalidateQueries({ 
        queryKey: ['users', 'property', variables.scopeId] 
      });
    }
  });
};