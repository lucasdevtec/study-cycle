export default function manifest() {
	return {
		name: "StudyCycle - Gerenciador Inteligente de Ciclos de Estudo",
		short_name: "StudyCycle",
		description: "Planeje seus estudos com base em afinidade e pesos estratégicos com distribuição proporcional de horas.",
		start_url: "/",
		display: "standalone",
		background_color: "#f4f7f5",
		theme_color: "#0c6b58",
		lang: "pt-BR",
		icons: [
			{
				src: "/favicon.ico",
				sizes: "any",
				type: "image/x-icon",
			},
		],
	};
}
