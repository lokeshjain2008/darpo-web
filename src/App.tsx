import React from 'react';
import { Router } from '@tanstack/react-router';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import routes from './router';
// Create a client
const queryClient = new QueryClient()

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router routes={routes} />
    </QueryClientProvider>
  );
};

export default App;



