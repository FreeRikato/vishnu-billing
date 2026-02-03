/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as contacts from "../contacts.js";
import type * as districtStats from "../districtStats.js";
import type * as files from "../files.js";
import type * as invoices from "../invoices.js";
import type * as migrations from "../migrations.js";
import type * as migrations_addInvoiceItemIds from "../migrations/addInvoiceItemIds.js";
import type * as products from "../products.js";
import type * as systemMeta from "../systemMeta.js";
import type * as users from "../users.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  contacts: typeof contacts;
  districtStats: typeof districtStats;
  files: typeof files;
  invoices: typeof invoices;
  migrations: typeof migrations;
  "migrations/addInvoiceItemIds": typeof migrations_addInvoiceItemIds;
  products: typeof products;
  systemMeta: typeof systemMeta;
  users: typeof users;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
