import { useState, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Search, Bell, Plus, ChevronRight, X, User, Briefcase, Layout } from 'lucide-react'
import Modal from './Modal'
import { useToast } from './Toast'

const pageTitles = {
    '/dashboard': 'Dashboard',
    '/contacts': 'Contacts',
    '/deals': 'Deals Pipeline',
    '/ai-assistant': 'AI Assistant',
    '/settings': 'Settings',
}

const notifications = [
    { id: 1, text: '**Sarah Kim** closed a deal with Acme Corp worth **$24,000**', time: '5 min ago', unread: true },
    { id: 2, text: '**AI Insight:** 3 deals are stalling in your pipeline', time: '12 min ago', unread: true },
    { id: 3, text: 'New contact **Lisa Wang** from TechFlow was added', time: '1 hr ago', unread: true },
    { id: 4, text: '**Mike Johnson** moved ByteScale to Negotiation stage', time: '2 hrs ago', unread: false },
    { id: 5, text: 'Weekly revenue report is ready to view', time: '3 hrs ago', unread: false },
]

const searchableItems = [
    { type: 'Contact', name: 'Sarah Chen', detail: 'Acme Corp — VP Sales', link: '/contacts' },
    { type: 'Contact', name: 'James Mitchell', detail: 'TechFlow — CTO', link: '/contacts' },
    { type: 'Contact', name: 'Lisa Wang', detail: 'DataVault Inc — Head of Ops', link: '/contacts' },
    { type: 'Contact', name: 'Alex Rivera', detail: 'CloudNova — Founder', link: '/contacts' },
    { type: 'Contact', name: 'David Kim', detail: 'ByteScale — CEO', link: '/contacts' },
    { type: 'Contact', name: 'Emma Thompson', detail: 'NexGen Solutions — Director', link: '/contacts' },
    { type: 'Contact', name: 'Marcus Brown', detail: 'PulseHQ — VP Engineering', link: '/contacts' },
    { type: 'Contact', name: 'Priya Patel', detail: 'FlowState AI — Co-Founder', link: '/contacts' },
    { type: 'Deal', name: 'Enterprise License Renewal', detail: 'Acme Corp — $45,000', link: '/deals' },
    { type: 'Deal', name: 'SaaS Migration Deal', detail: 'TechFlow — $38,500', link: '/deals' },
    { type: 'Deal', name: 'Cloud Security Suite', detail: 'CloudNova — $31,000', link: '/deals' },
    { type: 'Deal', name: 'Dev Tools Bundle', detail: 'PulseHQ — $67,000', link: '/deals' },
    { type: 'Deal', name: 'Data Analytics Platform', detail: 'DataVault Inc — $42,000', link: '/deals' },
    { type: 'Deal', name: 'AI Platform Integration', detail: 'FlowState AI — $52,000', link: '/deals' },
    { type: 'Deal', name: 'Premium Support Contract', detail: 'Acme Corp — $28,000', link: '/deals' },
    { type: 'Deal', name: 'Annual Partnership', detail: 'TechFlow — $95,000', link: '/deals' },
    { type: 'Page', name: 'Dashboard', detail: 'Overview, charts & metrics', link: '/dashboard' },
    { type: 'Page', name: 'Contacts', detail: 'Manage customer relationships', link: '/contacts' },
    { type: 'Page', name: 'Deals Pipeline', detail: 'Kanban board of deals', link: '/deals' },
    { type: 'Page', name: 'AI Assistant', detail: 'Chat with CRM AI', link: '/ai-assistant' },
    { type: 'Page', name: 'Settings', detail: 'Preferences & configuration', link: '/settings' },
]

