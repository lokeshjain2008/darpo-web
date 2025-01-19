import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/api/supabaseClient';
import { Database } from '@/api/types'; // Import the generated types

type TableName = keyof Database['public']['Tables'];
type TableRow<T extends TableName> = Database['public']['Tables'][T]['Row'];

export const useDatabase = <T extends TableName>(table: T) => {
  const queryClient = useQueryClient();

  const fetchData = async (filters: Partial<TableRow<T>> = {}) => {
    let query = supabase.from(table).select('*');
    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }
    const { data, error } = await query;
    if (error) throw error;
    return data;
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: [table],
    queryFn: () => fetchData(),
  });

  const create = useMutation({
    mutationFn: async (newData: Partial<TableRow<T>>) => {
      const { data, error } = await supabase.from(table).insert(newData);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
    },
  });

  const update = useMutation({
    mutationFn: async ({ id, newData }: { id: string; newData: Partial<TableRow<T>> }) => {
      const { data, error } = await supabase.from(table).update(newData).eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
    },
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [table] });
    },
  });

  return { data, error, isLoading, refetch, create, update, remove, fetchData };
};