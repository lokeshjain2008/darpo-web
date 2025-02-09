import { Loader } from '@/components/loader';
import { useDeleteOrganization, useOrganizations } from '@/hooks/useOrganizations';
import { createLazyFileRoute, Link } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import { useState } from 'react';


export const Route = createLazyFileRoute('/_authenticated/_appLayout/org/')({
  component: OrganizationsIndex,
})



function OrganizationsIndex() {
  
  const { data: organizations, isLoading, error } = useOrganizations();
  const { mutate: deleteOrg } = useDeleteOrganization();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteOrg(id, {
      onSettled: () => {
        setDeletingId(null);
      },
    });
  };
  
  if (isLoading) return <Loader />;
  if (error) return <div>Error loading organizations</div>;

  return (
    <div className="p-2">
      <h3>Organizations</h3>
      <div>
        <Button>
          <Link to="/org/add">Add Organization</Link>
        </Button>
      </div>
      <input type="text" placeholder="Search by name" onChange={handleSearch} />
      <Table>
      <TableCaption>A list of your recent invoices.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Name</TableHead>
          <TableHead>Created at</TableHead>
          <TableHead>Updates at</TableHead>
          <TableHead className="text-right">Description</TableHead>
          <TableHead >Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {organizations?.map((org) => (
          <TableRow key={org.id}>
            <TableCell className="font-medium">{org.name}</TableCell>
            <TableCell>{org.created_at}</TableCell>
            <TableCell>{org.updated_at}</TableCell>
            <TableCell className="text-right">{org.description}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button>
                  <Link to="/org/$orgId" params={{orgId: org.id}}>View</Link>
                </Button>
                <Button className='bg-red-600 hover:bg-red-400' disabled={org.id == deletingId} onClick={() => handleDelete(org.id)}>Delete</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    </div>
  );
}

function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {   
  console.log('searching for', event.target.value);
  // Implement search functionality
}
