import { create } from 'zustand'

export type InvoiceStatusFilter = 'all' | 'unpaid' | 'partial' | 'paid'

interface InvoiceState {
  searchQuery: string
  setSearchQuery: (query: string) => void

  statusFilter: InvoiceStatusFilter
  setStatusFilter: (status: InvoiceStatusFilter) => void
}

export const useInvoiceStore = create<InvoiceState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  statusFilter: 'all',
  setStatusFilter: (status) => set({ statusFilter: status }),
}))

