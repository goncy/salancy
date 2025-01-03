export {SidebarProvider, SidebarTrigger} from "@/components/ui/sidebar";

import {Filter} from "lucide-react";

import api from "@/api";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";

import {Separator} from "../ui/separator";

import SalaryFilters from "./salaries";
import SettingsFilters from "./settings";

export {Sheet as Provider} from "@/components/ui/sheet";

export default async function FilterSheet() {
  const {positions, currencies, seniorities} = await api.salary.metadata();
  const inflation = await api.inflation.fetch();

  return (
    <SheetContent className="flex w-full flex-col gap-6 md:w-[540px]">
      <SheetHeader>
        <SheetTitle>Filtros</SheetTitle>
        <SheetDescription>
          Los filtros se guardan en la URL, sentite libre de compartir el link con quien quieras.
        </SheetDescription>
      </SheetHeader>
      <SalaryFilters currencies={currencies} positions={positions} seniorities={seniorities} />
      <Separator />
      <SettingsFilters inflation={inflation} />
      <SheetFooter className="mt-auto">
        <SheetClose asChild>
          <Button className="w-full" type="submit" variant="secondary">
            Cerrar
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  );
}

export function Trigger() {
  return (
    <SheetTrigger asChild>
      <Button size="icon" variant="outline">
        <Filter />
      </Button>
    </SheetTrigger>
  );
}
