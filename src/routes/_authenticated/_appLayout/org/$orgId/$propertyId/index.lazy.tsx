import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute(
  '/_authenticated/_appLayout/org/$orgId/$propertyId/',
)({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_authenticated/_appLayout/org/$orgId/$propertyId/"!</div>
}
