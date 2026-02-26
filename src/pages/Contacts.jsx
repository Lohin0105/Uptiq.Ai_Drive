import { useState } from 'react'
import { Search, Filter, Download, UserPlus, MoreHorizontal, Mail, Phone, Trash2, Edit } from 'lucide-react'
import Modal from '../components/Modal'
import { useToast } from '../components/Toast'

const initialContacts = [
    { id: 1, name: 'Sarah Chen', email: 'sarah@acmecorp.com', company: 'Acme Corp', role: 'VP Sales', status: 'active', tags: ['enterprise'], lastContact: '2 hours ago', initials: 'SC', color: '#8B5CF6', phone: '+1 (555) 123-4567', deals: 3, value: '$72,000' },
    { id: 2, name: 'James Mitchell', email: 'james@techflow.io', company: 'TechFlow', role: 'CTO', status: 'lead', tags: ['startup'], lastContact: '1 day ago', initials: 'JM', color: '#06B6D4', phone: '+1 (555) 234-5678', deals: 1, value: '$18,500' },
    { id: 3, name: 'Lisa Wang', email: 'lisa@datavault.com', company: 'DataVault Inc', role: 'Head of Ops', status: 'active', tags: ['enterprise', 'partner'], lastContact: '3 hours ago', initials: 'LW', color: '#10B981', phone: '+1 (555) 345-6789', deals: 2, value: '$45,000' },
    { id: 4, name: 'Alex Rivera', email: 'alex@cloudnova.io', company: 'CloudNova', role: 'Founder', status: 'lead', tags: ['startup'], lastContact: '5 days ago', initials: 'AR', color: '#F59E0B', phone: '+1 (555) 456-7890', deals: 1, value: '$31,000' },
    { id: 5, name: 'David Kim', email: 'david@bytescale.com', company: 'ByteScale', role: 'CEO', status: 'active', tags: ['smb'], lastContact: '2 days ago', initials: 'DK', color: '#F43F5E', phone: '+1 (555) 567-8901', deals: 2, value: '$24,000' },
    { id: 6, name: 'Emma Thompson', email: 'emma@nexgen.co', company: 'NexGen Solutions', role: 'Director', status: 'inactive', tags: ['enterprise'], lastContact: '2 weeks ago', initials: 'ET', color: '#6366F1', phone: '+1 (555) 678-9012', deals: 0, value: '$0' },
    { id: 7, name: 'Marcus Brown', email: 'marcus@pulsehq.io', company: 'PulseHQ', role: 'VP Engineering', status: 'active', tags: ['startup', 'partner'], lastContact: '6 hours ago', initials: 'MB', color: '#3B82F6', phone: '+1 (555) 789-0123', deals: 4, value: '$96,000' },
    { id: 8, name: 'Priya Patel', email: 'priya@flowstate.ai', company: 'FlowState AI', role: 'Co-Founder', status: 'lead', tags: ['startup'], lastContact: '1 day ago', initials: 'PP', color: '#8B5CF6', phone: '+1 (555) 890-1234', deals: 1, value: '$52,000' },
]

const filters = ['All', 'Active', 'Leads', 'Inactive']
const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E', '#6366F1', '#3B82F6']

