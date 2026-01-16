"use client"

import * as React from "react"
import { ContextItem } from "./add-context-modal"
import { initialMockData } from "@/app/v1/dashboard/context-library/page"

interface ContextLibraryContextType {
  items: ContextItem[]
  addItem: (item: Omit<ContextItem, "id" | "createdAt">) => void
  deleteItem: (id: string) => void
  updateItem: (id: string, updates: Partial<ContextItem>) => void
}

const ContextLibraryContext = React.createContext<ContextLibraryContextType | undefined>(undefined)

export function ContextLibraryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<ContextItem[]>(initialMockData)

  const addItem = React.useCallback((newItem: Omit<ContextItem, "id" | "createdAt">) => {
    const item: ContextItem = {
      ...newItem,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    setItems((prev) => [item, ...prev])
  }, [])

  const deleteItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }, [])

  const updateItem = React.useCallback((id: string, updates: Partial<ContextItem>) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }, [])

  return (
    <ContextLibraryContext.Provider value={{ items, addItem, deleteItem, updateItem }}>
      {children}
    </ContextLibraryContext.Provider>
  )
}

export function useContextLibrary() {
  const context = React.useContext(ContextLibraryContext)
  if (context === undefined) {
    throw new Error("useContextLibrary must be used within a ContextLibraryProvider")
  }
  return context
}
