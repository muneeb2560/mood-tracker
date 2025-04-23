import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import MoodTracker from './page.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MoodTracker />
  </StrictMode>,
)
