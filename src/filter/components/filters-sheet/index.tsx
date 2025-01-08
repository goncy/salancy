import indicesApi from "@/index/api";
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
import salaryApi from "@/salary/api";

import SalaryFilters from "./salaries";
import SettingsFilters from "./settings";
import {FilterSheetTrigger} from "./trigger";

export default async function FilterSheet() {
  const categories = await salaryApi.salary.category.list();
  const inflation = await indicesApi.inflation.index();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <FilterSheetTrigger />
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col gap-6 md:w-[480px]">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
          <SheetDescription>Filtra los salarios por categoría y posición.</SheetDescription>
        </SheetHeader>
        <SalaryFilters categories={categories} />
        <SettingsFilters inflation={inflation} />
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
