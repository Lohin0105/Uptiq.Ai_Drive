import { useState, useRef } from 'react'
import { User, Bell, Shield, Palette, Plug, Bot, Mail, Calendar, MessageSquare, Globe, Database, Webhook, Upload, Eye, EyeOff, Check, X as XIcon, AlertTriangle } from 'lucide-react'
import { useToast } from '../components/Toast'
import { useUser } from '../components/UserContext'
import { useTheme } from '../components/ThemeContext'

const settingsNav = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'ai', icon: Bot, label: 'AI Configuration' },
    { id: 'integrations', icon: Plug, label: 'Integrations' },
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'security', icon: Shield, label: 'Security' },
]

const initialNotifSettings = [
    { label: 'Deal stage changes', desc: 'Get notified when deals move between stages', enabled: true },
    { label: 'New contact added', desc: 'Alert when team members add contacts', enabled: true },
    { label: 'AI insights ready', desc: 'Receive AI-generated recommendations', enabled: true },
    { label: 'Email opens & clicks', desc: 'Track engagement on sent emails', enabled: false },
    { label: 'Weekly performance digest', desc: 'Summary of your CRM metrics', enabled: true },
    { label: 'Deal risk alerts', desc: 'Warnings about stalling or at-risk deals', enabled: true },
]

const initialAISettings = [
    { label: 'Auto-generate insights', desc: 'AI analyzes your data daily and provides recommendations', enabled: true },
    { label: 'Smart lead scoring', desc: 'Automatically score leads based on engagement signals', enabled: true },
    { label: 'Email draft suggestions', desc: 'Get AI-written follow-up email drafts', enabled: true },
    { label: 'Deal risk prediction', desc: 'Predict which deals are at risk of being lost', enabled: true },
]

const initialIntegrations = [
    { name: 'Gmail', icon: Mail, color: '#EA4335', connected: true },
    { name: 'Google Calendar', icon: Calendar, color: '#4285F4', connected: true },
    { name: 'Slack', icon: MessageSquare, color: '#4A154B', connected: false },
    { name: 'HubSpot', icon: Globe, color: '#FF7A59', connected: false },
    { name: 'PostgreSQL', icon: Database, color: '#336791', connected: true },
    { name: 'Webhooks', icon: Webhook, color: '#10B981', connected: false },
]

const initialSecuritySettings = [
    { label: 'Two-Factor Authentication', desc: 'Add an extra layer of security to your account', enabled: false },
    { label: 'Session Timeout', desc: 'Auto logout after period of inactivity', enabled: true },
    { label: 'Login Notifications', desc: 'Get notified on new device logins', enabled: true },
    { label: 'IP Whitelisting', desc: 'Restrict access to trusted IP addresses only', enabled: false },
]

function getPasswordStrength(pw) {
    if (!pw) return { score: 0, label: '', color: '' }
    let score = 0
    if (pw.length >= 6) score++
    if (pw.length >= 10) score++
    if (/[A-Z]/.test(pw)) score++
    if (/[0-9]/.test(pw)) score++
    if (/[^A-Za-z0-9]/.test(pw)) score++
    if (score <= 1) return { score: 1, label: 'Weak', color: '#EF4444' }
    if (score <= 2) return { score: 2, label: 'Fair', color: '#F59E0B' }
    if (score <= 3) return { score: 3, label: 'Good', color: '#06B6D4' }
    if (score <= 4) return { score: 4, label: 'Strong', color: '#10B981' }
    return { score: 5, label: 'Very Strong', color: '#8B5CF6' }
}

// Password field with show/hide toggle - DEFINED OUTSIDE component to prevent re-mount
function PwField({ label, value, onChange, show, onToggle, placeholder }) {
    return (
        <div className="settings-form-group">
            <label className="settings-label">{label}</label>
            <div style={{ position: 'relative', maxWidth: 400 }}>
                <input
                    className="settings-input"
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{ maxWidth: '100%', paddingRight: 44 }}
                />
                <button
                    type="button"
                    onClick={onToggle}
                    style={{
                        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                        background: 'none', border: 'none', color: 'var(--text-tertiary)',
                        cursor: 'pointer', padding: 4, display: 'flex'
                    }}
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    )
}

