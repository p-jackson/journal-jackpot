const storage = new Map<string, string>();

export default {
	setItem: async (key: string, value: string) => {
		storage.set(key, value);
		return Promise.resolve();
	},
	getItem: (key: string) => {
		const value = storage.get(key) ?? null;
		return Promise.resolve(value);
	},
	clear: () => {
		storage.clear();
		return Promise.resolve();
	},
};
