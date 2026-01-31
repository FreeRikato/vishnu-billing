import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

const SETTINGS_KEYS = {
	showArchivedContacts: "showArchivedContacts",
	showArchivedProducts: "showArchivedProducts",
	showArchivedInvoices: "showArchivedInvoices",
} as const;

export function useSettings() {
	const settings = useQuery(api.systemMeta.getSettings) ?? {};
	const toggleSetting = useMutation(api.systemMeta.toggleSetting);
	// Reserved for future use
	const _updateSetting = useMutation(api.systemMeta.updateSetting);

	// Parse boolean values from settings
	const showArchivedContacts =
		settings[SETTINGS_KEYS.showArchivedContacts] === "true";
	const showArchivedProducts =
		settings[SETTINGS_KEYS.showArchivedProducts] === "true";
	const showArchivedInvoices =
		settings[SETTINGS_KEYS.showArchivedInvoices] === "true";

	const toggleShowArchivedContacts = () => {
		toggleSetting({ key: SETTINGS_KEYS.showArchivedContacts });
	};

	const toggleShowArchivedProducts = () => {
		toggleSetting({ key: SETTINGS_KEYS.showArchivedProducts });
	};

	const toggleShowArchivedInvoices = () => {
		toggleSetting({ key: SETTINGS_KEYS.showArchivedInvoices });
	};

	return {
		showArchivedContacts,
		showArchivedProducts,
		showArchivedInvoices,
		toggleShowArchivedContacts,
		toggleShowArchivedProducts,
		toggleShowArchivedInvoices,
	};
}
