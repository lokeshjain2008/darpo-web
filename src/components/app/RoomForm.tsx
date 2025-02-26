import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roomSchema, type RoomFormData } from '@/schemas/room.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RoomType } from '@/types/rooms';
import { ROOM_TYPES } from '@/types/db_enums';



interface RoomFormProps {
  propertyId: string;
  onSubmit: (data: RoomFormData) => void;
  isSubmitting?: boolean;
  defaultValues?: Partial<RoomFormData>;
}

export function RoomForm({ 
  propertyId, 
  onSubmit, 
  isSubmitting,
  defaultValues 
}: RoomFormProps) {
  const { 
    register, 
    handleSubmit,
    setValue, 
    formState: { errors } 
  } = useForm<RoomFormData>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      property_id: propertyId,
      ...defaultValues
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <Input 
          {...register('name')} 
          disabled={isSubmitting}
        />
        {errors.name && (
          <span className="text-sm text-red-500">{errors.name.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <Select 
          onValueChange={(value) => setValue('type', value as RoomType)}
          defaultValue={defaultValues?.type}
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select room type" />
          </SelectTrigger>
          <SelectContent>
            {ROOM_TYPES.map(type => (
              <SelectItem key={type} value={type}>
                {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.type && (
          <span className="text-sm text-red-500">{errors.type.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Floor</label>
        <Input 
          type="number"
          {...register('floor', { valueAsNumber: true })} 
          disabled={isSubmitting}
        />
        {errors.floor && (
          <span className="text-sm text-red-500">{errors.floor.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Max Allowed</label>
        <Input 
          type="number"
          {...register('max_allowed', { valueAsNumber: true })} 
          disabled={isSubmitting}
        />
        {errors.max_allowed && (
          <span className="text-sm text-red-500">{errors.max_allowed.message}</span>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save Room'}
        </Button>
      </div>
    </form>
  );
}