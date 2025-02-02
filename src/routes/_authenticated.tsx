import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'


export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ context }) => {
    const { isAuthenticated } = context.authentication
    if (!isAuthenticated()) {
      console.log('Not authenticated')
      throw redirect({ to: '/login' })
    }
  },
  
  // component: RouteComponent, // No component required for this route
})
