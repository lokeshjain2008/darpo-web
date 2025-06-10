import React from 'react';
import { useRooms, useCreateRoom, useDeleteRoom } from '@/hooks/useRooms';
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
import { RoomFormData } from '@/validators/room.schema';
import { RoomForm } from './RoomForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface RoomsListProps {
  propertyId: string;
}

export const RoomsList: React.FC<RoomsListProps> = ({ propertyId }) => {
  const { data: rooms, isLoading } = useRooms(propertyId);
  const { mutate: createRoom, isPending } = useCreateRoom();
  const { mutate: deleteRoom } = useDeleteRoom();
  const [isOpen, setIsOpen] = React.useState(false);

  const handleCreateRoom = (data: RoomFormData) => {
    createRoom(data, {
      onSuccess: () => setIsOpen(false)
    });
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rooms</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add Room</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>
            <RoomForm
              propertyId={propertyId}
              onSubmit={handleCreateRoom}
              isSubmitting={isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Floor</TableHead>
            <TableHead>Max Allowed</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rooms?.map(room => (
            <TableRow key={room.id}>
              <TableCell>{room.name}</TableCell>
              <TableCell>{room.type}</TableCell>
              <TableCell>{room.floor}</TableCell>
              <TableCell>{room.max_allowed}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="outline" size="sm" className="bg-red-500" onClick={()=>deleteRoom(room.id)}>Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