export default function Settings() {
    const addToast = useToast()
    const { user, updateUser, initials } = useUser()
    const { theme: selectedTheme, setTheme: setSelectedTheme, accent: selectedAccent, setAccent: setSelectedAccent } = useTheme()
    const fileInputRef = useRef(null)
    const [activeTab, setActiveTab] = useState('profile')
    const [notifSettings, setNotifSettings] = useState(initialNotifSettings)
    const [aiSettings, setAISettings] = useState(initialAISettings)
    const [integrations, setIntegrations] = useState(initialIntegrations)
    const [securitySettings, setSecuritySettings] = useState(initialSecuritySettings)
    const [selectedModel, setSelectedModel] = useState('GPT-4o')

    const [firstName, setFirstName] = useState(user.firstName)
    const [lastName, setLastName] = useState(user.lastName)
    const [email, setEmail] = useState(user.email)
    const [role, setRole] = useState(user.role)

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showCurrentPw, setShowCurrentPw] = useState(false)
    const [showNewPw, setShowNewPw] = useState(false)
    const [showConfirmPw, setShowConfirmPw] = useState(false)
    const [pwErrors, setPwErrors] = useState([])

    const passwordStrength = getPasswordStrength(newPassword)
    const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword

    const handlePhotoUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        if (file.size > 5 * 1024 * 1024) { addToast('Error', 'File size must be under 5MB', 'error'); return }
        if (!file.type.startsWith('image/')) { addToast('Error', 'Please select an image file', 'error'); return }
        const reader = new FileReader()
        reader.onload = (ev) => { updateUser({ avatar: ev.target.result }); addToast('Photo Updated', 'Profile photo updated', 'success') }
        reader.readAsDataURL(file)
    }
    const handleRemovePhoto = () => { updateUser({ avatar: null }); addToast('Photo Removed', 'Profile photo removed', 'info') }
    const toggleNotif = (i) => { setNotifSettings(p => p.map((s, x) => x === i ? { ...s, enabled: !s.enabled } : s)); const s = notifSettings[i]; addToast(s.enabled ? 'Disabled' : 'Enabled', `${s.label} ${s.enabled ? 'off' : 'on'}`, 'info') }
    const toggleAI = (i) => { setAISettings(p => p.map((s, x) => x === i ? { ...s, enabled: !s.enabled } : s)); const s = aiSettings[i]; addToast(s.enabled ? 'Disabled' : 'Enabled', `${s.label} ${s.enabled ? 'disabled' : 'enabled'}`, 'info') }
    const toggleIntegration = (i) => { setIntegrations(p => p.map((s, x) => x === i ? { ...s, connected: !s.connected } : s)); const t = integrations[i]; addToast(t.connected ? 'Disconnected' : 'Connected', `${t.name} ${t.connected ? 'disconnected' : 'connected'}`, t.connected ? 'info' : 'success') }
    const toggleSecurity = (i) => { setSecuritySettings(p => p.map((s, x) => x === i ? { ...s, enabled: !s.enabled } : s)); const s = securitySettings[i]; addToast(s.enabled ? 'Disabled' : 'Enabled', `${s.label} ${s.enabled ? 'off' : 'on'}`, 'info') }
    const handleSaveProfile = (e) => { e.preventDefault(); updateUser({ firstName, lastName, email, role }); addToast('Profile Saved', `Name updated to ${firstName} ${lastName}`, 'success') }

    const handleUpdatePassword = (e) => {
        e.preventDefault()
        const errors = []
        if (!currentPassword) errors.push('Current password is required')
        if (!newPassword) errors.push('New password is required')
        if (newPassword.length > 0 && newPassword.length < 6) errors.push('Password must be at least 6 characters')
        if (!confirmPassword) errors.push('Please confirm your new password')
        if (newPassword && confirmPassword && newPassword !== confirmPassword) errors.push('Passwords do not match')
        if (currentPassword && newPassword && currentPassword === newPassword) errors.push('New password must differ from current')
        setPwErrors(errors)
        if (errors.length > 0) { addToast('Error', errors[0], 'error'); return }
        addToast('Password Updated', 'Your password has been changed successfully', 'success')
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('')
        setPwErrors([]); setShowCurrentPw(false); setShowNewPw(false); setShowConfirmPw(false)
    }

    return (
        <div>
            <div className="page-header animate-in">
                <div>
                    <h1 className="page-title">Settings</h1>
                    <p className="page-subtitle">Manage your account preferences and integrations</p>
                </div>
            </div>
            <div className="settings-grid animate-in" style={{ animationDelay: '0.1s', animationFillMode: 'both' }}>
                <nav className="settings-nav">
                    {settingsNav.map(item => (
                        <button key={item.id} className={`settings-nav-link ${activeTab === item.id ? 'active' : ''}`} onClick={() => setActiveTab(item.id)}>
                            <item.icon size={18} /><span>{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="settings-panel">

                    {activeTab === 'profile' && (
                        <div className="settings-section">
                            <h2 className="settings-section-title">Profile Information</h2>
                            <p className="settings-section-desc">Update your personal details and profile picture</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)', marginBottom: 'var(--space-xl)' }}>
                                {user.avatar ? <img src={user.avatar} alt="Profile" style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                                    : <div className="sidebar-avatar" style={{ width: 72, height: 72, fontSize: '1.5rem' }}>{initials}</div>}
                                <div>
                                    <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
                                        <input type="file" ref={fileInputRef} accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
                                        <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.82rem' }} onClick={() => fileInputRef.current?.click()}><Upload size={14} /> Upload Photo</button>
                                        {user.avatar && <button className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.82rem' }} onClick={handleRemovePhoto}>Remove</button>}
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', marginTop: 6 }}>JPG, PNG or GIF. Max 5MB.</p>
                                </div>
                            </div>
                            <form onSubmit={handleSaveProfile}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-lg)' }}>
                                    <div className="settings-form-group"><label className="settings-label">First Name</label><input className="settings-input" value={firstName} onChange={e => setFirstName(e.target.value)} style={{ maxWidth: '100%' }} /></div>
                                    <div className="settings-form-group"><label className="settings-label">Last Name</label><input className="settings-input" value={lastName} onChange={e => setLastName(e.target.value)} style={{ maxWidth: '100%' }} /></div>
                                    <div className="settings-form-group"><label className="settings-label">Email</label><input className="settings-input" value={email} onChange={e => setEmail(e.target.value)} style={{ maxWidth: '100%' }} /></div>
                                    <div className="settings-form-group"><label className="settings-label">Role</label><input className="settings-input" value={role} onChange={e => setRole(e.target.value)} style={{ maxWidth: '100%' }} /></div>
                                </div>
                                <button type="submit" className="btn-primary" style={{ marginTop: 'var(--space-md)' }}>Save Changes</button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="settings-section">
                            <h2 className="settings-section-title">Notification Preferences</h2>
                            <p className="settings-section-desc">Choose how and when you want to be notified</p>
                            {notifSettings.map((s, i) => (<div key={i} className="settings-row"><div><div className="settings-row-label">{s.label}</div><div className="settings-row-desc">{s.desc}</div></div><div className={`toggle ${s.enabled ? 'active' : ''}`} onClick={() => toggleNotif(i)}></div></div>))}
                        </div>
                    )}

                    {activeTab === 'ai' && (
                        <div className="settings-section">
                            <h2 className="settings-section-title">AI Configuration</h2>
                            <p className="settings-section-desc">Customize how the AI assistant works for you</p>
                            {aiSettings.map((s, i) => (<div key={i} className="settings-row"><div><div className="settings-row-label">{s.label}</div><div className="settings-row-desc">{s.desc}</div></div><div className={`toggle ${s.enabled ? 'active' : ''}`} onClick={() => toggleAI(i)}></div></div>))}
                            <div className="settings-form-group" style={{ marginTop: 'var(--space-lg)' }}>
                                <label className="settings-label">AI Model</label>
                                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                    {['GPT-4o', 'Claude 3.5', 'Gemini Pro'].map(m => (
                                        <div key={m} className="integration-card" onClick={() => { setSelectedModel(m); addToast('Model Selected', `Switched to ${m}`, 'success') }}
                                            style={{ border: selectedModel === m ? '1px solid var(--accent-violet)' : undefined, background: selectedModel === m ? 'rgba(139,92,246,0.04)' : undefined, flex: 1, justifyContent: 'center', cursor: 'pointer' }}>
                                            <div style={{ textAlign: 'center' }}><div className="integration-name">{m}</div><div style={{ fontSize: '0.72rem', color: selectedModel === m ? 'var(--accent-violet)' : 'var(--text-tertiary)', marginTop: 2 }}>{selectedModel === m ? 'Active' : 'Select'}</div></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div className="settings-section">
                            <h2 className="settings-section-title">Integrations</h2>
                            <p className="settings-section-desc">Connect your favorite tools</p>
                            <div className="integrations-grid">
                                {integrations.map((int, i) => (
                                    <div key={int.name} className="integration-card" onClick={() => toggleIntegration(i)} style={{ cursor: 'pointer' }}>
                                        <div className="integration-icon" style={{ background: int.color }}><int.icon /></div>
                                        <div><div className="integration-name">{int.name}</div><div className={`integration-status ${!int.connected ? 'disconnected' : ''}`}>{int.connected ? 'Connected' : 'Click to Connect'}</div></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="settings-section">
                            <h2 className="settings-section-title">Appearance</h2>
                            <p className="settings-section-desc">Customize the look and feel of NexusCRM</p>
                            <div className="settings-form-group">
                                <label className="settings-label">Theme</label>
                                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                    {[{ name: 'Dark', bg: '#0a0a0f' }, { name: 'Light', bg: '#ffffff' }, { name: 'Midnight', bg: '#0d1117' }].map(t => (
                                        <div key={t.name} onClick={() => { setSelectedTheme(t.name); addToast('Theme Applied', `${t.name} theme applied`, 'success') }}
                                            style={{ padding: 'var(--space-md)', background: 'var(--bg-glass)', cursor: 'pointer', border: selectedTheme === t.name ? '1px solid var(--accent-violet)' : '1px solid var(--border-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: 'var(--space-md)', minWidth: 130 }}>
                                            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: t.bg, border: '1px solid var(--border-secondary)' }}></div>
                                            <div><div style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.name}</div><div style={{ fontSize: '0.72rem', color: selectedTheme === t.name ? 'var(--accent-violet)' : 'var(--text-tertiary)' }}>{selectedTheme === t.name ? 'Active' : 'Select'}</div></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="settings-form-group">
                                <label className="settings-label">Accent Color</label>
                                <div style={{ display: 'flex', gap: 'var(--space-md)' }}>
                                    {['#8B5CF6', '#3B82F6', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E'].map(c => (
                                        <div key={c} onClick={() => { setSelectedAccent(c); addToast('Accent Applied', 'Accent color applied', 'success') }}
                                            style={{ width: 36, height: 36, borderRadius: 'var(--radius-full)', background: c, cursor: 'pointer', border: selectedAccent === c ? '3px solid white' : '3px solid transparent' }}></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="settings-section">
                            <h2 className="settings-section-title">Security</h2>
                            <p className="settings-section-desc">Manage your account security settings</p>
                            <form onSubmit={handleUpdatePassword}>
                                <PwField label="Current Password" value={currentPassword} onChange={setCurrentPassword} show={showCurrentPw} onToggle={() => setShowCurrentPw(v => !v)} placeholder="Enter current password" />
                                <PwField label="New Password" value={newPassword} onChange={setNewPassword} show={showNewPw} onToggle={() => setShowNewPw(v => !v)} placeholder="Enter new password" />

                                {newPassword.length > 0 && (
                                    <div style={{ maxWidth: 400, marginTop: -8, marginBottom: 16 }}>
                                        <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
                                            {[1, 2, 3, 4, 5].map(i => (<div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= passwordStrength.score ? passwordStrength.color : 'rgba(255,255,255,0.08)', transition: 'background 0.2s' }} />))}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: passwordStrength.color, fontWeight: 500 }}>
                                            {passwordStrength.label}{newPassword.length < 6 && <span style={{ color: 'var(--text-tertiary)', marginLeft: 8 }}>• Min 6 characters</span>}
                                        </div>
                                    </div>
                                )}

                                <PwField label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} show={showConfirmPw} onToggle={() => setShowConfirmPw(v => !v)} placeholder="Re-enter new password" />

                                {confirmPassword.length > 0 && (
                                    <div style={{ maxWidth: 400, marginTop: -8, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
                                        {passwordsMatch ? <><Check size={14} style={{ color: '#10B981' }} /><span style={{ color: '#10B981' }}>Passwords match</span></> : <><XIcon size={14} style={{ color: '#EF4444' }} /><span style={{ color: '#EF4444' }}>Passwords do not match</span></>}
                                    </div>
                                )}

                                {pwErrors.length > 0 && (
                                    <div style={{ maxWidth: 400, marginBottom: 16, padding: '10px 14px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)' }}>
                                        {pwErrors.map((err, i) => (<div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.8rem', color: '#EF4444', padding: '3px 0' }}><AlertTriangle size={13} /> {err}</div>))}
                                    </div>
                                )}

                                <button type="submit" className="btn-primary">Update Password</button>
                            </form>

                            <hr className="section-divider" style={{ margin: 'var(--space-xl) 0' }} />

                            {securitySettings.map((s, i) => (<div key={i} className="settings-row"><div><div className="settings-row-label">{s.label}</div><div className="settings-row-desc">{s.desc}</div></div><div className={`toggle ${s.enabled ? 'active' : ''}`} onClick={() => toggleSecurity(i)}></div></div>))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
