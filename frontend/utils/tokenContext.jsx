import React from 'react'

export const TokenContext = React.createContext()

export default function Token() {
  return (
    <TokenContext.Provider value={""}>
      
    </TokenContext.Provider>
  )
}