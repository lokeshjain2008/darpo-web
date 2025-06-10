import { createLazyFileRoute } from '@tanstack/react-router'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { organizationSchema, type OrganizationFormData } from '@/validators/organization.schema';
import { useCreateOrganization } from '@/hooks/useOrganizations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/_authenticated/_appLayout/org/add')({
  component: AddOrganization,
})


export default function AddOrganization() {
  const navigate = useNavigate();
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema)
  });

  const { mutate: createOrg } = useCreateOrganization();

  const onSubmit = (data: OrganizationFormData) => {
    createOrg(data, {
      onSuccess: () => {
        navigate({ to: '/org' });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Add Organization</h1>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <Input 
            {...register('name')} 
            disabled={isSubmitting}
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {errors.name && (
            <span className="text-sm text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <Textarea
            {...register('description')}
            disabled={isSubmitting}
            rows={4}
          />
          {errors.description && (
            <span className="text-sm text-red-500">
              {errors.description.message}
            </span>
          )}
        </div>

        <div className="flex gap-4">
          <Button 
            type="submit" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Organization'}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate({ to: '/org' })}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}