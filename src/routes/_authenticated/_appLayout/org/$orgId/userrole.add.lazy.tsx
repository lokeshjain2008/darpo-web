import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userRoleSchema, type UserRoleFormData } from '@/validators/user-role.schema';
import { useAssignUserRole } from '@/hooks/useUsers';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

export const Route = createLazyFileRoute('/_authenticated/_appLayout/org/$orgId/userrole/add')({
  component: AddUserRole,
});

function AddUserRole() {
  const { orgId } = Route.useParams();
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<UserRoleFormData>({
    resolver: zodResolver(userRoleSchema),
    defaultValues: {
      scope: 'organization',
      scope_id: orgId
    }
  });

  const { mutate: assignRole } = useAssignUserRole();

  const onSubmit = (data: UserRoleFormData) => {
    assignRole(data, {
      onSuccess: () => {
        navigate({ to: '/org/$orgId', params: { orgId } });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Assign User Role</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">User ID</label>
              <Input 
                {...register('user_id')} 
                disabled={isSubmitting}
                aria-invalid={errors.user_id ? 'true' : 'false'}
              />
              {errors.user_id && (
                <span className="text-sm text-red-500">{errors.user_id.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <Select {...register('organization_role')} disabled={isSubmitting}>
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
              </Select>
              {errors.organization_role && (
                <span className="text-sm text-red-500">{errors.organization_role.message}</span>
              )}
            </div>

            <div className="flex gap-4">
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Assigning...' : 'Assign Role'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate({ to: '/org/$orgId', params: { orgId } })}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
