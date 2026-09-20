export default function robots() {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://studycycle.com.br";

	return {
		rules: [
			{
				userAgent: "*",
				allow: ["/", "/ajuda", "/privacidade", "/login", "/signup"],
				disallow: ["/api/", "/dashboard/", "/ciclo/", "/reset-password/", "/forgot-password/"],
			},
		],
		sitemap: `${baseUrl}/sitemap.xml`,
	};
}
