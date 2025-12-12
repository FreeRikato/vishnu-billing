import {
  addDoc,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDocs,
  getDoc,
  query,
  SnapshotOptions,
  updateDoc,
  WithFieldValue,
  runTransaction,
  orderBy,
  limit,
  startAfter,
  startAt,
  endAt,
  where
} from "firebase/firestore";
import { db } from "../config/firebaseConfig";
import { BaseContact, Contact, ContactForm } from "../types"; // Import new types

const COLLECTION_NAME = "customers";

// 1. Define a Firestore converter for type safety (v9 SDK best practice)
const contactConverter = {
  // To Firestore: removes the 'id' field before writing/updating
  toFirestore: (contact: WithFieldValue<BaseContact>): DocumentData => {
    const { created_at, updated_at, deleted_at, ...baseFields } = contact;
    return {
      ...baseFields,
      ...(created_at && { created_at }),
      ...(updated_at && { updated_at }),
      ...(deleted_at && { deleted_at }),
    };
  },
  // From Firestore: includes the document ID and maps to the Contact interface
  fromFirestore: (
    snapshot: DocumentSnapshot,
    options: SnapshotOptions
  ): Contact => {
    // We can safely cast data as BaseContact now, but still need to map the ID
    const data = snapshot.data(options)! as BaseContact;
    return {
      id: snapshot.id,
      ...data,
    } as Contact;
  },
};

// 2. Helper to get the typed collection reference
// We use the converter here to make all storage functions type-safe
const getContactsCollection = () =>
  collection(db, COLLECTION_NAME).withConverter(contactConverter);

