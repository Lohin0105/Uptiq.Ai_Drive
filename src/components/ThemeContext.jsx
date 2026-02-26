import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export function useTheme() {
    return useContext(ThemeContext)
}

const themes = {
    Dark: {
        '--bg-primary': '#0a0a0f',
        '--bg-secondary': '#111118',
        '--bg-tertiary': '#1a1a24',
        '--bg-card': 'rgba(17, 17, 24, 0.8)',
        '--bg-card-hover': 'rgba(26, 26, 36, 0.9)',
        '--bg-glass': 'rgba(255, 255, 255, 0.03)',
        '--bg-glass-strong': 'rgba(255, 255, 255, 0.06)',
        '--text-primary': '#f0f0f5',
        '--text-secondary': '#8b8b9e',
        '--text-tertiary': '#5a5a6e',
        '--border-primary': 'rgba(255, 255, 255, 0.06)',
        '--border-secondary': 'rgba(255, 255, 255, 0.1)',
    },
    Light: {
        '--bg-primary': '#f5f5f7',
        '--bg-secondary': '#ffffff',
        '--bg-tertiary': '#f0f0f2',
        '--bg-card': 'rgba(255, 255, 255, 0.9)',
        '--bg-card-hover': 'rgba(245, 245, 247, 0.95)',
        '--bg-glass': 'rgba(0, 0, 0, 0.03)',
        '--bg-glass-strong': 'rgba(0, 0, 0, 0.06)',
        '--text-primary': '#1a1a2e',
        '--text-secondary': '#555568',
        '--text-tertiary': '#8888a0',
        '--border-primary': 'rgba(0, 0, 0, 0.08)',
        '--border-secondary': 'rgba(0, 0, 0, 0.12)',
    },
    Midnight: {
        '--bg-primary': '#0d1117',
        '--bg-secondary': '#161b22',
        '--bg-tertiary': '#21262d',
        '--bg-card': 'rgba(22, 27, 34, 0.8)',
        '--bg-card-hover': 'rgba(33, 38, 45, 0.9)',
        '--bg-glass': 'rgba(255, 255, 255, 0.03)',
        '--bg-glass-strong': 'rgba(255, 255, 255, 0.06)',
        '--text-primary': '#e6edf3',
        '--text-secondary': '#8b949e',
        '--text-tertiary': '#6e7681',
        '--border-primary': 'rgba(255, 255, 255, 0.06)',
        '--border-secondary': 'rgba(255, 255, 255, 0.1)',
    },
}

const accentVars = (color) => ({
    '--accent-violet': color,
    '--text-accent': color,
    '--border-accent': `${color}33`,
    '--gradient-primary': `linear-gradient(135deg, ${color} 0%, ${adjustColor(color, 30)} 100%)`,
    '--shadow-glow': `0 0 30px ${color}15`,
})

function adjustColor(hex, amount) {
    const num = parseInt(hex.replace('#', ''), 16)
    const r = Math.min(255, ((num >> 16) & 0xff) + amount)
    const g = Math.min(255, ((num >> 8) & 0xff) + amount)
    const b = Math.min(255, (num & 0xff) + amount)
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('Dark')
    const [accent, setAccent] = useState('#8B5CF6')

    useEffect(() => {
        const root = document.documentElement
        const vars = { ...themes[theme], ...accentVars(accent) }
        Object.entries(vars).forEach(([key, val]) => {
            root.style.setProperty(key, val)
        })
    }, [theme, accent])

    return (
        <ThemeContext.Provider value={{ theme, setTheme, accent, setAccent }}>
            {children}
        </ThemeContext.Provider>
    )
}
