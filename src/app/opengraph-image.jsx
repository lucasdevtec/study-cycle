import { ImageResponse } from "next/og";

export const alt = "StudyCycle - Gerenciador Inteligente de Ciclos de Estudo";
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = "image/png";

export default async function Image() {
	return new ImageResponse(
		<div
			style={{
				background: "linear-gradient(135deg, #0c6b58 0%, #064536 100%)",
				width: "100%",
				height: "100%",
				display: "flex",
				flexDirection: "column",
				alignItems: "flex-start",
				justifyContent: "center",
				padding: "80px",
				fontFamily: "sans-serif",
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					gap: "16px",
					marginBottom: "24px",
				}}
			>
				<div
					style={{
						background: "#f0a202",
						width: "24px",
						height: "24px",
						borderRadius: "50%",
					}}
				/>
				<div
					style={{
						fontSize: "36px",
						fontWeight: "bold",
						color: "#5ab89e",
						letterSpacing: "-1px",
					}}
				>
					StudyCycle
				</div>
			</div>
			<div
				style={{
					fontSize: "64px",
					fontWeight: "900",
					color: "#ffffff",
					lineHeight: 1.15,
					maxWidth: "1000px",
					marginBottom: "28px",
					letterSpacing: "-2px",
				}}
			>
				Gerenciador Inteligente de Ciclos de Estudo
			</div>
			<div
				style={{
					fontSize: "28px",
					color: "#d9ebe4",
					maxWidth: "900px",
					lineHeight: 1.4,
				}}
			>
				Distribua seu tempo com base em afinidade e pesos estratégicos. Progresso contínuo, sem rotinas engessadas.
			</div>
		</div>,
		{
			...size,
		},
	);
}