export default function Topbar() {
    const location = useLocation()
    const navigate = useNavigate()
    const addToast = useToast()
    const title = pageTitles[location.pathname] || 'Dashboard'
    const [showNotifications, setShowNotifications] = useState(false)
    const [showNewDealModal, setShowNewDealModal] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [showSearchResults, setShowSearchResults] = useState(false)

    const searchResults = searchQuery.length > 0
        ? searchableItems.filter(r =>
            r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.detail.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 8)
        : []

    const handleResultClick = (r) => {
        navigate(r.link)
        setSearchQuery('')
        setShowSearchResults(false)
        addToast('Navigated', `Opened ${r.name}`, 'info')
    }

    const typeColor = (type) => {
        if (type === 'Contact') return 'tag-enterprise'
        if (type === 'Deal') return 'tag-startup'
        return 'tag-partner'
    }

    const typeIcon = (type) => {
        if (type === 'Contact') return <User size={14} />
        if (type === 'Deal') return <Briefcase size={14} />
        return <Layout size={14} />
    }

    const handleNewDeal = (e) => {
        e.preventDefault()
        setShowNewDealModal(false)
        addToast('Deal Created', 'New deal has been added to your pipeline', 'success')
    }

    return (
        <>
            <header className="topbar">
                <div className="topbar-left">
                    <div>
                        <div className="topbar-page-title">{title}</div>
                        <div className="topbar-breadcrumb">
                            NexusCRM <ChevronRight size={12} /> <span>{title}</span>
                        </div>
                    </div>
                </div>

                <div className="topbar-right">
                    <div className="topbar-search" style={{ position: 'relative' }}>
                        <Search />
                        <input
                            type="text"
                            placeholder="Search contacts, deals, pages..."
                            value={searchQuery}
                            onChange={e => { setSearchQuery(e.target.value); setShowSearchResults(true) }}
                            onFocus={() => setShowSearchResults(true)}
                            onBlur={() => setTimeout(() => setShowSearchResults(false), 300)}
                        />
                        {searchQuery ? (
                            <button
                                style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer', padding: 2, display: 'flex' }}
                                onMouseDown={(e) => { e.preventDefault(); setSearchQuery('') }}
                            >
                                <X size={14} />
                            </button>
                        ) : (
                            <span className="topbar-search-shortcut">⌘K</span>
                        )}

                        {showSearchResults && searchQuery.length > 0 && (
                            <div style={{
                                position: 'absolute', top: '100%', left: 0, right: 0, marginTop: 8,
                                background: 'var(--bg-secondary)', border: '1px solid var(--border-secondary)',
                                borderRadius: 'var(--radius-md)', overflow: 'hidden', boxShadow: 'var(--shadow-lg)', zIndex: 200
                            }}>
                                {searchResults.length > 0 ? (
                                    <>
                                        <div style={{ padding: '8px 16px', fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: '1px solid var(--border-primary)' }}>
                                            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                                        </div>
                                        {searchResults.map((r, i) => (
                                            <div
                                                key={i}
                                                className="search-result-item"
                                                onMouseDown={(e) => { e.preventDefault(); handleResultClick(r) }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 0 }}>
                                                    <div style={{ color: 'var(--text-tertiary)', flexShrink: 0 }}>{typeIcon(r.type)}</div>
                                                    <div style={{ minWidth: 0 }}>
                                                        <div style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</div>
                                                        <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>{r.detail}</div>
                                                    </div>
                                                </div>
                                                <span className={`tag ${typeColor(r.type)}`}>{r.type}</span>
                                            </div>
                                        ))}
                                    </>
                                ) : (
                                    <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.85rem' }}>
                                        No results found for "{searchQuery}"
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <button className="topbar-icon-btn" onClick={() => setShowNotifications(!showNotifications)}>
                        <Bell />
                        <span className="topbar-notification-dot"></span>
                    </button>

                    <button className="topbar-add-btn" onClick={() => setShowNewDealModal(true)}>
                        <Plus />
                        <span>New Deal</span>
                    </button>
                </div>
            </header>

            {/* Notification Panel */}
            {showNotifications && (
                <div className="notification-panel">
                    <div className="notification-panel-header">
                        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Notifications</h3>
                        <button className="topbar-icon-btn" onClick={() => setShowNotifications(false)}><X size={18} /></button>
                    </div>
                    <div className="notification-panel-body">
                        {notifications.map(n => (
                            <div key={n.id} className={`notification-item ${n.unread ? 'unread' : ''}`}>
                                {n.unread && <div className="notification-dot"></div>}
                                <div style={{ flex: 1 }}>
                                    <div className="notification-text" dangerouslySetInnerHTML={{
                                        __html: n.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    }} />
                                    <div className="notification-time">{n.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* New Deal Modal */}
            <Modal isOpen={showNewDealModal} onClose={() => setShowNewDealModal(false)} title="Create New Deal" width={550}>
                <form onSubmit={handleNewDeal}>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Company Name</label>
                            <input className="form-input" placeholder="Enter company name" required />
                        </div>
                        <div className="form-group">
                            <label>Contact Person</label>
                            <input className="form-input" placeholder="Contact name" required />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Deal Title</label>
                        <input className="form-input" placeholder="e.g. Enterprise License" required />
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Deal Value ($)</label>
                            <input className="form-input" type="number" placeholder="0" required />
                        </div>
                        <div className="form-group">
                            <label>Pipeline Stage</label>
                            <select className="form-select" required>
                                <option value="">Select stage</option>
                                <option value="lead">Lead</option>
                                <option value="qualified">Qualified</option>
                                <option value="proposal">Proposal</option>
                                <option value="negotiation">Negotiation</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Probability (%)</label>
                        <input className="form-input" type="number" min="0" max="100" placeholder="50" />
                    </div>
                    <div className="confirm-actions">
                        <button type="button" className="btn-secondary" onClick={() => setShowNewDealModal(false)}>Cancel</button>
                        <button type="submit" className="btn-primary">Create Deal</button>
                    </div>
                </form>
            </Modal>
        </>
    )
}
