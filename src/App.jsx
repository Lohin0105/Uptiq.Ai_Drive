import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Contacts from './pages/Contacts'
import Deals from './pages/Deals'
import AIAssistant from './pages/AIAssistant'
import Settings from './pages/Settings'
import LoginPage from './pages/LoginPage'

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false)

    const handleLogout = () => {
        setIsLoggedIn(false)
    }

    if (!isLoggedIn) {
        return <LoginPage onLogin={() => setIsLoggedIn(true)} />
    }

    return (
        <Routes>
            <Route element={<Layout onLogout={handleLogout} />}>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/deals" element={<Deals />} />
                <Route path="/ai-assistant" element={<AIAssistant />} />
                <Route path="/settings" element={<Settings />} />
            </Route>
        </Routes>
    )
}

export default App
