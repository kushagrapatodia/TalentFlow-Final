import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ensureSeedData } from './data/seed'

async function enableMocking() {
  const { worker } = await import('./mocks/browser');
  // Start without blocking initial render
  worker.start({ onUnhandledRequest: 'bypass' });
}

// Fire-and-forget; don't block first paint
void enableMocking();
void ensureSeedData();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
