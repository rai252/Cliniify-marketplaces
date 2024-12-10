import * as React from "react";
import { CaretSortIcon, ChevronDownIcon } from "@radix-ui/react-icons";
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
import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
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
import { IDoctor } from "@/interfaces/doctor.interface";
import { CiEdit } from "react-icons/ci";
import { GrFormView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDeleteDoctorMutation } from "@/services/doctors/doctor.service";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoCloseCircleOutline } from "react-icons/io5";
import { toast } from "react-toastify";

interface Props {
  doctors: IDoctor[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
}

export const columns: ColumnDef<IDoctor>[] = [
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
  {
    accessorKey: "specializations",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Specializations
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: (info: any) =>
      info
        .getValue()
        .map((spec: any) => spec.name)
        .join(", "),
  },
  {
    accessorKey: "is_verified",
    header: "Verified",
    cell: (info) =>
      info.getValue() ? (
        <IoMdCheckmarkCircleOutline className="text-lg text-green-500" />
      ) : (
        <IoCloseCircleOutline className="text-lg text-red-600" />
      ),
  },
];

export const DoctorTable: React.FC<Props> = ({
  doctors,
  pagination,
  onPageChange,
  onSearch,
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  const [deleteDoctor] = useDeleteDoctorMutation();
  const handleNavigation = (route: string) => {
    navigate(route);
  };

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    onSearch(query);
  };

  const table = useReactTable({
    data: doctors,
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

  const handleDeleteDoctor = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this doctor?"
    );

    if (confirmDelete) {
      try {
        await deleteDoctor(id).unwrap();
        toast.success("Doctor deleted successfully");
        navigate("/doctors/");
      } catch (error) {
        toast.error("Error deleting doctor");
      }
    }
  };

  return (
    <div className="overflow-x-auto">
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
            className="overflow-y-auto h-[200px] sm:h-auto"
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
      <div className="rounded-md border">
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
          <TableBody>
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
                  <div className="flex justify-center space-x-1 sm:justify-start">
                    <Button
                      className="bg-indigo-600 text-white hover:text-black"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleNavigation(`/doctors/details/${row.original.id}`)
                      }
                    >
                      <GrFormView className="h-5 w-5" />
                    </Button>
                    <Button
                      className="bg-blue-600 text-white hover:text-black"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleNavigation(`/doctors/${row.original.id}/edit`)
                      }
                    >
                      <CiEdit className="h-5 w-5" />
                    </Button>
                    <Button
                      className="bg-red-600 text-white hover:text-black"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteDoctor(row.original.id)}
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
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(pagination.currentPage + 1)}
            disabled={pagination.currentPage === pagination.totalPages}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};