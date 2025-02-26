import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getRooms, 
  getRoom, 
  createRoom, 
  updateRoom, 
  deleteRoom 
} from '@/api/rooms';
import type { RoomInsert, RoomUpdate } from '@/types/rooms';

export const useRooms = (propertyId: string) => {
  return useQuery({
    queryKey: ['rooms', propertyId],
    queryFn: () => getRooms(propertyId)
  });
};

export const useRoom = (id: string) => {
  return useQuery({
    queryKey: ['rooms', id],
    queryFn: () => getRoom(id)
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: RoomInsert) => createRoom(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['rooms', variables.property_id] 
      });
    }
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: RoomUpdate }) => 
      updateRoom(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['rooms', variables.id] 
      });
    }
  });
};

export const useDeleteRoom = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: deleteRoom,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: ['rooms'] 
      });
    }
  });
};