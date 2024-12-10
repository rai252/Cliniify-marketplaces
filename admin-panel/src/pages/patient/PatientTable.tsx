import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IPatient } from "@/interfaces/patient.interface";
import { useDeletePatientMutation } from "@/services/patients/patient.service";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDownIcon } from "lucide-react";
import { GrFormView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CiEdit } from "react-icons/ci";
import { toast } from "react-toastify";

interface Props {
  patients: IPatient[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
}
export const columns: ColumnDef<IPatient>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Id
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("id")}</div>,
  },
  {
    accessorKey: "full_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Full Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="">{row.getValue("full_name")}</div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
];

const PatientTable: React.FC<Props> = ({
  patients,
  pagination,
  onPageChange,
  onSearch,
}) => {
  const navigate = useNavigate();
  const handleNavigation = (route: string) => {
    navigate(route);
  };
  const [deletePatient] = useDeletePatientMutation();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: patients,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const handleDeleteDoctor = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this Patient?"
    );

    if (confirmDelete) {
      try {
        await deletePatient(id).unwrap();
        toast.success("Deleted patient successfully");
      } catch (error) {
        toast.error("Error deleting Patient");
      }
    }
  };

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDownIcon className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="overflow-y-auto h-[200px]"
          >
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader className="font-bold text-md">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
                <TableHead>Action</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="overflow-x-auto">
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex space-x-1">
                    <Button
                      className="bg-indigo-600 text-white hover:text-black"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleNavigation(`/patient/details/${row.original.id}`)
                      }
                    >
                      <GrFormView className="h-5 w-5" />
                    </Button>
                    <Button
                      className="bg-blue-600 text-white hover:text-black"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleNavigation(`/patient/${row.original.id}/edit`)
                      }
                    >
                      <CiEdit className="h-5 w-5" />
                    </Button>
                    <Button
                      className="bg-red-600 text-white hover:text-black"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDoctor(row.original.id as any)}
                    >
                      <MdDelete className="h-5 w-5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 px-5 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          Page {pagination.currentPage} of {pagination.totalPages}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PatientTable;
