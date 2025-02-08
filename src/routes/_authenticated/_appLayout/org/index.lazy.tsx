import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/_authenticated/_appLayout/org/')({
  component: OrganizationsIndex,
})



function OrganizationsIndex() {
  const { data: organizations, isLoading, error } = useQuery({
    queryKey: ['organizations'],
    queryFn: fetchOrganizations // Assume fetchOrganizations is defined elsewhere
  });

  const navigate = Route.useNavigate();

  const handleView = (id: string) => {
    navigate({ to: `/organizations/${id}` });
  };

  const handleDelete = (id: string) => {
    // Assume deleteOrganization is defined elsewhere
    deleteOrganization(id).then(() => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
    });
  };

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading organizations</div>;

  return (
    <div className="p-2">
      <h3>Organizations</h3>
      <Input type="text" placeholder="Search by name" onChange={handleSearch} />
      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map(org => (
            <tr key={org.id}>
              <td>{org.name}</td>
              <td>
                <Button onClick={() => handleView(org.id)}>View</Button>
                <Button onClick={() => handleDelete(org.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

function handleSearch(event) {
  // Implement search functionality
}
