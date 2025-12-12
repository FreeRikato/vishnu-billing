import { drizzle } from "drizzle-orm/expo-sqlite";
import { openDatabaseSync } from "expo-sqlite";
import * as schema from "./schema";

export const expoDb = openDatabaseSync("vishnu-billing.db"); // Export this
export const db = drizzle(expoDb, { schema });
