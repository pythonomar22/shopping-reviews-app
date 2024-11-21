'use client'

import { createContext, useContext, useState } from 'react'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [preferences, setPreferences] = useState({
    gaming: false,
    battery: false,
    portability: false,
    buildQuality: false,
  })

  const updatePreferences = (newPreferences) => {
    setPreferences(newPreferences)
  }

  return (
    <UserContext.Provider value={{ preferences, updatePreferences }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
} 