import * as React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";

type MultiSelectProps = {
  children: React.ReactNode;
  title: string;
};

const MultiSelect = ({ children, title }: MultiSelectProps) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className="flex h-10 w-[180px] items-center justify-between rounded-md border border-input bg-background pl-3 pr-1 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
          aria-label="Customise options"
        >
          {title} <ChevronDown className="w-4 h-4" />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="w-[180px] border-zinc-700 border-[1px] border-solid bg-zinc-900 rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=top]:animate-slideDownAndFade data-[side=right]:animate-slideLeftAndFade data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade"
          sideOffset={5}
          align="start"
        >
          {children}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

type MultiSelectOptionProps = {
  checked: boolean;
  onCheckedChange: () => void;
  children: React.ReactNode;
};

const MultiSelectOption = ({
  checked,
  onCheckedChange,
  children,
}: MultiSelectOptionProps) => {
  return (
    <DropdownMenu.CheckboxItem
      className="group text-[13px] leading-none text-violet11 rounded-[3px] flex items-center h-[25px] relative px-[25px] select-none outline-none data-[disabled]:text-mauve8 data-[disabled]:pointer-events-none data-[highlighted]:bg-violet9 data-[highlighted]:text-violet1"
      checked={checked}
      onCheckedChange={onCheckedChange}
    >
      <DropdownMenu.ItemIndicator className="absolute left-0 w-[25px] inline-flex items-center justify-center">
        <Check className="w-4 h-4" />
      </DropdownMenu.ItemIndicator>
      {children}
    </DropdownMenu.CheckboxItem>
  );
};

export { MultiSelect, MultiSelectOption };
