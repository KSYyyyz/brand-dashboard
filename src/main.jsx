import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { DateRangeProvider } from './context/DateRangeContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <DateRangeProvider>
      <App />
    </DateRangeProvider>
  </React.StrictMode>,
)
