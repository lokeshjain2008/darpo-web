import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userRoleSchema, type UserRoleFormData } from '@/validators/user-role.schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROPERTY_ROLES, PropertyRoleType } from '@/types/db_enums';



interface PropertyUserRoleFormProps {
  propertyId: string;
  onSubmit: (data: UserRoleFormData) => void;
  isSubmitting?: boolean;
}

export function PropertyUserRoleForm({ 
  propertyId, 
  onSubmit, 
  isSubmitting 
}: PropertyUserRoleFormProps) {
  const { 
    register, 
    handleSubmit,
    setValue, 
    formState: { errors } 
  } = useForm<UserRoleFormData>({
    resolver: zodResolver(userRoleSchema),
    defaultValues: {
      scope: 'property',
      scope_id: propertyId,
      property_role: 'reader'
    }
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">User ID</label>
        <Input 
          {...register('user_id')} 
          disabled={isSubmitting}
        />
        {errors.user_id && (
          <span className="text-sm text-red-500">{errors.user_id.message}</span>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Role</label>
        <Select 
          onValueChange={(value) => setValue('property_role', value as PropertyRoleType)}
          defaultValue="reader"
          disabled={isSubmitting}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role type" />
          </SelectTrigger>
          <SelectContent>
            {PROPERTY_ROLES.map(role => (
              <SelectItem key={role} value={role}>
                {role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.property_role && (
          <span className="text-sm text-red-500">{errors.property_role.message}</span>
        )}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Assigning...' : 'Assign Role'}
        </Button>
      </div>
    </form>
  );
}