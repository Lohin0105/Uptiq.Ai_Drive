import { createContext, useContext, useState } from 'react'

const UserContext = createContext()

export function useUser() {
    return useContext(UserContext)
}

export function UserProvider({ children }) {
    const [user, setUser] = useState({
        firstName: 'Lohin',
        lastName: 'Reddy',
        email: 'lohin@nexuscrm.ai',
        role: 'Admin',
        avatar: null, // will hold base64 image
    })

    const updateUser = (updates) => {
        setUser(prev => ({ ...prev, ...updates }))
    }

    const initials = (user.firstName?.[0] || '') + (user.lastName?.[0] || '')

    return (
        <UserContext.Provider value={{ user, updateUser, initials: initials.toUpperCase() }}>
            {children}
        </UserContext.Provider>
    )
}
