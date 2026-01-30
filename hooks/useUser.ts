import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useEffect } from "react";
import type { UserUI } from "@/types/user";

export function useUser() {
	const user = useQuery(api.users.getCurrent);
	const ensureDefault = useMutation(api.users.ensureDefault);
	const isLoading = user === undefined;

	// Map Convex user to UI format
	const userUI: UserUI | null = user ? { ...user, id: user._id } : null;

	useEffect(() => {
		if (!user && !isLoading) {
			ensureDefault();
		}
	}, [user, isLoading, ensureDefault]);

	return { user: userUI, isLoading, ensureDefault };
}
