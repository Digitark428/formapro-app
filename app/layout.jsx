import "./globals.css";
import { StoreProvider } from "@/lib/store";

export const metadata = {
  title: "FormaPro — La plateforme des organismes de formation",
  description:
    "Site vitrine et espace administrateur tout-en-un : CRM, relances, génération de documents, signature électronique et archivage Qualiopi.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
