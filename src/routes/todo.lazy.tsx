import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button';

export const Route = createLazyFileRoute('/todo')({
  component: RouteComponent,
})

const queryClient = new QueryClient();

function RouteComponent() {

  return (
    <QueryClientProvider client={queryClient}>
      <TodoComponent />
    </QueryClientProvider>
  )
}


// create mock data
const getTodos = async () => {
  return [
    { id: 1, title: 'Buy Milk' },
    { id: 2, title: 'Buy Eggs' },
  ]
}

const postTodo = async (todo) => {
  // Post to API
}


function TodoComponent() {
  // Access the client
  const queryClient = useQueryClient()

  // Queries
  const query = useQuery({ queryKey: ['todos'], queryFn: getTodos })

  // Mutations
  const mutation = useMutation({
    mutationFn: postTodo,
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['todos'] })
    },
  })

  return (
    <div>
      <ul>{query.data?.map((todo) => <li key={todo.id}>{todo.title}</li>)}</ul>

      <Button
        onClick={() => {
          mutation.mutate({
            id: Date.now(),
            title: 'Do Laundry',
          })
        }}
      >
        Add Todo
      </Button>
    </div>
  )
}