import HomeClient from "./HomeClient";

export const metadata = {
	title: "StudyCycle | Planejamento e Ciclos de Estudo Inteligentes",
	description: "Organize seu ciclo de estudos com base em afinidade e peso por matéria. Distribuição proporcional de horas para concursos, ENEM e vestibulares.",
	alternates: {
		canonical: "/",
	},
};

const jsonLd = {
	"@context": "https://schema.org",
	"@type": "WebApplication",
	name: "StudyCycle",
	applicationCategory: "EducationalApplication",
	operatingSystem: "Web, Mobile",
	offers: {
		"@type": "Offer",
		price: "0",
		priceCurrency: "BRL",
	},
	description: "Plataforma web para planejamento de ciclos de estudo com distribuição inteligente de horas por matéria e acompanhamento de progresso.",
	featureList: ["Mapeamento de afinidade por matéria", "Cálculo com peso estratégico proporcional", "Acompanhamento hora a hora", "Retomada flexível de estudos"],
};

export default function Home() {
	return (
		<>
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
			<HomeClient />
		</>
	);
}
