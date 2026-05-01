export interface BaseContact {
  customer_id: string;
  name: string;
  address: string;
  gstin: string;
  dl_no: string;
  state_code: string;
  mobile: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

/**
 * Represents a Contact fetched from Firestore.
 * 'id' is the Firestore document ID and is guaranteed to exist.
 */
export interface Contact extends BaseContact {
  id: string; // Firestore document ID is required after fetching
}

// ContactForm is now an alias for BaseContact (data before it has an ID)
export type ContactForm = BaseContact;

export type InvoiceStatus = 'unpaid' | 'partial' | 'paid'

export type Invoice = {
  id: string
  customerName: string
  issuedAt: string
  total: number
  paid: number
  status: InvoiceStatus
}
