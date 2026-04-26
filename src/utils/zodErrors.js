export function formatZodError(error) {
	const fieldErrors = {};

	for (const issue of error.issues) {
		const field = issue.path.join(".");

		if (!fieldErrors[field]) {
			fieldErrors[field] = issue.message;
		}
	}

	return fieldErrors;
}
