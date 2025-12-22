import { useEffect, useState } from "react";
import { getUserById } from "@/services/userService";
import type { User } from "@/types";

export function useUser(id: number = 1) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		async function fetchUser() {
			try {
				setIsLoading(true);
				setError(null);
				const userData = await getUserById(id);
				setUser(userData);
			} catch (err) {
				setError(
					err instanceof Error ? err : new Error("Failed to fetch user"),
				);
			} finally {
				setIsLoading(false);
			}
		}

		fetchUser();
	}, [id]);

	return { user, isLoading, error };
}
