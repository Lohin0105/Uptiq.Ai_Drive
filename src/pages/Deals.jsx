import { useState } from 'react'
import { Filter, Plus, MoreHorizontal, Trash2, Edit, GripVertical } from 'lucide-react'
import Modal from '../components/Modal'
import { useToast } from '../components/Toast'

const initialColumns = [
    {
        id: 'lead', title: 'Lead', color: '#8B5CF6',
        deals: [
            { id: 1, company: 'Acme Corp', title: 'Enterprise License Renewal', value: 45000, probability: 20, avatar: 'SC', avatarColor: '#8B5CF6', daysInStage: 3 },
            { id: 2, company: 'FlowState AI', title: 'AI Platform Integration', value: 52000, probability: 15, avatar: 'PP', avatarColor: '#06B6D4', daysInStage: 1 },
            { id: 3, company: 'NexGen Solutions', title: 'Consulting Package', value: 18000, probability: 10, avatar: 'ET', avatarColor: '#6366F1', daysInStage: 5 },
        ]
    },
    {
        id: 'qualified', title: 'Qualified', color: '#6366F1',
        deals: [
            { id: 4, company: 'TechFlow', title: 'SaaS Migration Deal', value: 38500, probability: 40, avatar: 'JM', avatarColor: '#06B6D4', daysInStage: 4 },
            { id: 5, company: 'ByteScale', title: 'Infrastructure Upgrade', value: 24000, probability: 35, avatar: 'DK', avatarColor: '#F43F5E', daysInStage: 7 },
        ]
    },
    {
        id: 'proposal', title: 'Proposal', color: '#3B82F6',
        deals: [
            { id: 6, company: 'CloudNova', title: 'Cloud Security Suite', value: 31000, probability: 60, avatar: 'AR', avatarColor: '#F59E0B', daysInStage: 2 },
            { id: 7, company: 'PulseHQ', title: 'Dev Tools Bundle', value: 67000, probability: 55, avatar: 'MB', avatarColor: '#3B82F6', daysInStage: 6 },
            { id: 8, company: 'DataVault Inc', title: 'Data Analytics Platform', value: 42000, probability: 50, avatar: 'LW', avatarColor: '#10B981', daysInStage: 3 },
        ]
    },
    {
        id: 'negotiation', title: 'Negotiation', color: '#06B6D4',
        deals: [
            { id: 9, company: 'Acme Corp', title: 'Premium Support Contract', value: 28000, probability: 80, avatar: 'SC', avatarColor: '#8B5CF6', daysInStage: 4 },
            { id: 10, company: 'TechFlow', title: 'Annual Partnership', value: 95000, probability: 75, avatar: 'JM', avatarColor: '#06B6D4', daysInStage: 2 },
        ]
    },
    {
        id: 'closed', title: 'Closed Won', color: '#10B981',
        deals: [
            { id: 11, company: 'ByteScale', title: 'Enterprise Onboarding', value: 54000, probability: 100, avatar: 'DK', avatarColor: '#F43F5E', daysInStage: 0 },
            { id: 12, company: 'PulseHQ', title: 'Q1 Expansion Deal', value: 82000, probability: 100, avatar: 'MB', avatarColor: '#3B82F6', daysInStage: 0 },
        ]
    },
]

function getProbClass(p) {
    if (p >= 70) return 'prob-high'
    if (p >= 40) return 'prob-med'
    return 'prob-low'
}

function getColumnTotal(deals) {
    return deals.reduce((sum, d) => sum + d.value, 0)
}

function getTotalPipeline(columns) {
    return columns.reduce((sum, col) => sum + getColumnTotal(col.deals), 0)
}

function getWeightedValue(columns) {
    return columns.reduce((sum, col) => sum + col.deals.reduce((s, d) => s + d.value * d.probability / 100, 0), 0)
}

function getTotalDeals(columns) {
    return columns.reduce((sum, col) => sum + col.deals.length, 0)
}

