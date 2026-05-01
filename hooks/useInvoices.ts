import { useInfiniteQuery } from "@tanstack/react-query";
import { useState } from "react";

import type { InvoiceStatus } from "@/types";
import { storage } from "@/utils/storage";

export type InvoiceStatusFilter = "all" | InvoiceStatus;

export const INVOICES_KEYS = {
  all: ["invoices"] as const,
  lists: (filters?: { search?: string; status?: InvoiceStatusFilter }) =>
    [...INVOICES_KEYS.all, "list", filters] as const,
};

export function useInvoices() {
  const [searchText, setSearchText] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<InvoiceStatusFilter>("all");

  const statusArg: InvoiceStatus | undefined =
    statusFilter === "all" ? undefined : statusFilter;

  const query = useInfiniteQuery({
    queryKey: INVOICES_KEYS.lists({ search: searchText, status: statusFilter }),
    initialPageParam: null as any,
    queryFn: async ({ pageParam }) => {
      return await storage.getInvoices(pageParam, 20, searchText, statusArg, false);
    },
    getNextPageParam: (lastPage) => {
      return lastPage.lastVisible || undefined;
    },
  });

  const invoices = query.data?.pages.flatMap((page) => page.data) ?? [];

  return {
    invoices,
    searchText,
    setSearchText,
    statusFilter,
    setStatusFilter,
    ...query,
  };
}

