
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import './components/marketplace/marketplace-styles.css'
import './components/marketplace-styles.css'
import { ClerkProvider } from '@clerk/clerk-react'

// Use a default publishable key for development
// In production, you would use an environment variable
const PUBLISHABLE_KEY = "pk_test_your-clerk-publishable-key";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>,
)
