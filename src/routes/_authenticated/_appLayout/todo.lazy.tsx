import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createLazyFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createLazyFileRoute('/_authenticated/_appLayout/todo')({
  component: RouteComponent,
})

function RouteComponent() {
  return <TodoComponent />
}

// create mock data
const getTodos = async () => {
  return [
    { id: 1, title: 'Buy Milk' },
    { id: 2, title: 'Buy Eggs' },
  ]
}

const postTodo = async (todo: string) => {
  // Post to API
  console.log(todo)
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
          mutation.mutate('New Todo')
        }}
      >
        Add Todo-Now
      </Button>
    </div>
  )
}
