import { useAuth } from '@/hooks/useAuth';
import { createLazyFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react';

export const Route = createLazyFileRoute('/')({
  component: Index,
})

function Index() {

  const { isAuthenticated } = useAuth();
  const navigate = Route.useNavigate();

  // todo: add a loading spinner
  // todo: fetch the user data and roles assinged and navigate to the correct page

  useEffect(() => {
    if (isAuthenticated()) {
      navigate({ to: '/about' })
    } else {
      navigate({ to: '/login' })
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="p-2">
      <h3>Welcome Home!</h3>
    </div>
  )
}
