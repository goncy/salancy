import indicesApi from "@/index/api";
import salaryApi from "@/salary/api";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Separator} from "@/components/ui/separator";

import SalaryFilters from "./salaries";
import SettingsFilters from "./settings";

export {Sheet as FilterSheetProvider} from "@/components/ui/sheet";

export {FilterSheetTrigger} from "./trigger";

export default async function FilterSheet() {
  const {positions, currencies, seniorities} = await salaryApi.salary.metadata();
  const inflation = await indicesApi.inflation.index();

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
