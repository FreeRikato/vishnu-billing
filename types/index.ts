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
  invoice_no: string;
  customer_id: string;
  customer_name?: string;
  amount_total: number;
  amount_paid: number;
  status: InvoiceStatus;
  issued_at?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
}

/**
 * Represents an Invoice fetched from Firestore.
 * 'id' is the Firestore document ID and is guaranteed to exist.
 */
export interface Invoice extends BaseInvoice {
  id: string;
}

// InvoiceForm is now an alias for BaseInvoice (data before it has an ID)
export type InvoiceForm = BaseInvoice;
