import { ContactForm } from '@/types'; // Import Contact
import { storage } from '@/utils/storage';
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'; // Added useQuery

// Keys for caching
export const CONTACTS_KEYS = {
  all: ['contacts'] as const,
  // Update lists key to accept filters
  lists: (filters?: { search?: string }) => [...CONTACTS_KEYS.all, 'list', filters] as const,
  // NEW: Key for single contact
  detail: (id: string) => [...CONTACTS_KEYS.all, 'detail', id] as const,
};

// UPDATED: Hook now accepts searchQuery
export function useContacts(searchQuery: string = '') {
  return useInfiniteQuery({
    // Include search query in the key!
    queryKey: CONTACTS_KEYS.lists({ search: searchQuery }),
    initialPageParam: null as any,
    queryFn: async ({ pageParam }) => {
      // Pass the search query to the storage function
      // By default, exclude deleted contacts
      return await storage.getCustomers(pageParam, 20, searchQuery, false);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.lastVisible || undefined;
    },
  });
}

export function useAddCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ContactForm) => {
      return await storage.addCustomer(data);
    },
    onSuccess: () => {
      // When a customer is added, mark the list as 'stale' so it refetches automatically
      queryClient.invalidateQueries({ queryKey: CONTACTS_KEYS.all });
    },
  });
}

// NEW: Hook to fetch a single contact
export function useContact(id: string) {
  return useQuery({
    queryKey: CONTACTS_KEYS.detail(id),
    queryFn: async () => {
      return await storage.getCustomer(id);
    },
    enabled: !!id, // Only run if ID is provided
  });
}

// NEW: Hook to update a customer
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<ContactForm> }) => {
      return await storage.updateCustomer(id, data);
    },
    onSuccess: (result, variables) => {
      // Invalidate the specific contact detail
      queryClient.invalidateQueries({ queryKey: CONTACTS_KEYS.detail(variables.id) });
      // Invalidate the list so it updates the name/details there too
      queryClient.invalidateQueries({ queryKey: CONTACTS_KEYS.all });
    },
  });
}

export function useDeleteCustomerSoft() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customerId: string) => {
      return await storage.deleteCustomerSoft(customerId);
    },
    onSuccess: () => {
      // When a customer is soft deleted, mark the list as 'stale' so it refetches automatically
      queryClient.invalidateQueries({ queryKey: CONTACTS_KEYS.all });
    },
  });
}