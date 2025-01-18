import { createBrowserRouter } from '@tanstack/react-router';
import ExamplePage from './components/ExamplePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ExamplePage />,
  },
]);

export default router;