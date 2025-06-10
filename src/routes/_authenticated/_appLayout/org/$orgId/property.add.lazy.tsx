import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { propertySchema, type PropertyFormData } from '@/validators/property.schema';
import { useCreateProperty } from '@/hooks/useProperties';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';

export const Route = createLazyFileRoute('/_authenticated/_appLayout/org/$orgId/property/add')({
  component: AddProperty,
});

function AddProperty() {
  const { orgId } = Route.useParams();
  const navigate = useNavigate();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      organization_id: orgId
    }
  });

  const { mutate: createProperty } = useCreateProperty();

  const onSubmit = (data: PropertyFormData) => {
    createProperty(data, {
      onSuccess: () => {
        navigate({ to: '/org/$orgId', params: { orgId } });
      }
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Add Property</CardTitle>
        </CardHeader>
        <CardContent>
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
              <label className="block text-sm font-medium mb-1">Address</label>
              <Input 
                {...register('address')} 
                disabled={isSubmitting}
              />
              {errors.address && (
                <span className="text-sm text-red-500">{errors.address.message}</span>
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
                {isSubmitting ? 'Creating...' : 'Create Property'}
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
