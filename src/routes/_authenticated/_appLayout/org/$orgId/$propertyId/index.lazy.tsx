import { Loader } from '@/components/loader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useProperty } from '@/hooks/useProperties';
import { createLazyFileRoute } from '@tanstack/react-router'
import { RoomsList } from '@/components/app/RoomsList';
import { PropertyUsers } from '@/components/app/PropertyUsers.list';

export const Route = createLazyFileRoute(
  '/_authenticated/_appLayout/org/$orgId/$propertyId/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const { orgId, propertyId } = Route.useParams();
  const { data: property, isLoading: propLoading } = useProperty(propertyId)

  if (propLoading) return <Loader />

  return <div>

      Property Detail:
      <Card>
        <CardHeader>
          <CardTitle>{property?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{property?.description}</p>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              Created: {new Date(property?.created_at as string)?.toLocaleDateString()}
            </p>
            <p>
              Last Updated:{' '}
              {new Date(property?.updated_at as string).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* --- Add tabs to add the rooms and users on the property level */}

      <Tabs defaultValue="rooms">
        <TabsList>
          <TabsTrigger value="rooms">Rooms</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="rooms">
          <RoomsList propertyId={propertyId} />
        </TabsContent>
        <TabsContent value="users">
          <PropertyUsers propertyId={propertyId} />
        </TabsContent>
      </Tabs>

  </div>
}
