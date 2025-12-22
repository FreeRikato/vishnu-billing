import { useEffect } from "react";
import { useUserStore } from "@/store/userStore";

export function useUser() {
	const user = useUserStore((state) => state.user);
	const loading = useUserStore((state) => state.loading);
	const ensureDefault = useUserStore((state) => state.ensureDefault);

	useEffect(() => {
		if (!user && !loading) {
			ensureDefault();
		}
	}, [user, loading, ensureDefault]);

	return { user, isLoading: loading, error: null as null | Error };
}
