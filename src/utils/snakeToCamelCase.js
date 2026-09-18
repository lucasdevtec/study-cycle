export const snakeToCamel = obj => {
	if (!obj || typeof obj !== "object") return obj;

	if (Array.isArray(obj)) {
		return obj.map(v => snakeToCamel(v));
	}

	return Object.keys(obj).reduce((acc, key) => {
		const camelKey = key.replace(/(_\w)/g, m => m[1].toUpperCase());
		acc[camelKey] = obj[key];
		return acc;
	}, {});
};
