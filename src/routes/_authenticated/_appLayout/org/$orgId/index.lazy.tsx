import { createLazyFileRoute, Link } from '@tanstack/react-router'
import { useOrganization } from '@/hooks/useOrganizations'
import { useProperties } from '@/hooks/useProperties'
import { Button } from '@/components/ui/button'
import { Loader } from '@/components/loader'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const Route = createLazyFileRoute(
  '/_authenticated/_appLayout/org/$orgId/',
)({
  component: OrganizationDetails,
})

function OrganizationDetails() {
  const { orgId } = Route.useParams()
  const { data: organization, isLoading: orgLoading } = useOrganization(orgId)
  const { data: properties, isLoading: propsLoading } = useProperties({
    organizationId: orgId,
  })

  if (orgLoading || propsLoading) return <Loader />

  return (
    <div className="space-y-6 p-6">
      {/* Organization Details Card */}
      <Card>
        <CardHeader>
          <CardTitle>{organization?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{organization?.description}</p>
          <div className="mt-4 text-sm text-muted-foreground">
            <p>
              Created: {new Date(organization?.created_at as string)?.toLocaleDateString()}
            </p>
            <p>
              Last Updated:{' '}
              {new Date(organization?.updated_at as string).toLocaleDateString()}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Properties Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Properties</h2>
          <Button>
            <Link to="/org/$orgId/property/add" params={{ orgId }}>
              Add Property
            </Link>
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties?.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.name}</TableCell>
                <TableCell>{property.address}</TableCell>
                <TableCell>
                  {new Date(property.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Link
                        to="/org/$orgId/$propertyId"
                        params={{
                          orgId: orgId,
                          propertyId: property.id,
                        }}
                      >
                        View
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
