import type { InferSelectModel } from "drizzle-orm";
import type { Contact as ContactSchema } from "@/db/schema";

// Infer Contact type from Drizzle schema
export type Contact = InferSelectModel<typeof ContactSchema>;
