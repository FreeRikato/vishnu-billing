import { useEffect, useState } from "react";
import type { ColorSchemeName } from "react-native";
import { useColorScheme as useRNColorScheme } from "react-native";

/**
 * To support static rendering, this value needs to be re-calculated on the client side for web
 */
export function useColorScheme(): ColorSchemeName {
	const [hasHydrated, setHasHydrated] = useState(false);

	useEffect(() => {
		setHasHydrated(true);
	}, []);

	const colorScheme = useRNColorScheme();

	if (hasHydrated) {
		return colorScheme;
	}

	return null; // Return null during SSR to match ColorSchemeName type
}
