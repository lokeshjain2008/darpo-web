import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

import './index.css'
import { queryClient } from './lib/queryClient'
import { QueryClientProvider } from '@tanstack/react-query'
import { useAuth } from './hooks/useAuth'


// Create a new router instance with context to handle authentication hook to be present in the 
// route helper functions
const router = createRouter({
  routeTree,
  context: { authentication: undefined! },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const App: React.FC = () => {
  const authentication = useAuth();
  return (
    <QueryClientProvider client={queryClient}>
    <RouterProvider router={router} context={{ authentication }}/>
  </QueryClientProvider>
  );
};

export default App;



