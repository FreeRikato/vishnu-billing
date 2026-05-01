import type { Invoice, InvoiceStatus } from '@/types'

/**
 * Local sample invoices data.
 *
 * Note:
 * - This repo currently has no Convex backend / invoices API layer.
 * - We keep this data in one place so the UI can still demonstrate filtering behavior.
 * - When a real backend is introduced, this module should be replaced by API calls.
 */
const SAMPLE_INVOICES: Invoice[] = [
  {
    id: 'INV-0001',
    customerName: 'Arun Medicals',
    total: 1250,
    paid: 0,
    status: 'unpaid',
    issuedAt: '2026-04-18',
  },
  {
    id: 'INV-0002',
    customerName: 'Lakshmi Pharma',
    total: 3990,
    paid: 1200,
    status: 'partial',
    issuedAt: '2026-04-20',
  },
  {
    id: 'INV-0003',
    customerName: 'Sri Murugan Stores',
    total: 850,
    paid: 850,
    status: 'paid',
    issuedAt: '2026-04-25',
  },
  {
    id: 'INV-0004',
    customerName: 'City Health Center',
    total: 2200,
    paid: 0,
    status: 'unpaid',
    issuedAt: '2026-04-29',
  },
]

export type InvoiceQueryParams = {
  search?: string
  status?: InvoiceStatus
}

export async function listInvoices(params: InvoiceQueryParams = {}): Promise<Invoice[]> {
  const search = params.search?.trim() ?? ''
  const status = params.status

  // Keep this async to match a typical data-fetch signature.
  const invoices = [...SAMPLE_INVOICES]

  const statusFiltered = status ? invoices.filter((inv) => inv.status === status) : invoices
  if (!search) return statusFiltered

  const searchLower = search.toLowerCase()
  return statusFiltered.filter((inv) => {
    return (
      inv.id.toLowerCase().includes(searchLower) ||
      inv.customerName.toLowerCase().includes(searchLower)
    )
  })
}

