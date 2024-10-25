import type {Metadata} from "next";

import {unstable_cacheLife as cacheLife} from "next/cache";

import api from "@/api";
import "./globals.css";

export const metadata: Metadata = {
  title: "Salancy",
  keywords:
    "salario, sueldo, remuneración, valor de mercado, valoración, programación, frontend, backend, react, angular, vue, ux, ui, glassdoor, ilovemondays",
  description:
    "Fijate si tu salario está en valor de mercado. Recordá tomar los valores como referencia y no como un absoluto. Esta aplicación toma más de 1500 respuestas de gente de la comunidad acerca de sus salarios, de forma anónima, para distintas posiciones.",
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  "use cache";
  cacheLife("max");

  const total = await api.salary.list().then((salaries) => salaries.length);

  return (
    <html lang="en">
      <body className="dark container m-auto grid h-screen grid-rows-[auto,1fr,auto] gap-2 overflow-hidden bg-background px-4 font-sans antialiased md:gap-4">
        <header className="text-xl font-bold leading-[3rem] md:leading-[4rem]">Salancy</header>
        <main className="overflow-auto">{children}</main>
        <footer className="flex min-h-16 items-center justify-center text-balance text-center text-sm text-muted-foreground">
          <p>
            <a className="underline" href="https://github.com/goncy/salancy">
              Salancy
            </a>{" "}
            fue hecho con 🖤 por{" "}
            <a className="underline" href="https://goncy.dev">
              Goncy
            </a>
            . Actualizado al {new Date().toLocaleString("es-AR", {dateStyle: "short"})} con{" "}
            <a
              className="underline"
              href={process.env.NEXT_PUBLIC_SHEET_URL}
              rel="noopener"
              target="_blank"
            >
              {total} salarios reportados
            </a>
            .
          </p>
        </footer>
      </body>
    </html>
  );
}
