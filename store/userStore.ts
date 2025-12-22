import { create } from "zustand";
import {
	createUser,
	ensureDefaultUser,
	getUserById,
	updateUser,
} from "@/services/userService";
import type { User } from "@/types";

interface UserStore {
	user: User | null;
	loading: boolean;
	fetchUser: (id: number) => Promise<void>;
	ensureDefault: () => Promise<User | null>;
	updateName: (id: number, name: string) => Promise<boolean>;
}

/**
 * Zustand store for managing user state globally.
 */
export const useUserStore = create<UserStore>((set, get) => ({
	user: null,
	loading: false,

	/**
	 * Fetches a user by ID from the database and updates the store.
	 */
	fetchUser: async (id: number) => {
		set({ loading: true });
		try {
			const user = await getUserById(id);
			set({ user, loading: false });
		} catch (error) {
			console.error("Error fetching user:", error);
			set({ loading: false });
		}
	},

	/**
	 * Ensures the default user (ID=1) exists and loads it into the store.
	 * Creates a default user if none exists.
	 */
	ensureDefault: async () => {
		set({ loading: true });
		try {
			const user = await ensureDefaultUser();
			set({ user, loading: false });
			return user;
		} catch (error) {
			console.error("Error ensuring default user:", error);
			set({ loading: false });
			return null;
		}
	},

	/**
	 * Updates the user's name.
	 */
	updateName: async (id: number, name: string) => {
		try {
			const updatedUser = await updateUser(id, name);
			if (updatedUser) {
				set({ user: updatedUser });
				return true;
			}
			return false;
		} catch (error) {
			console.error("Error updating user name:", error);
			return false;
		}
	},
}));
