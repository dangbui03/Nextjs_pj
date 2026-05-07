"use client";

import type { TicketSearchResultsType } from "@/lib/queries/getTicketSearchResults";
import type { FormEvent } from "react";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CircleCheckIcon, CircleXIcon } from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";

import SearchButton from "@/components/SearchButton";

type Props = {
  data: TicketSearchResultsType;
  searchText?: string;
};

type rowType = TicketSearchResultsType[0];

export default function TicketTable({ data, searchText = "" }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchValue, setSearchValue] = useState(searchText);

  useEffect(() => {
    setSearchValue(searchText);
  }, [searchText]);

  function handleSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedSearchValue = searchValue.trim();
    const params = new URLSearchParams();

    if (trimmedSearchValue) {
      params.set("searchText", trimmedSearchValue);
    }

    startTransition(() => {
      router.push(params.size ? `/tickets?${params.toString()}` : "/tickets");
    });
  }

  const columnHeadersArray: Array<keyof rowType> = [
    "ticketDate",
    "title",
    "tech",
    "firstName",
    "lastName",
    "email",
    "completed",
  ];

  const columnHelper = createColumnHelper<rowType>();

  const columns = columnHeadersArray.map((columnName) =>
    columnHelper.accessor((row) => { // transformational
      const value = row[columnName];
      if (columnName === "ticketDate" && value instanceof Date) {
        return value.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        })
      }
      if (columnName === "completed" && typeof value === "boolean") {
        return value 
            ? "COMPLETED"
            : "OPEN";
      }
      return value;
    }, {
      id: columnName,
      header: columnName.charAt(0).toUpperCase() + columnName.slice(1),
      cell: ({ getValue }) => { // presentational
        const value = getValue();
        if (columnName === "completed") {
          return (
            <div className="grid place-content-center">
                {value === "OPEN" ? <CircleXIcon className="opacity-25"/> : <CircleCheckIcon className="text-green-600" />}
            </div>
          )
        }
        return value;
      }
    }),
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const rows = table.getRowModel().rows;

  return (
    <div>
      <form
        onSubmit={handleSearch}
        className="flex gap-2 items-center"
      >
        <Input
          name="searchText"
          type="text"
          placeholder="Search Tickets"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className="w-full"
        />
        <SearchButton isPending={isPending} />
      </form>
      <div className="mt-6 rounded-lg overflow-hidden border border-border">
        <Table className="border">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="bg-secondary">
                    <div>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length ? (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="cursor-pointer hover:bg-border/25 dark:hover:bg-ring/40"
                  onClick={() =>
                    router.push(`/tickets/form?ticketId=${row.original.id}`)
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="border">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-muted-foreground"
                >
                  {searchText ? "No tickets found." : "No open tickets found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
