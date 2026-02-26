import { useState, useEffect } from 'react'
import {
    DollarSign, Users, TrendingUp, Target, ArrowUpRight, ArrowDownRight,
    Sparkles, ChevronRight, Mail, Phone, IndianRupee
} from 'lucide-react'
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Cell
} from 'recharts'
import { useToast } from '../components/Toast'

const INR_RATE = 83.5

const monthlyData = [
    { month: 'Jul', revenue: 32000, deals: 18 },
    { month: 'Aug', revenue: 41000, deals: 24 },
    { month: 'Sep', revenue: 38000, deals: 22 },
    { month: 'Oct', revenue: 52000, deals: 31 },
    { month: 'Nov', revenue: 48000, deals: 28 },
    { month: 'Dec', revenue: 61000, deals: 35 },
    { month: 'Jan', revenue: 58000, deals: 33 },
    { month: 'Feb', revenue: 72000, deals: 42 },
]

const weeklyData = [
    { month: 'Mon', revenue: 8200, deals: 5 },
    { month: 'Tue', revenue: 11500, deals: 8 },
    { month: 'Wed', revenue: 9800, deals: 6 },
    { month: 'Thu', revenue: 14200, deals: 10 },
    { month: 'Fri', revenue: 12400, deals: 9 },
    { month: 'Sat', revenue: 7600, deals: 3 },
    { month: 'Sun', revenue: 5300, deals: 1 },
]

const yearlyData = [
    { month: '2020', revenue: 240000, deals: 120 },
    { month: '2021', revenue: 380000, deals: 195 },
    { month: '2022', revenue: 520000, deals: 268 },
    { month: '2023', revenue: 610000, deals: 312 },
    { month: '2024', revenue: 780000, deals: 402 },
    { month: '2025', revenue: 920000, deals: 485 },
]

const pipelineData = [
    { stage: 'Lead', value: 145000, count: 23 },
    { stage: 'Qualified', value: 98000, count: 15 },
    { stage: 'Proposal', value: 76000, count: 11 },
    { stage: 'Negotiation', value: 54000, count: 7 },
    { stage: 'Closed', value: 42000, count: 5 },
]

const pipelineColors = ['#8B5CF6', '#6366F1', '#3B82F6', '#06B6D4', '#10B981']

const activities = [
    { id: 1, initials: 'SK', color: '#8B5CF6', name: 'Sarah Kim', action: 'closed a deal with', target: 'Acme Corp', value: '$24,000', time: '5 min ago' },
    { id: 2, initials: 'MJ', color: '#06B6D4', name: 'Mike Johnson', action: 'added new contact', target: 'Lisa Wang — TechFlow', time: '12 min ago' },
    { id: 3, initials: 'AR', color: '#10B981', name: 'Ana Rodriguez', action: 'moved deal to Negotiation:', target: 'DataVault Inc', value: '$18,500', time: '23 min ago' },
    { id: 4, initials: 'TL', color: '#F59E0B', name: 'Tom Lee', action: 'scheduled a call with', target: 'ByteScale founders', time: '45 min ago' },
    { id: 5, initials: 'JD', color: '#F43F5E', name: 'Jane Doe', action: 'sent proposal to', target: 'CloudNova Systems', value: '$31,000', time: '1 hr ago' },
]

function AnimatedCounter({ target, symbol = '$' }) {
    const [count, setCount] = useState(0)
    useEffect(() => {
        setCount(0)
        const duration = 1200
        const steps = 40
        const increment = target / steps
        let current = 0
        const timer = setInterval(() => {
            current += increment
            if (current >= target) { setCount(target); clearInterval(timer) }
            else setCount(Math.floor(current))
        }, duration / steps)
        return () => clearInterval(timer)
    }, [target])

    if (target >= 10000000) return <span>{symbol}{(count / 10000000).toFixed(2)}Cr</span>
    if (target >= 100000) return <span>{symbol}{(count / 100000).toFixed(1)}L</span>
    if (target >= 1000) return <span>{symbol}{(count / 1000).toFixed(count >= 10000 ? 0 : 1)}k</span>
    return <span>{count}</span>
}

