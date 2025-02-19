import {HelpCircle} from "lucide-react";

import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Sheet,
} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default async function FAQSheet({salariesCount}: {salariesCount: number}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="relative" size="icon" variant="outline">
          <HelpCircle />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-6 md:w-[640px]">
        <SheetHeader>
          <SheetTitle>Preguntas Frecuentes</SheetTitle>
          <SheetDescription>Posiblemente tu pregunta ya la hizo alguien más.</SheetDescription>
        </SheetHeader>
        <Accordion collapsible type="single">
          <AccordionItem value="salarios-obtenidos">
            <AccordionTrigger>¿Como se obtuvieron los salarios?</AccordionTrigger>
            <AccordionContent>
              Los salarios se obtuvieron mediante convocatoria abierta en un formulario de Google
              Forms. Los resultados fueron manualmente revisados y filtrados previo a ser usado. A
              le gente se le preguntó su puesto, seniority, salario y moneda.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="salarios-brutos-netos">
            <AccordionTrigger>¿Los salarios son brutos o netos?</AccordionTrigger>
            <AccordionContent>
              Los salarios son brutos para posiciones full-time (~ 160 horas mensuales).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="media">
            <AccordionTrigger>¿Como se calculan los promedios?</AccordionTrigger>
            <AccordionContent>
              Los promedios son calculados como la media aritmética de los salarios reportados (suma
              de los salarios dividido la cantidad de salarios).
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="salarios-ars-usd">
            <AccordionTrigger>Los salarios en ARS y USD no concuerdan</AccordionTrigger>
            <AccordionContent>
              No es una conversión entre uno y otro, son valores reales reportados por diferentes
              usuarios. Puede ser que la gente cobrando en ARS cobre más o menos que alguien
              cobrando en USD.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="salarios-jr-ssr">
            <AccordionTrigger>
              El salario de Junior es más alto que el de Semi-Senior
            </AccordionTrigger>
            <AccordionContent>
              Los salarios son reportados por usuarios, puede ser que una empresa pague más por un
              seniority más bajo de lo que paga otra por un seniority más alto. O puede ser que haya
              menos reportes para una que para otra.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="cantidad-reportes">
            <AccordionTrigger>¿Cuántos reportes hay?</AccordionTrigger>
            <AccordionContent>
              Hay {salariesCount} salarios reportados. Podés ver la cantidad de reportes para cada
              puesto en específico entre paréntesis junto a cada salario.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="descargar-datos">
            <AccordionTrigger>¿Puedo descargar los datos?</AccordionTrigger>
            <AccordionContent>
              Si, podés descargar el dataset completo en formato TSV{" "}
              <a
                className="underline"
                href={process.env.NEXT_PUBLIC_SALARY_SHEET_URL!}
                rel="noopener noreferrer"
                target="_blank"
              >
                acá
              </a>
              .
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="salarios-desactualizados">
            <AccordionTrigger>¿Los salarios son recientes?</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2">
              <p>
                Los salarios son del{" "}
                {new Date(process.env.NEXT_PUBLIC_POLL_DATE!).toLocaleString(undefined, {
                  dateStyle: "short",
                })}
                . Sin embargo, en la sección de filtros podés habilitar{" "}
                <code>Simular salarios actualizados</code> que toma en cuenta la inflación desde el
                momento de la encuesta.
              </p>

              <p>
                En caso de que quieras ver los salarios de la encuesta del 2024, podés encontrarlos{" "}
                <a
                  className="underline"
                  href="https://2024.salarios.gonzalopozzo.com"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  acá
                </a>
                .
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="salarios-argentina">
            <AccordionTrigger>¿Los salarios son de Argentina?</AccordionTrigger>
            <AccordionContent>
              En un 96% de los casos, los salarios son de residentes en Argentina. En futuras
              ediciones se agregará una pregunta para indicar la zona geográfica.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <SheetFooter className="mt-auto">
          <SheetClose asChild>
            <Button className="w-full" type="submit" variant="secondary">
              Cerrar
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