export const storage = {
  // Get customers with pagination support and optional search
  getCustomers: async (
    lastDoc: DocumentSnapshot | null = null,
    limitCount = 20,
    searchQuery: string = '',
    includeDeleted: boolean = false
  ): Promise<{ data: Contact[], lastVisible: DocumentSnapshot | null }> => {
    try {
      const contactsRef = getContactsCollection();
      let q;

      if (searchQuery) {
        // --- SEARCH QUERY LOGIC ---
        // Note: Firestore is case-sensitive.
        // This query finds names starting with the exact casing of searchQuery.
        if (includeDeleted) {
          q = query(
            contactsRef,
            orderBy('name'),
            startAt(searchQuery),
            endAt(searchQuery + '\uf8ff'),
            limit(limitCount)
          );
        } else {
          // For non-deleted contacts, we need to fetch all and filter client-side
          // to avoid the composite index requirement
          q = query(
            contactsRef,
            orderBy('name'),
            startAt(searchQuery),
            endAt(searchQuery + '\uf8ff'),
            limit(limitCount * 2) // Fetch more to account for filtered results
          );
        }
      } else {
        // --- STANDARD LIST LOGIC ---
        if (includeDeleted) {
          q = query(contactsRef, orderBy('customer_id', 'desc'), limit(limitCount));
        } else {
          // For non-deleted contacts, we need to fetch all and filter client-side
          // to avoid the composite index requirement
          q = query(
            contactsRef,
            orderBy('customer_id', 'desc'),
            limit(limitCount * 2) // Fetch more to account for filtered results
          );
        }
      }
      
      // Apply pagination if we have a cursor
      if (lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      let customers = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        // Convert BaseContact to Contact by adding the document ID
        return {
          id: doc.id,
          ...data,
        } as Contact;
      });

      // Filter out deleted contacts if includeDeleted is false
      if (!includeDeleted) {
        customers = customers.filter(customer => !customer.deleted_at);
        // Trim to the requested limit
        customers = customers.slice(0, limitCount);
      }

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1] || null;

      return { data: customers, lastVisible };
    } catch (error) {
      console.error("Error getting customers:", error);
      return { data: [], lastVisible: null };
    }
  },

  // Legacy method for backward compatibility
  getAllCustomers: async (includeDeleted: boolean = false): Promise<Contact[]> => {
    try {
      const contactsRef = getContactsCollection();
      const customersQuery = query(contactsRef);
      
      const querySnapshot = await getDocs(customersQuery);

      // Convert BaseContact to Contact by adding the document ID
      let customers: Contact[] = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
        } as Contact;
      });

      // Filter out deleted contacts if includeDeleted is false
      if (!includeDeleted) {
        customers = customers.filter(customer => !customer.deleted_at);
      }

      return customers;
    } catch (error) {
      console.error("Error getting customers:", error);
      return [];
    }
  },

  // Add a new customer with UUID
  addCustomer: async (customer: ContactForm): Promise<string | null> => {
    try {
      const contactsRef = getContactsCollection();
      const newCustomer = {
        ...customer,
        customer_id: `CUST-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        created_at: new Date().toISOString(),
      };
      
      const docRef = await addDoc(contactsRef, newCustomer);
      return docRef.id;
    } catch (error) {
      console.error("Error adding customer:", error);
      return null;
    }
  },

  // Helper function to get the current customer counter value
  getCurrentCustomerCounter: async (): Promise<number> => {
    try {
      const counterRef = doc(db, "counters", "customer_counter");
      const counterSnapshot = await getDoc(counterRef);
      
      if (counterSnapshot.exists()) {
        return counterSnapshot.data().count || 0;
      }
      
      return 0;
    } catch (error) {
      console.error("Error getting customer counter:", error);
      return 0;
    }
  },

  // Migrate existing customers to the new sequential ID format
  migrateCustomerIds: async (): Promise<boolean> => {
    try {
      const customers = await storage.getAllCustomers();
      
      // Filter customers with old format IDs (CUST_XXXXXX)
      const customersToMigrate = customers.filter(customer =>
        customer.customer_id.startsWith('CUST_')
      );
      
      if (customersToMigrate.length === 0) {
        console.log("No customers to migrate");
        return true;
      }
      
      // Get the current counter value
      const currentCounter = await storage.getCurrentCustomerCounter();
      
      // Firestore transactions have a limit of 500 operations
      // We need to batch the migration to avoid exceeding this limit
      const BATCH_SIZE = 400; // Leave some buffer for the counter update
      let nextId = Math.max(currentCounter, customers.length);
      let migratedCount = 0;
      
      // Process customers in batches
      for (let i = 0; i < customersToMigrate.length; i += BATCH_SIZE) {
        const batch = customersToMigrate.slice(i, i + BATCH_SIZE);
        
        await runTransaction(db, async (transaction) => {
          for (const customer of batch) {
            nextId += 1;
            const newCustomerId = `CUST${nextId.toString().padStart(5, '0')}`;
            
            const customerRef = doc(db, COLLECTION_NAME, customer.id);
            transaction.update(customerRef, { customer_id: newCustomerId });
          }
          
          // Update the counter to the latest value in each batch
          const counterRef = doc(db, "counters", "customer_counter");
          transaction.set(counterRef, { count: nextId });
        });
        
        migratedCount += batch.length;
        console.log(`Migrated batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} customers`);
      }
      
      console.log(`Successfully migrated ${migratedCount} customers in total`);
      return true;
    } catch (error) {
      console.error("Error migrating customer IDs:", error);
      return false;
    }
  },

  // Update a customer (takes Partial<BaseContact>)
  updateCustomer: async (
    customerId: string,
    updatedCustomer: Partial<BaseContact>
  ): Promise<boolean> => {
    try {
      // For updateDoc, we use the base doc reference
      const customerRef = doc(db, COLLECTION_NAME, customerId);
      // Add updated_at timestamp
      const customerWithTimestamp = {
        ...updatedCustomer,
        updated_at: new Date().toISOString(),
      };
      await updateDoc(customerRef, customerWithTimestamp);
      return true;
    } catch (error) {
      console.error("Error updating customer:", error);
      return false;
    }
  },

  // Delete a customer
  deleteCustomer: async (customerId: string): Promise<boolean> => {
    try {
      const customerRef = doc(db, COLLECTION_NAME, customerId);
      await deleteDoc(customerRef);
      return true;
    } catch (error) {
      console.error("Error deleting customer:", error);
      return false;
    }
  },

  // Soft delete a customer (sets deleted_at timestamp)
  deleteCustomerSoft: async (customerId: string): Promise<boolean> => {
    try {
      const customerRef = doc(db, COLLECTION_NAME, customerId);
      await updateDoc(customerRef, {
        deleted_at: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error("Error soft deleting customer:", error);
      return false;
    }
  },

  // Get a single customer by ID
  getCustomer: async (id: string): Promise<Contact | null> => {
    try {
      const docRef = doc(db, COLLECTION_NAME, id).withConverter(contactConverter);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        // The converter handles the ID mapping
        return docSnap.data();
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting customer:", error);
      return null;
    }
  },

  // Clear all customers (for testing)
  clearCustomers: async (): Promise<boolean> => {
    try {
      const customersQuery = query(collection(db, COLLECTION_NAME));
      const querySnapshot = await getDocs(customersQuery);

      const deletePromises = querySnapshot.docs.map((doc) =>
        deleteDoc(doc.ref)
      );

      await Promise.all(deletePromises);
      return true;
    } catch (error) {
      console.error("Error clearing customers:", error);
      return false;
    }
  },
};