const chartDataMap = {
    'Weekly': weeklyData,
    'Monthly': monthlyData,
    'Yearly': yearlyData,
}

export default function Dashboard() {
    const addToast = useToast()
    const [chartTab, setChartTab] = useState('Monthly')
    const [currency, setCurrency] = useState('USD') // USD or INR
    const chartData = chartDataMap[chartTab]

    const isINR = currency === 'INR'
    const symbol = isINR ? '₹' : '$'
    const rate = isINR ? INR_RATE : 1

    const formatCurrency = (v) => {
        const val = v * rate
        if (isINR) {
            if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`
            if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
            return `₹${(val / 1000).toFixed(0)}k`
        }
        return `$${(val / 1000).toFixed(0)}k`
    }

    const convertedChartData = chartData.map(d => ({
        ...d,
        revenue: Math.round(d.revenue * rate)
    }))

    const convertedPipelineData = pipelineData.map(d => ({
        ...d,
        value: Math.round(d.value * rate)
    }))

    const CustomTooltip = ({ active, payload, label }) => {
        if (!active || !payload?.length) return null
        return (
            <div style={{
                background: 'rgba(17,17,24,0.95)', border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '10px', padding: '12px 16px', backdropFilter: 'blur(20px)'
            }}>
                <p style={{ color: '#8b8b9e', fontSize: '0.78rem', marginBottom: '6px' }}>{label}</p>
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.color, fontSize: '0.88rem', fontWeight: 600 }}>
                        {p.name === 'revenue' ? formatCurrency(p.value / rate) : p.value} {p.name === 'revenue' ? 'Revenue' : 'Deals'}
                    </p>
                ))}
            </div>
        )
    }

    const metrics = [
        { label: 'Total Revenue', value: Math.round(72000 * rate), symbol, isMoney: true, change: '+12.5%', positive: true, icon: isINR ? IndianRupee : DollarSign, color: '#8B5CF6', glow: 'rgba(139,92,246,0.06)' },
        { label: 'Active Deals', value: 42, symbol: '', isMoney: false, change: '+8', positive: true, icon: Target, color: '#06B6D4', glow: 'rgba(6,182,212,0.06)' },
        { label: 'New Contacts', value: 128, symbol: '', isMoney: false, change: '+23%', positive: true, icon: Users, color: '#10B981', glow: 'rgba(16,185,129,0.06)' },
        { label: 'Conversion Rate', value: 34, symbol: '', suffix: '%', isMoney: false, change: '-2.1%', positive: false, icon: TrendingUp, color: '#F59E0B', glow: 'rgba(245,158,11,0.06)' },
    ]

    return (
        <div>
            {/* Currency Toggle */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-md)' }}>
                <div className="chart-tabs">
                    <button className={`chart-tab ${currency === 'USD' ? 'active' : ''}`} onClick={() => setCurrency('USD')}>
                        $ USD
                    </button>
                    <button className={`chart-tab ${currency === 'INR' ? 'active' : ''}`} onClick={() => setCurrency('INR')}>
                        ₹ INR
                    </button>
                </div>
            </div>

            {/* Metrics */}
            <div className="metrics-grid">
                {metrics.map((m, i) => (
                    <div key={i} className={`metric-card animate-in stagger-${i + 1}`} style={{ '--glow-color': m.glow }}>
                        <div className="metric-header">
                            <div className="metric-icon" style={{ background: `${m.color}20` }}>
                                <m.icon style={{ color: m.color }} />
                            </div>
                            <div className={`metric-change ${m.positive ? 'positive' : 'negative'}`}>
                                {m.positive ? <ArrowUpRight /> : <ArrowDownRight />}
                                {m.change}
                            </div>
                        </div>
                        <div className="metric-value">
                            {m.isMoney ? (
                                <AnimatedCounter target={m.value} symbol={m.symbol} />
                            ) : (
                                <>{m.value}{m.suffix || ''}</>
                            )}
                        </div>
                        <div className="metric-label">{m.label}</div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="charts-grid">
                <div className="chart-card animate-in" style={{ animationDelay: '0.25s', animationFillMode: 'both' }}>
                    <div className="chart-header">
                        <h3 className="chart-title">Revenue Overview</h3>
                        <div className="chart-tabs">
                            {['Weekly', 'Monthly', 'Yearly'].map(tab => (
                                <button key={tab} className={`chart-tab ${chartTab === tab ? 'active' : ''}`} onClick={() => setChartTab(tab)}>
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <AreaChart data={convertedChartData}>
                            <defs>
                                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis dataKey="month" tick={{ fill: '#5a5a6e', fontSize: 12 }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: '#5a5a6e', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => formatCurrency(v / rate)} />
                            <Tooltip content={<CustomTooltip />} />
                            <Area type="monotone" dataKey="revenue" stroke="#8B5CF6" strokeWidth={2.5} fill="url(#revenueGrad)" dot={false} activeDot={{ r: 5, fill: '#8B5CF6', stroke: '#0a0a0f', strokeWidth: 2 }} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-card animate-in" style={{ animationDelay: '0.3s', animationFillMode: 'both' }}>
                    <div className="chart-header">
                        <h3 className="chart-title">Pipeline Summary</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={280}>
                        <BarChart data={convertedPipelineData} layout="vertical" barSize={18}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" horizontal={false} />
                            <XAxis type="number" tick={{ fill: '#5a5a6e', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={v => formatCurrency(v / rate)} />
                            <YAxis type="category" dataKey="stage" tick={{ fill: '#8b8b9e', fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                                {pipelineData.map((_, i) => <Cell key={i} fill={pipelineColors[i]} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="charts-grid">
                <div className="chart-card animate-in" style={{ animationDelay: '0.35s', animationFillMode: 'both' }}>
                    <div className="chart-header">
                        <h3 className="chart-title">Recent Activity</h3>
                        <button className="chart-tab active" style={{ background: 'var(--bg-glass)' }}>View All <ChevronRight size={14} /></button>
                    </div>
                    <div className="activity-list">
                        {activities.map(a => (
                            <div key={a.id} className="activity-item">
                                <div className="activity-avatar" style={{ background: a.color }}>{a.initials}</div>
                                <div className="activity-content">
                                    <div className="activity-text">
                                        <strong>{a.name}</strong> {a.action} <strong>{a.target}</strong>
                                        {a.value && <> — <strong style={{ color: '#10B981' }}>{a.value}</strong></>}
                                    </div>
                                    <div className="activity-time">{a.time}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="animate-in" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                    <div className="ai-insights-card" style={{ marginBottom: 'var(--space-md)' }}>
                        <div className="ai-header">
                            <div className="ai-badge"><Sparkles /> AI Insight</div>
                        </div>
                        <p className="ai-insight-text">
                            <strong>3 deals</strong> in your pipeline have been stalled for over 7 days.
                            Based on historical patterns, sending a <strong>follow-up email within 48 hours</strong> increases close rate by <strong>34%</strong>.
                        </p>
                        <button className="ai-action-btn" onClick={() => addToast('Draft Created', 'AI has drafted 3 follow-up emails for your review', 'success')}>
                            <Mail size={14} /> Draft Follow-ups
                        </button>
                    </div>
                    <div className="ai-insights-card">
                        <div className="ai-header">
                            <div className="ai-badge"><Sparkles /> AI Insight</div>
                        </div>
                        <p className="ai-insight-text">
                            <strong>Lisa Wang</strong> from TechFlow opened your proposal <strong>4 times</strong> today.
                            This signals high intent — consider <strong>scheduling a call</strong> to accelerate the deal.
                        </p>
                        <button className="ai-action-btn" onClick={() => addToast('Call Scheduled', 'Meeting scheduled with Lisa Wang for tomorrow at 2:00 PM', 'success')}>
                            <Phone size={14} /> Schedule Call
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
