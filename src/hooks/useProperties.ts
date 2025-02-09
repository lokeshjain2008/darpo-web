import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getProperties, 
  getProperty, 
  createProperty, 
  updateProperty, 
  deleteProperty 
} from '@/api/properties';
import type { PropertyInsert, PropertyUpdate } from '@/types/properties';

export const useProperties = ({ organizationId }: { organizationId: string }) => {
  return useQuery({
    queryKey: ['properties', organizationId],
    queryFn: () => getProperties(organizationId)
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['properties', id],
    queryFn: () => getProperty(id)
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: PropertyInsert) => createProperty(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['properties', variables.organization_id] 
      });
    }
  });
};

export const useUpdateProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PropertyUpdate }) => 
      updateProperty(id, data),
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onSuccess: (_, _variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['properties'] 
      });
    }
  });
};

export const useDeleteProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['properties'] 
      });
    }
  });
};