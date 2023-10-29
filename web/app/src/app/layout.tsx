import "./globals.css";
import StyledComponentsRegistry from "./AntdRegistry";
import { App } from "antd";
import { IBM_Plex_Sans } from "next/font/google";

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["500", "700"],
  subsets: ["latin"],
});

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
  // const cache = createCache();
  // const styleText = extractStyle(cache);

  return (
    <html lang="cs-CZ">
      <head>
        {/* ${styleText} */}
        {/* <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin={"anonymous"}
        />
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;700&display=swap"
          rel="stylesheet"
        /> */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
        {/* <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css"
        />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css"
        /> */}
      </head>
      <body className={ibmPlexSans.className}>
        <StyledComponentsRegistry>
          {/* <ConfigProvider theme={theme}> */}
          {/* <StyleProvider cache={cache}></StyleProvider> */}
          <App className="flex min-h-screen">{children}</App>
          {/* </ConfigProvider> */}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
