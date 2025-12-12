import { storage } from './storage';

/**
 * Utility to migrate existing customer IDs to the new sequential format
 * This can be called from an admin panel or directly in the code
 */
export const migrateExistingCustomers = async (): Promise<boolean> => {
  console.log('Starting migration of existing customer IDs...');
  
  try {
    const result = await storage.migrateCustomerIds();
    
    if (result) {
      console.log('Migration completed successfully!');
    } else {
      console.error('Migration failed!');
    }
    
    return result;
  } catch (error) {
    console.error('Error during migration:', error);
    return false;
  }
};

/**
 * Check if migration is needed by looking for old format customer IDs
 * @returns Promise<boolean> - True if migration is needed
 */
export const isMigrationNeeded = async (): Promise<boolean> => {
  try {
    const customers = await storage.getAllCustomers();
    
    // Check if any customer has the old format ID (CUST_XXXXXX)
    const hasOldFormat = customers.some(customer =>
      customer.customer_id.startsWith('CUST_')
    );
    
    return hasOldFormat;
  } catch (error) {
    console.error('Error checking migration status:', error);
    return false;
  }
};