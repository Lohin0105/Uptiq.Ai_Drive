import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Users, Kanban, Bot, Settings, Zap, LogOut } from 'lucide-react'
import { useUser } from './UserContext'

const navLinks = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/contacts', icon: Users, label: 'Contacts', badge: '248' },
    { to: '/deals', icon: Kanban, label: 'Deals Pipeline' },
    { to: '/ai-assistant', icon: Bot, label: 'AI Assistant', badge: 'NEW' },
    { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ onLogout }) {
    const { user, initials } = useUser()

    return (
        <aside className="sidebar">
            <div className="sidebar-logo">
                <div className="sidebar-logo-icon">
                    <Zap />
                </div>
                <span className="sidebar-logo-text">NexusCRM</span>
            </div>

            <nav className="sidebar-nav">
                <div className="sidebar-section-title">Main Menu</div>
                {navLinks.map(({ to, icon: Icon, label, badge }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <Icon />
                        <span>{label}</span>
                        {badge && <span className="sidebar-badge">{badge}</span>}
                    </NavLink>
                ))}
            </nav>

            <div className="sidebar-user">
                {user.avatar ? (
                    <img src={user.avatar} alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                ) : (
                    <div className="sidebar-avatar">{initials}</div>
                )}
                <div className="sidebar-user-info">
                    <div className="sidebar-user-name">{user.firstName} {user.lastName}</div>
                    <div className="sidebar-user-role">{user.role}</div>
                </div>
                {onLogout && (
                    <button
                        className="sidebar-logout-btn"
                        onClick={onLogout}
                        title="Log out"
                    >
                        <LogOut size={16} />
                    </button>
                )}
            </div>
        </aside>
    )
}