export default function Deals() {
    const [columns, setColumns] = useState(initialColumns)
    const [draggedDeal, setDraggedDeal] = useState(null)
    const [dragOverCol, setDragOverCol] = useState(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(null)
    const [editingDeal, setEditingDeal] = useState(null)
    const addToast = useToast()

    const handleDragStart = (dealId, fromColId) => {
        setDraggedDeal({ dealId, fromColId })
    }

    const handleDragOver = (e, colId) => {
        e.preventDefault()
        setDragOverCol(colId)
    }

    const handleDragLeave = () => {
        setDragOverCol(null)
    }

    const handleDrop = (toColId) => {
        if (!draggedDeal || draggedDeal.fromColId === toColId) {
            setDraggedDeal(null)
            setDragOverCol(null)
            return
        }

        setColumns(prev => {
            const newCols = prev.map(col => ({ ...col, deals: [...col.deals] }))
            const fromCol = newCols.find(c => c.id === draggedDeal.fromColId)
            const toCol = newCols.find(c => c.id === toColId)
            const dealIdx = fromCol.deals.findIndex(d => d.id === draggedDeal.dealId)
            const [deal] = fromCol.deals.splice(dealIdx, 1)
            deal.daysInStage = 0
            toCol.deals.push(deal)
            return newCols
        })

        const toColName = columns.find(c => c.id === toColId)?.title
        addToast('Deal Moved', `Deal moved to ${toColName}`, 'success')
        setDraggedDeal(null)
        setDragOverCol(null)
    }

    const handleAddDeal = (e) => {
        e.preventDefault()
        const form = e.target
        const newDeal = {
            id: Date.now(),
            company: form.company.value,
            title: form.dealTitle.value,
            value: parseInt(form.dealValue.value),
            probability: parseInt(form.probability.value) || 20,
            avatar: form.company.value.substring(0, 2).toUpperCase(),
            avatarColor: '#8B5CF6',
            daysInStage: 0,
        }
        const stage = form.stage.value
        setColumns(prev => prev.map(col => col.id === stage ? { ...col, deals: [...col.deals, newDeal] } : col))
        setShowAddModal(false)
        addToast('Deal Created', `${newDeal.company} — $${newDeal.value.toLocaleString()} added`, 'success')
    }

    const handleEditDeal = (e) => {
        e.preventDefault()
        const form = e.target
        setColumns(prev => prev.map(col => ({
            ...col,
            deals: col.deals.map(d => d.id === editingDeal.id ? {
                ...d,
                company: form.company.value,
                title: form.dealTitle.value,
                value: parseInt(form.dealValue.value),
                probability: parseInt(form.probability.value),
            } : d)
        })))
        addToast('Deal Updated', `${form.company.value} deal updated`, 'success')
        setEditingDeal(null)
    }

    const handleDeleteDeal = () => {
        setColumns(prev => prev.map(col => ({ ...col, deals: col.deals.filter(d => d.id !== showDeleteModal) })))
        addToast('Deal Deleted', 'Deal has been removed from pipeline', 'info')
        setShowDeleteModal(null)
    }

    const totalPipeline = getTotalPipeline(columns)
    const weightedValue = getWeightedValue(columns)
    const totalDeals = getTotalDeals(columns)
    const avgDealSize = totalDeals > 0 ? Math.round(totalPipeline / totalDeals) : 0

    const DealForm = ({ onSubmit, initial = null }) => (
        <form onSubmit={onSubmit}>
            <div className="form-row">
                <div className="form-group">
                    <label>Company Name</label>
                    <input className="form-input" name="company" defaultValue={initial?.company} placeholder="Enter company name" required />
                </div>
                <div className="form-group">
                    <label>Deal Title</label>
                    <input className="form-input" name="dealTitle" defaultValue={initial?.title} placeholder="e.g. Enterprise License" required />
                </div>
            </div>
            <div className="form-row">
                <div className="form-group">
                    <label>Deal Value ($)</label>
                    <input className="form-input" name="dealValue" type="number" defaultValue={initial?.value} placeholder="0" required />
                </div>
                <div className="form-group">
                    <label>Probability (%)</label>
                    <input className="form-input" name="probability" type="number" min="0" max="100" defaultValue={initial?.probability || 20} />
                </div>
            </div>
            {!initial && (
                <div className="form-group">
                    <label>Pipeline Stage</label>
                    <select className="form-select" name="stage" required>
                        <option value="lead">Lead</option>
                        <option value="qualified">Qualified</option>
                        <option value="proposal">Proposal</option>
                        <option value="negotiation">Negotiation</option>
                    </select>
                </div>
            )}
            <div className="confirm-actions">
                <button type="button" className="btn-secondary" onClick={() => { setShowAddModal(false); setEditingDeal(null) }}>Cancel</button>
                <button type="submit" className="btn-primary">{initial ? 'Save Changes' : 'Create Deal'}</button>
            </div>
        </form>
    )

    return (
        <div>
            <div className="page-header animate-in">
                <div>
                    <h1 className="page-title">Deals Pipeline</h1>
                    <p className="page-subtitle">Drag cards between columns to update deal stages</p>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                    <button className="btn-primary" onClick={() => setShowAddModal(true)}><Plus size={16} /> Add Deal</button>
                </div>
            </div>

            {/* Pipeline Stats */}
            <div style={{ display: 'flex', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }} className="animate-in">
                <div className="card" style={{ flex: 1, minWidth: 150, textAlign: 'center', padding: 'var(--space-md)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Total Pipeline</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700 }}>${(totalPipeline / 1000).toFixed(0)}k</div>
                </div>
                <div className="card" style={{ flex: 1, minWidth: 150, textAlign: 'center', padding: 'var(--space-md)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Weighted Value</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>${(weightedValue / 1000).toFixed(0)}k</div>
                </div>
                <div className="card" style={{ flex: 1, minWidth: 150, textAlign: 'center', padding: 'var(--space-md)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Active Deals</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700 }}>{totalDeals}</div>
                </div>
                <div className="card" style={{ flex: 1, minWidth: 150, textAlign: 'center', padding: 'var(--space-md)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginBottom: 4 }}>Avg. Deal Size</div>
                    <div style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 700 }}>${(avgDealSize / 1000).toFixed(0)}k</div>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="pipeline-container animate-in" style={{ animationDelay: '0.15s', animationFillMode: 'both' }}>
                {columns.map(col => (
                    <div
                        key={col.id}
                        className={`pipeline-column ${dragOverCol === col.id ? 'drag-over' : ''}`}
                        onDragOver={(e) => handleDragOver(e, col.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={() => handleDrop(col.id)}
                    >
                        <div className="pipeline-column-header">
                            <div className="pipeline-column-title">
                                <span className="col-dot" style={{ background: col.color }}></span>
                                {col.title}
                                <span className="pipeline-column-count">{col.deals.length}</span>
                            </div>
                            <div className="pipeline-column-total">
                                ${(getColumnTotal(col.deals) / 1000).toFixed(0)}k
                            </div>
                        </div>
                        <div className="pipeline-cards">
                            {col.deals.map(deal => (
                                <div
                                    key={deal.id}
                                    className={`deal-card ${draggedDeal?.dealId === deal.id ? 'dragging' : ''}`}
                                    draggable
                                    onDragStart={() => handleDragStart(deal.id, col.id)}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                            <GripVertical size={14} style={{ color: 'var(--text-tertiary)', cursor: 'grab' }} />
                                            <div className="deal-card-company">{deal.company}</div>
                                        </div>
                                        <div className="deal-card-actions">
                                            <button className="topbar-icon-btn" style={{ width: 24, height: 24 }} onClick={() => setEditingDeal(deal)}><Edit size={12} /></button>
                                            <button className="topbar-icon-btn" style={{ width: 24, height: 24 }} onClick={() => setShowDeleteModal(deal.id)}><Trash2 size={12} /></button>
                                        </div>
                                    </div>
                                    <div className="deal-card-title">{deal.title}</div>
                                    <div className="deal-card-footer">
                                        <div className="deal-card-value">${deal.value.toLocaleString()}</div>
                                        <div className="deal-card-meta">
                                            <span className={`deal-card-probability ${getProbClass(deal.probability)}`}>{deal.probability}%</span>
                                            <div className="deal-card-avatar" style={{ background: deal.avatarColor }}>{deal.avatar}</div>
                                        </div>
                                    </div>
                                    {deal.daysInStage > 0 && (
                                        <div style={{ marginTop: 'var(--space-sm)', fontSize: '0.72rem', color: deal.daysInStage > 5 ? 'var(--accent-amber)' : 'var(--text-tertiary)' }}>
                                            {deal.daysInStage}d in stage
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Deal Modal */}
            <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="Create New Deal" width={550}>
                <DealForm onSubmit={handleAddDeal} />
            </Modal>

            {/* Edit Deal Modal */}
            <Modal isOpen={!!editingDeal} onClose={() => setEditingDeal(null)} title="Edit Deal" width={550}>
                {editingDeal && <DealForm onSubmit={handleEditDeal} initial={editingDeal} />}
            </Modal>

            {/* Delete Modal */}
            <Modal isOpen={!!showDeleteModal} onClose={() => setShowDeleteModal(null)} title="Delete Deal" width={420}>
                <p style={{ color: 'var(--text-secondary)' }}>Are you sure you want to delete this deal? This action cannot be undone.</p>
                <div className="confirm-actions">
                    <button className="btn-secondary" onClick={() => setShowDeleteModal(null)}>Cancel</button>
                    <button className="btn-danger" onClick={handleDeleteDeal}><Trash2 size={16} /> Delete</button>
                </div>
            </Modal>
        </div>
    )
}
