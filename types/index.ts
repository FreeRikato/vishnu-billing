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

export type InvoiceStatus = "unpaid" | "partial" | "paid";

export interface BaseInvoice {
  invoice_number: string;
  customer_id: string;
  customer_name: string;
  total_amount: number;
  paid_amount: number;
  status: InvoiceStatus;
  issued_at: string; // ISO string
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

export interface Invoice extends BaseInvoice {
  id: string;
}
