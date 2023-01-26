import type { AppProps } from "next/app";
import React, { useState } from "react";
import { store } from "../store";
import { Provider } from "react-redux";
import Head from "next/head";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Image from "next/image";
import { useRouter } from "next/router";
import "../styles/main.css";

// import ConfigContainer from '../components/ConfigContainer';
// import DataVisContainer from '../components/DataVisContainer';

const StyledHeader = styled("div")({
	width: "100%",
	height: "95px",
	display: "flex",
	flex: 1,
	color: "white",
	justifyContent: "center",
	position: "relative",
	alignItems: "center",
	fontSize: "28px",
	lineHeight: "40px",
	maxWidth: 1280,
	margin: "0 auto",
});

const StyledButton = styled(Button)({
	height: "51px",
	width: "60px",
	border: "1px solid #191935",
});

interface NavButtonProps {
	chartType: string;
	selected: boolean;
	onClick: () => void;
}

const charts = [
	{
		chartType: "pie",
		href: "/",
	},
	{
		chartType: "line",
		href: "/explore",
	},
	{
		chartType: "globe",
		href: "/world",
	},
];

function NavButton({ chartType, selected, onClick }: NavButtonProps) {
	return (
		<StyledButton
			variant="outlined"
			style={{
				background: selected ? "#191935" : "#000020",
			}}
			onClick={onClick}>
			<Image
				src={`/lenio-wgs/button_icons/${chartType}.png`}
				width={30}
				height={30}
				alt={`${chartType} Chart Icon`}
			/>
		</StyledButton>
	);
}

export default function App({ Component, pageProps }: AppProps) {
	const [currentChart, setCurrentChart] = useState<string>("pie");
	const router = useRouter();
	return (
		<Provider store={store}>
			<Head>
				<title>WGS - Leniolabs</title>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet" />
			</Head>
			<main style={{ padding: "0 50px 50px 50px" }}>
				<StyledHeader>
					<Image
						src="/lenio-wgs/header-logo1.png"
						height={48}
						width={200}
						alt="Logo Image"
						style={{
							marginRight: "auto",
						}}
					/>
					<div style={{ color: "rgba(238, 238, 238, 0.5)" }}>« Dashboard of the Present Future »</div>
					<div
						style={{
							marginLeft: "auto",
						}}>
						{charts.map((props) => (
							<NavButton
								onClick={() => {
									setCurrentChart(props.chartType);
									router.push(props.href);
								}}
								selected={currentChart === props.chartType}
								chartType={props.chartType}
							/>
						))}
					</div>
				</StyledHeader>
				<Component {...pageProps} />
			</main>
		</Provider>
	);
}
