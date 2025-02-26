import { Link } from "@tanstack/react-router";
import { Button } from "../ui/button";
import {Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../ui/table";
import { useProperties } from "@/hooks/useProperties";
import { Loader } from "../loader";


interface PropertiesListProps {
  orgId: string;
}

export function PropertiesList({ orgId }: PropertiesListProps) {
  const { data: properties, isLoading: propsLoading } = useProperties({
    organizationId: orgId,
  })

  if (propsLoading) return <Loader />

  return (

    <div className="space-y-4" >
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
  )
}