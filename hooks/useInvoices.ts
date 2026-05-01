import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import type { Invoice, InvoiceStatus } from '@/types'
import { listInvoices } from '@/utils/invoices'

export type InvoiceStatusFilter = 'all' | InvoiceStatus

export const INVOICES_KEYS = {
  all: ['invoices'] as const,
  list: (filters: { search: string; status?: InvoiceStatus }) =>
    [...INVOICES_KEYS.all, 'list', filters] as const,
} as const

type UseInvoicesResult = {
  // Input state
  searchText: string
  setSearchText: (next: string) => void
  statusFilter: InvoiceStatusFilter
  setStatusFilter: (next: InvoiceStatusFilter) => void

  // Data state
  invoices: Invoice[]
  isLoading: boolean
  isRefetching: boolean
  refetch: () => void
}

export function useInvoices(): UseInvoicesResult {
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>('all')

  // If "all", we omit the status param (undefined).
  const statusArg: InvoiceStatus | undefined = useMemo(() => {
    if (statusFilter === 'all') return undefined
    return statusFilter
  }, [statusFilter])

  const query = useQuery({
    queryKey: INVOICES_KEYS.list({ search: searchText, status: statusArg }),
    queryFn: async () => {
      return await listInvoices({ search: searchText, status: statusArg })
    },
  })

  return {
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter,
    invoices: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: () => {
      void query.refetch()
    },
  }
}

