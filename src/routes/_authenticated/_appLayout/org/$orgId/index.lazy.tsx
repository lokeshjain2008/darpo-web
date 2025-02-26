import { createLazyFileRoute } from '@tanstack/react-router'
import { useOrganization } from '@/hooks/useOrganizations'

import { Loader } from '@/components/loader'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PropertiesList } from '@/components/app/Properties.list'
import { OrgUsers } from '@/components/app/OrgUsers.list'

export const Route = createLazyFileRoute(
  '/_authenticated/_appLayout/org/$orgId/',
)({
  component: OrganizationDetails,
})

function OrganizationDetails() {
  const { orgId } = Route.useParams()
  const { data: organization, isLoading: orgLoading } = useOrganization(orgId)

  if (orgLoading) return <Loader />

  return (
    <div className="space-y-6 p-6">
      Organization Detail:
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

      <Tabs defaultValue="properties">
        <TabsList>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="password">Users</TabsTrigger>
        </TabsList>
        <TabsContent value="properties">
          <PropertiesList orgId={orgId} />
        </TabsContent>
        <TabsContent value="password">
          <OrgUsers orgId={orgId} />
        </TabsContent>
      </Tabs>

    </div>
  )
}
