import { z } from "zod";

const envSchema = z.object({
	CONVEX_URL: z.string().min(1),
});

const config = envSchema.parse({
	CONVEX_URL: process.env.EXPO_PUBLIC_CONVEX_URL,
});

export default config;
