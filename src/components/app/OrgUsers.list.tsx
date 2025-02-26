import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { Loader } from "../loader";
import { useOrganizationUsers } from "@/hooks/useUsers";


interface OrgUsersListProps {
  orgId: string;
}

export function OrgUsers({ orgId }: OrgUsersListProps) {
  const { data: users, isLoading: propsLoading } = useOrganizationUsers({
    organizationId: orgId,
  })

  if (propsLoading) return <Loader />

  return (

    <div className="space-y-4" >
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Properties</h2>
        <Button>
          <Link to="/org/$orgId/userrole/add" params={{ orgId }}>
            Add user
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="font-medium">{user.id}</TableCell>
              <TableCell>{user.full_name}</TableCell>
              <TableCell>
                {user.email}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Link
                      to="/org/$orgId/$propertyId"
                      params={{
                        orgId: orgId,
                        propertyId: user.id,
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
  )
}