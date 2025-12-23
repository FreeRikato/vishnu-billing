import type { InferSelectModel } from "drizzle-orm";
import type { User as UserSchema } from "@/db/schema";

// Infer User type from Drizzle schema
export type User = InferSelectModel<typeof UserSchema>;
