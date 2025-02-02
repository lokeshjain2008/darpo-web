import NotFound from '@/components/NotFound';
import type { AuthContext } from '@/hooks/useAuth';
import { TanStackRouterDevtools } from '@/lib/routerDevTools';
import { createRootRouteWithContext, Link, Outlet } from '@tanstack/react-router'
import { Suspense } from 'react';

type RouterContext = {
  authentication: AuthContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  notFoundComponent: NotFound,
  component: RootComponent,
})


function RootComponent(){
  // const { isAuthenticated } = Route.useRouteContext().authentication;
  return <>
  <div className="p-2 flex gap-2 hidden" >
    <Link to="/" className="[&.active]:font-bold">
      Home
    </Link>{' '}
    <Link to="/about" className="[&.active]:font-bold">
      About
    </Link>
    <Link to="/todo" className="[&.active]:font-bold">
      Todo List
    </Link>
  </div>
  <Outlet />
  <Suspense>
    <TanStackRouterDevtools position='bottom-right' />
  </Suspense>
</>


}