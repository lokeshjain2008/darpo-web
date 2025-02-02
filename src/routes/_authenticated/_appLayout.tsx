import { AppLayout } from '@/components/appLayout'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/_appLayout')({
  component: RouteComponent,
})

function RouteComponent() {
  return <AppLayout>
    <Outlet />
  </AppLayout>
}
