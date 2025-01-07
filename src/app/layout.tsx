import type {Metadata} from "next";

import salaryApi from "@/salary/api";
import FilterSheet, {
  FilterSheetProvider,
  FilterSheetTrigger,
} from "@/filter/components/filters-sheet";

import "./globals.css";

export const metadata: Metadata = {
  title: "Salancy",
  keywords:
    "salario, sueldo, remuneración, valor de mercado, valoración, programación, frontend, backend, react, angular, vue, ux, ui, glassdoor, ilovemondays",
  description:
    "Fijate si tu salario está en valor de mercado. Recordá tomar los valores como referencia y no como un absoluto. Esta aplicación toma más de 1500 respuestas de gente de la comunidad acerca de sus salarios, de forma anónima, para distintas posiciones.",
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <FilterSheetProvider>
          <div className="container m-auto grid h-screen grid-rows-[auto,1fr,auto] gap-4 overflow-hidden bg-background p-4 font-sans antialiased md:gap-4">
            <header className="flex items-center justify-between">
              <b className="text-xl font-bold">💸 Salancy</b>
              <FilterSheetTrigger />
            </header>
            <main className="overflow-hidden">{children}</main>
            <Footer />
          </div>
          <FilterSheet />
        </FilterSheetProvider>
      </body>
    </html>
  );
}

async function Footer() {
  const salaries = await salaryApi.salary.list();

  return (
    <footer className="flex items-center justify-center text-balance text-center text-sm text-muted-foreground">
      <p>
        <a className="underline" href="https://github.com/goncy/salancy">
          Salancy
        </a>{" "}
        fue hecho con 🖤 por{" "}
        <a className="underline" href="https://goncy.dev">
          Goncy
        </a>
        . Datos registrados el{" "}
        {new Date(process.env.NEXT_PUBLIC_POLL_DATE!).toLocaleString("es-AR", {dateStyle: "short"})}{" "}
        con{" "}
        <a
          className="underline"
          href={process.env.NEXT_PUBLIC_SALARY_SHEET_URL}
          rel="noopener"
          target="_blank"
        >
          {salaries.length} salarios reportados
        </a>
        .
      </p>
    </footer>
  );
}
