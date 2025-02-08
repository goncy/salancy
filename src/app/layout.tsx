import type {Metadata} from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "Salancy - Encuesta de Salarios IT en Argentina",
  description:
    "Consulta los salarios promedio actualizados del mercado IT en Argentina. Basado en más de 3000 respuestas anónimas de la comunidad tech, con datos de sueldos en USD y ARS para diferentes posiciones y niveles de experiencia.",
  keywords: [
    "salarios IT Argentina",
    "sueldos programación",
    "encuesta salarios tech",
    "salario desarrollador",
    "sueldo programador Argentina",
    "salarios frontend Argentina",
    "salarios backend Argentina",
    "sueldos UX/UI Argentina",
    "mercado IT Argentina",
    "remuneración tecnología",
  ],
  openGraph: {
    title: "Salancy - Encuesta de Salarios IT en Argentina",
    description:
      "Consulta los salarios promedio actualizados del mercado IT en Argentina. Datos reales basados en más de 3000 respuestas anónimas de la comunidad tech.",
    type: "website",
    locale: "es_AR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Salancy - Encuesta de Salarios IT Argentina",
    description:
      "Consulta los salarios promedio actualizados del mercado IT en Argentina. Datos reales basados en más de 3000 respuestas anónimas de la comunidad tech.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
