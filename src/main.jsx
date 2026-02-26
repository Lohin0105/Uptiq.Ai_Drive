import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from './components/Toast'
import { UserProvider } from './components/UserContext'
import { ThemeProvider } from './components/ThemeContext'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider>
                <UserProvider>
                    <ToastProvider>
                        <App />
                    </ToastProvider>
                </UserProvider>
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>,
)