export default function Contacts() {
    const [contacts, setContacts] = useState(initialContacts)
    const [activeFilter, setActiveFilter] = useState('All')
    const [searchQuery, setSearchQuery] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(null)
    const [editingContact, setEditingContact] = useState(null)
    const addToast = useToast()

    const filteredContacts = contacts.filter(c => {
        const matchesFilter = activeFilter === 'All' ||
            (activeFilter === 'Active' && c.status === 'active') ||
            (activeFilter === 'Leads' && c.status === 'lead') ||
            (activeFilter === 'Inactive' && c.status === 'inactive')
        const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase())
        return matchesFilter && matchesSearch
    })

    const handleAddContact = (e) => {
        e.preventDefault()
        const form = e.target
        const name = form.firstName.value + ' ' + form.lastName.value
        const initials = form.firstName.value[0] + form.lastName.value[0]
        const newContact = {
            id: Date.now(),
            name,
            email: form.email.value,
            company: form.company.value,
            role: form.role.value,
            status: form.status.value,
            tags: [form.tag.value],
            lastContact: 'Just now',
            initials: initials.toUpperCase(),
            color: colors[Math.floor(Math.random() * colors.length)],
            phone: form.phone.value,
            deals: 0,
            value: '$0',
        }
        setContacts(prev => [newContact, ...prev])
        setShowAddModal(false)
        addToast('Contact Added', `${name} has been added to your contacts`, 'success')
    }

    const handleEditContact = (e) => {
        e.preventDefault()
        const form = e.target
        setContacts(prev => prev.map(c => c.id === editingContact.id ? {
            ...c,
            name: form.firstName.value + ' ' + form.lastName.value,
            initials: (form.firstName.value[0] + form.lastName.value[0]).toUpperCase(),
            email: form.email.value,
            company: form.company.value,
            role: form.role.value,
            status: form.status.value,
            phone: form.phone.value,
        } : c))
        addToast('Contact Updated', `${form.firstName.value} ${form.lastName.value} has been updated`, 'success')
        setEditingContact(null)
    }

    const handleDeleteContact = () => {
        const contact = contacts.find(c => c.id === showDeleteModal)
        setContacts(prev => prev.filter(c => c.id !== showDeleteModal))
        setShowDeleteModal(null)
        addToast('Contact Deleted', `${contact.name} has been removed`, 'info')
    }

    const handleExport = () => {
        const csv = ['Name,Email,Company,Role,Status,Phone']
        contacts.forEach(c => csv.push(`${c.name},${c.email},${c.company},${c.role},${c.status},${c.phone}`))
        const blob = new Blob([csv.join('\n')], { type: 'text/csv' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url; a.download = 'contacts.csv'; a.click()
        URL.revokeObjectURL(url)
        addToast('Exported', 'Contacts exported as CSV file', 'success')
    }

    const ContactForm = ({ onSubmit, initial = null }) => {
        const nameParts = initial ? initial.name.split(' ') : ['', '']
        return (
            <form onSubmit={onSubmit}>
                <div className="form-row">
                    <div className="form-group">
                        <label>First Name</label>
                        <input className="form-input" name="firstName" defaultValue={nameParts[0]} placeholder="First name" required />
                    </div>
                    <div className="form-group">
                        <label>Last Name</label>
                        <input className="form-input" name="lastName" defaultValue={nameParts.slice(1).join(' ')} placeholder="Last name" required />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Email</label>
                        <input className="form-input" name="email" type="email" defaultValue={initial?.email} placeholder="email@example.com" required />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input className="form-input" name="phone" defaultValue={initial?.phone} placeholder="+1 (555) 000-0000" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Company</label>
                        <input className="form-input" name="company" defaultValue={initial?.company} placeholder="Company name" required />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <input className="form-input" name="role" defaultValue={initial?.role} placeholder="Job title" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label>Status</label>
                        <select className="form-select" name="status" defaultValue={initial?.status || 'lead'}>
                            <option value="active">Active</option>
                            <option value="lead">Lead</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                    {!initial && (
                        <div className="form-group">
                            <label>Tag</label>
                            <select className="form-select" name="tag" defaultValue="startup">
                                <option value="enterprise">Enterprise</option>
                                <option value="startup">Startup</option>
                                <option value="smb">SMB</option>
                                <option value="partner">Partner</option>
                            </select>
                        </div>
                    )}
                </div>
                <div className="confirm-actions">
                    <button type="button" className="btn-secondary" onClick={() => { setShowAddModal(false); setEditingContact(null) }}>Cancel</button>
                    <button type="submit" className="btn-primary">{initial ? 'Save Changes' : 'Add Contact'}</button>
                </div>
            </form>
        )
    }

    return (
        <div>
            <div className="page-header animate-in">
                <div>
                    <h1 className="page-title">Contacts</h1>
                    <p className="page-subtitle">Manage and track all your customer relationships ({contacts.length} total)</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                    <button className="btn-secondary" onClick={handleExport}><Download size={16} /> Export</button>
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}><UserPlus size={16} /> Add Contact</button>
                </div>
            </div>

            <div className="filters-bar animate-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                <div className="topbar-search" style={{ minWidth: '280px' }}>
                    <Search size={16} />
                    <input type="text" placeholder="Search by name, company, email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                {filters.map(f => (
                    <button key={f} className={`filter-chip ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>
                        {f} {f !== 'All' && `(${contacts.filter(c => f === 'Active' ? c.status === 'active' : f === 'Leads' ? c.status === 'lead' : c.status === 'inactive').length})`}
                    </button>
                ))}
            </div>

            <div className="data-table-wrapper animate-in" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Contact</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Tags</th>
                            <th>Deals</th>
                            <th>Value</th>
                            <th>Last Contact</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContacts.length === 0 ? (
                            <tr><td colSpan={8} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-tertiary)' }}>No contacts found matching your criteria</td></tr>
                        ) : filteredContacts.map(c => (
                            <tr key={c.id}>
                                <td>
                                    <div className="contact-cell">
                                        <div className="contact-avatar" style={{ background: c.color }}>{c.initials}</div>
                                        <div>
                                            <div className="contact-name">{c.name}</div>
                                            <div className="contact-email">{c.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="contact-name" style={{ fontSize: '0.85rem' }}>{c.company}</div>
                                    <div className="contact-email">{c.role}</div>
                                </td>
                                <td>
                                    <span className={`status-badge status-${c.status}`}>
                                        <span className="dot"></span>
                                        {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                                    </span>
                                </td>
                                <td>{c.tags.map(t => <span key={t} className={`tag tag-${t}`}>{t}</span>)}</td>
                                <td style={{ fontWeight: 600 }}>{c.deals}</td>
                                <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.value}</td>
                                <td style={{ color: 'var(--text-tertiary)', fontSize: '0.82rem' }}>{c.lastContact}</td>
                                <td>
                                    <div style={{ display: 'flex', gap: '4px' }}>
                                        <button className="topbar-icon-btn" style={{ width: 30, height: 30 }} title="Send Email" onClick={() => addToast('Email Sent', `Draft email opened for ${c.name}`, 'info')}><Mail size={14} /></button>
                                        <button className="topbar-icon-btn" style={{ width: 30, height: 30 }} title="Edit" onClick={() => setEditingContact(c)}><Edit size={14} /></button>
                                        <button className="topbar-icon-btn" style={{ width: 30, height: 30 }} title="Delete" onClick={() => setShowDeleteModal(c.id)}><Trash2 size={14} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Add Contact Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Add New Contact" width={550}>
                <ContactForm onSubmit={handleAddContact} />
            </Modal>

            {/* Edit Contact Modal */}
            <Modal isOpen={!!editingContact} onClose={() => setEditingContact(null)} title="Edit Contact" width={550}>
                {editingContact && <ContactForm onSubmit={handleEditContact} initial={editingContact} />}
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal isOpen={!!showDeleteModal} onClose={() => setShowDeleteModal(null)} title="Delete Contact" width={420}>
                <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
                    Are you sure you want to delete <strong>{contacts.find(c => c.id === showDeleteModal)?.name}</strong>? This action cannot be undone.
                </p>
                <div className="confirm-actions">
                    <button className="btn-secondary" onClick={() => setShowDeleteModal(null)}>Cancel</button>
                    <button className="btn-danger" onClick={handleDeleteContact}><Trash2 size={16} /> Delete</button>
                </div>
            </Modal>
        </div>
    )
}
