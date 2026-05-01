import { useInfiniteQuery } from '@tanstack/react-query'
import type { InvoiceStatus } from '@/types'
import { storage } from '@/utils/storage'

export type InvoiceStatusFilter = 'all' | InvoiceStatus

export const INVOICES_KEYS = {
  all: ['invoices'] as const,
  lists: (filters?: { search?: string; status?: InvoiceStatus }) =>
    [...INVOICES_KEYS.all, 'list', filters] as const,
}

export function useInvoices(
  searchQuery: string = '',
  statusFilter: InvoiceStatusFilter = 'all'
) {
  const status = statusFilter === 'all' ? undefined : statusFilter
  return useInfiniteQuery({
    queryKey: INVOICES_KEYS.lists({ search: searchQuery, status }),
    initialPageParam: null as any,
    queryFn: async ({ pageParam }) => {
      return await storage.getInvoices(pageParam, 20, searchQuery, status, false)
    },
    getNextPageParam: (lastPage) => lastPage.lastVisible || undefined,
  })
}

