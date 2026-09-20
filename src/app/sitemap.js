export default function sitemap() {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://studycycle.com.br";
	const now = new Date();

	return [
		{
			url: `${baseUrl}/`,
			lastModified: now,
			changeFrequency: "weekly",
			priority: 1.0,
		},
		{
			url: `${baseUrl}/ajuda`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.8,
		},
		{
			url: `${baseUrl}/privacidade`,
			lastModified: now,
			changeFrequency: "yearly",
			priority: 0.5,
		},
		{
			url: `${baseUrl}/login`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.7,
		},
		{
			url: `${baseUrl}/signup`,
			lastModified: now,
			changeFrequency: "monthly",
			priority: 0.8,
		},
	];
}
