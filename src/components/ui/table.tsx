import * as React from "react";

import {cn} from "@/lib/utils";


function Table({
  className,
  ref,
  ...props
}: {ref?: React.Ref<HTMLTableElement>} & React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="relative w-full overflow-auto">
      <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  );
}

Table.displayName = "Table";

function TableHeader({
  className,
  ref,
  ...props
}: {ref?: React.Ref<HTMLTableSectionElement>} & React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />;
}

TableHeader.displayName = "TableHeader";

function TableBody({
  className,
  ref,
  ...props
}: {ref?: React.Ref<HTMLTableSectionElement>} & React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />;
}

TableBody.displayName = "TableBody";

function TableFooter({
  className,
  ref,
  ...props
}: {ref?: React.Ref<HTMLTableSectionElement>} & React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <tfoot
      ref={ref}
      className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
      {...props}
    />
  );
}

TableFooter.displayName = "TableFooter";

function TableRow({
  className,
  ref,
  ...props
}: {ref?: React.Ref<HTMLTableRowElement>} & React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      ref={ref}
      className={cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className,
      )}
      style={{contentVisibility: "auto"}}
      {...props}
    />
  );
}

TableRow.displayName = "TableRow";

function TableHead({
  className,
  ref,
  ...props
}: {ref?: React.Ref<HTMLTableCellElement>} & React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      ref={ref}
      className={cn(
        "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

TableHead.displayName = "TableHead";

function TableCell({
  className,
  ref,
  ...props
}: {ref?: React.Ref<HTMLTableCellElement>} & React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      ref={ref}
      className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  );
}

TableCell.displayName = "TableCell";

function TableCaption({
  className,
  ref,
  ...props
}: {ref?: React.Ref<HTMLTableCaptionElement>} & React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption ref={ref} className={cn("mt-4 text-sm text-muted-foreground", className)} {...props} />
  );
}

TableCaption.displayName = "TableCaption";

export {Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption};
