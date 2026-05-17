import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import CartDrawer from "./components/CartDrawer";
import Footer from "./components/Footer";
import Header from "./components/Header";

const geist = Geist({
	variable: "--font-geist",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "Blue — Прості речі, зроблені якісно.",
	description: "Магазин якісних речей для щоденного використання.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="uk" className={`${geist.variable} h-full antialiased`}>
			<body className="min-h-full flex flex-col bg-white text-zinc-900 font-sans">
				<Header />
				<div className="flex-1">{children}</div>
				<Footer />
				<CartDrawer />
			</body>
		</html>
	);
}
