import "./globals.css";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "STK Portál",
  description:
    "Vyhledávání kontrol vozidel na STK, informace o českém vozovém parku a srovnání vozidel.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="cs-CZ">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Header></Header>
          <div className="grow">{children}</div>
          <Footer></Footer>
        </div>
      </body>
    </html>
  );
}
