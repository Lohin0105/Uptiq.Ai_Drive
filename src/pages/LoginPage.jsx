import { useState, useRef } from 'react'
import { Zap, Eye, EyeOff, LogIn, Sparkles } from 'lucide-react'

const animals = ['🐕', '🦊', '🐱', '🐼', '🦁', '🐸', '🦋', '🐧', '🐬', '🦄', '🐢', '🐰', '🐻', '🐨', '🐮', '🐵']

function FloatingParticle({ emoji, delay, duration, startX, startY, size }) {
    return (
        <div className="login-floating-animal" style={{
            left: `${startX}%`, top: `${startY}%`,
            fontSize: `${size}rem`, animationDelay: `${delay}s`, animationDuration: `${duration}s`,
        }}>{emoji}</div>
    )
}

function Confetti({ active }) {
    if (!active) return null
    const colors = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B', '#F43F5E', '#3B82F6', '#FFD700', '#FF6B6B']
    return (
        <div className="confetti-container">
            {Array.from({ length: 80 }).map((_, i) => (
                <div key={i} className="confetti-piece" style={{
                    left: `${Math.random() * 100}%`, background: colors[i % colors.length],
                    width: Math.random() * 8 + 4, height: Math.random() * 8 + 4,
                    animationDelay: `${Math.random() * 0.8}s`, animationDuration: `${1.5 + Math.random() * 2}s`,
                    borderRadius: Math.random() > 0.5 ? '50%' : '2px', transform: `rotate(${Math.random() * 360}deg)`,
                }} />
            ))}
        </div>
    )
}

function CelebrationOverlay({ name, onContinue }) {
    const celebrationAnimals = ['🎉', '🦊', '🐼', '🦁', '🐕', '🦄', '🐸', '🐱']
    return (
        <div className="celebration-overlay">
            <Confetti active={true} />
            <div className="celebration-card">
                <div className="celebration-emoji-ring">
                    {celebrationAnimals.map((a, i) => (
                        <span key={i} className="celebration-ring-emoji" style={{
                            animationDelay: `${i * 0.12}s`,
                            transform: `rotate(${i * 45}deg) translateY(-70px) rotate(-${i * 45}deg)`,
                        }}>{a}</span>
                    ))}
                </div>
                <div className="celebration-content">
                    <div style={{ fontSize: '3rem', marginBottom: 8 }}>🎊</div>
                    <h1 className="celebration-title">Congratulations!</h1>
                    <p className="celebration-subtitle">Welcome back, <strong>{name}</strong>!</p>
                    <p className="celebration-desc">Your AI-powered CRM is ready to boost your sales pipeline</p>
                    <div className="celebration-animals-row">
                        {['🐕', '🦊', '🐼', '🦁', '🦄'].map((a, i) => (
                            <span key={i} className="celebration-bouncing-animal" style={{ animationDelay: `${i * 0.15}s` }}>{a}</span>
                        ))}
                    </div>
                    <button className="celebration-btn" onClick={onContinue}>
                        <Sparkles size={18} /> Enter NexusCRM
                    </button>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage({ onLogin }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPw, setShowPw] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [showCelebration, setShowCelebration] = useState(false)
    const [loginName, setLoginName] = useState('')

    const particles = useRef(
        animals.map((emoji) => ({
            emoji, delay: Math.random() * 8, duration: 12 + Math.random() * 18,
            startX: Math.random() * 100, startY: Math.random() * 100, size: 1.2 + Math.random() * 1.8,
        }))
    ).current

    const doLogin = (loginEmail, loginPassword) => {
        setError('')
        if (!loginEmail.trim()) { setError('Please enter your email'); return }
        if (!loginPassword.trim()) { setError('Please enter your password'); return }
        if (loginPassword.length < 3) { setError('Password must be at least 3 characters'); return }

        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            const name = loginEmail.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            setLoginName(name || 'User')
            setShowCelebration(true)
        }, 1500)
    }

    const handleLogin = (e) => {
        e.preventDefault()
        doLogin(email, password)
    }

    const handleSocialLogin = (provider) => {
        const socialEmail = provider === 'google' ? 'admin@nexuscrm.ai' : 'admin@nexuscrm.ai'
        const socialPw = 'admin123'
        setEmail(socialEmail)
        setPassword(socialPw)
        setLoading(true)
        setError('')
        setTimeout(() => {
            setLoading(false)
            const name = socialEmail.split('@')[0].split('.').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
            setLoginName(name || 'User')
            setShowCelebration(true)
        }, 1800)
    }

    const handleContinue = () => {
        setShowCelebration(false)
        onLogin(loginName)
    }

    return (
        <div className="login-page">
            <div className="login-bg-particles">
                {particles.map((p, i) => <FloatingParticle key={i} {...p} />)}
            </div>

            <div className="login-orb login-orb-1"></div>
            <div className="login-orb login-orb-2"></div>
            <div className="login-orb login-orb-3"></div>

            <div className="login-card">
                <div className="login-logo">
                    <div className="login-logo-icon"><Zap /></div>
                    <span className="login-logo-text">NexusCRM</span>
                </div>

                <h1 className="login-title">Welcome Back</h1>
                <p className="login-subtitle">Sign in to your AI-powered CRM</p>

                <form onSubmit={handleLogin} className="login-form">
                    <div className="login-field">
                        <label className="login-label">Email</label>
                        <input
                            className="login-input"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={e => { setEmail(e.target.value); setError('') }}
                            autoFocus
                        />
                    </div>

                    <div className="login-field">
                        <label className="login-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                className="login-input"
                                type={showPw ? 'text' : 'password'}
                                placeholder="Enter your password"
                                value={password}
                                onChange={e => { setPassword(e.target.value); setError('') }}
                                style={{ paddingRight: 44 }}
                            />
                            <button type="button" onClick={() => setShowPw(v => !v)}
                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: 4, display: 'flex' }}>
                                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <label style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                            <input type="checkbox" style={{ accentColor: '#8B5CF6' }} /> Remember me
                        </label>
                        <a href="#" style={{ fontSize: '0.82rem', color: '#8B5CF6', textDecoration: 'none' }} onClick={e => e.preventDefault()}>Forgot password?</a>
                    </div>

                    {error && <div className="login-error">{error}</div>}

                    <button type="submit" className="login-submit-btn" disabled={loading}>
                        {loading ? <div className="login-spinner"></div> : <><LogIn size={18} /> Sign In</>}
                    </button>
                </form>

                <div className="login-divider"><span>or continue with</span></div>

                <div className="login-social-row">
                    <button type="button" className="login-social-btn" onClick={() => handleSocialLogin('google')}>
                        <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                        Google
                    </button>
                    <button type="button" className="login-social-btn" onClick={() => handleSocialLogin('github')}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                        GitHub
                    </button>
                </div>

                <p className="login-footer">
                    Don't have an account? <a href="#" onClick={e => e.preventDefault()} style={{ color: '#8B5CF6' }}>Sign up</a>
                </p>
            </div>

            {showCelebration && <CelebrationOverlay name={loginName} onContinue={handleContinue} />}
        </div>
    )
}
