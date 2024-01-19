import type {Metadata} from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Salancy",
  keywords:
    "salario, sueldo, remuneración, valor de mercado, valoración, programación, frontend, backend, react, angular, vue, ux, ui, glassdoor, ilovemondays",
  description:
    "Fijate si tu salario está en valor de mercado. Recordá tomar los valores como referencia y no como un absoluto. Esta aplicación toma más de 500 respuestas de gente de la comunidad acerca de sus salarios, de forma anónima, para distintas posiciones.",
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="dark container m-auto grid min-h-screen grid-rows-[auto,1fr,auto] bg-background px-4 font-sans antialiased">
        <header className="text-xl font-bold leading-[4rem]">Salancy</header>
        <main className="py-8">{children}</main>
        <footer className="text-center leading-[4rem] text-muted-foreground">
          © {new Date().getFullYear()} Salancy - Página actualizada al{" "}
          {new Date().toLocaleString()}
        </footer>
      </body>
    </html>
  );
}
