import React from 'react';
import { useAssignUserRole, usePropertyUsers } from '@/hooks/useUsers';
import { Loader } from '@/components/loader';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserRoleFormData } from '@/validators/user-role.schema';
import { PropertyUserRoleForm } from './PropertyUserRoleForm';

interface PropertyUsersProps {
  propertyId: string;
}

export const PropertyUsers: React.FC<PropertyUsersProps> = ({ propertyId }) => {
  const { data: users, isLoading } = usePropertyUsers({propertyId});
  const { mutate: assignRole, isPending } = useAssignUserRole();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleAssignRole = (data: UserRoleFormData) => {
    assignRole(data, {
      onSuccess: () => setIsOpen(false)
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Property Users</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign User Role</DialogTitle>
            </DialogHeader>
            <PropertyUserRoleForm
              propertyId={propertyId}
              onSubmit={handleAssignRole}
              isSubmitting={isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Floor</TableHead>
            <TableHead>Max Allowed</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map(user => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.full_name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.profile_pic}</TableCell>
              <TableCell>{user.created_at}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm">Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
