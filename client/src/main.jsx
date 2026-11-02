import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AppContextProvider } from './context/AppContext.jsx'
import { ClerkProvider } from '@clerk/react'

const root = createRoot(document.getElementById('root'))
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!clerkPublishableKey) {
  console.error('Missing VITE_CLERK_PUBLISHABLE_KEY. Add your Clerk publishable key to client/.env.')
  root.render(
    <main className="flex min-h-screen items-center justify-center bg-[#030706] px-6 text-center text-white">
      <div role="alert" className="max-w-lg space-y-3">
        <h1 className="text-xl font-bold text-[#a3e635]">Clerk authentication is not configured</h1>
        <p className="text-sm text-gray-300">
          Add VITE_CLERK_PUBLISHABLE_KEY to client/.env using the publishable key from your Clerk dashboard, then restart the client.
        </p>
      </div>
    </main>,
  )
} else {
  root.render(
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <AppContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </AppContextProvider>
    </ClerkProvider>,
  )
}
