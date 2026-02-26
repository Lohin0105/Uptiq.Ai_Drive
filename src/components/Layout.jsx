import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

export default function Layout({ onLogout }) {
    return (
        <div className="app-layout">
            <Sidebar onLogout={onLogout} />
            <div className="main-wrapper">
                <Topbar />
                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
