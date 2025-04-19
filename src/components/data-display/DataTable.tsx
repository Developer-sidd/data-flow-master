
import { useState, useRef, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronDown,
  ChevronUp,
  ArrowDownAZ,
  ArrowUpAZ,
  Search,
  X,
} from "lucide-react";
import { DataPagination } from "./DataPagination";
import { cn } from "@/lib/utils";

export interface Column<T> {
  id: string;
  header: string;
  accessorKey: keyof T | ((row: T) => any);
  cell?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onSort?: (field: string, direction: "asc" | "desc") => void;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  onRowSelect?: (selectedRows: T[]) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  onPaginationChange?: (page: number, pageSize: number) => void;
  isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({
  data,
  columns,
  onSort,
  sortField,
  sortDirection = "asc",
  onRowSelect,
  pagination,
  onPaginationChange,
  isLoading,
}: DataTableProps<T>) {
  const [selectedRows, setSelectedRows] = useState<Record<string | number, boolean>>({});
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [resizingColumn, setResizingColumn] = useState<string | null>(null);
  const [lastResizeX, setLastResizeX] = useState<number>(0);
  const tableRef = useRef<HTMLDivElement>(null);

  const allSelected = useMemo(() => {
    return data.length > 0 && data.every((row) => selectedRows[row.id]);
  }, [data, selectedRows]);

  const someSelected = useMemo(() => {
    return data.some((row) => selectedRows[row.id]) && !allSelected;
  }, [data, selectedRows, allSelected]);

  const selectedRowCount = useMemo(() => {
    return Object.values(selectedRows).filter(Boolean).length;
  }, [selectedRows]);

  // Initialize column widths
  useEffect(() => {
    const initialWidths: Record<string, number> = {};
    columns.forEach((column) => {
      initialWidths[column.id] = column.width || 150;
    });
    setColumnWidths(initialWidths);
  }, [columns]);

  useEffect(() => {
    if (onRowSelect) {
      const selected = data.filter((row) => selectedRows[row.id]);
      onRowSelect(selected);
    }
  }, [selectedRows, data, onRowSelect]);

  const handleToggleSelectAll = () => {
    if (allSelected) {
      setSelectedRows({});
    } else {
      const newSelected: Record<string | number, boolean> = {};
      data.forEach((row) => {
        newSelected[row.id] = true;
      });
      setSelectedRows(newSelected);
    }
  };

  const handleToggleRow = (id: string | number) => {
    setSelectedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleHeaderClick = (column: Column<T>) => {
    if (!column.sortable || !onSort) return;

    const newDirection = 
      sortField === column.id && sortDirection === "asc" 
        ? "desc" 
        : "asc";
        
    onSort(column.id, newDirection);
  };

  const handleResizeStart = (e: React.MouseEvent, columnId: string) => {
    e.preventDefault();
    setResizingColumn(columnId);
    setLastResizeX(e.clientX);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (resizingColumn) {
        const delta = e.clientX - lastResizeX;
        if (Math.abs(delta) > 1) {
          setColumnWidths((prev) => {
            const currentWidth = prev[resizingColumn];
            const newWidth = Math.max(100, currentWidth + delta);
            setLastResizeX(e.clientX);
            return { ...prev, [resizingColumn]: newWidth };
          });
        }
      }
    };
    
    const handleMouseUp = () => {
      setResizingColumn(null);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="relative space-y-4 data-table-wrapper">
      {selectedRowCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 bg-accent rounded-md mb-2 animate-fade-in">
          <span className="text-sm font-medium">
            {selectedRowCount} item{selectedRowCount !== 1 ? "s" : ""} selected
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="ml-2 h-7 px-2"
            onClick={() => setSelectedRows({})}
          >
            <X size={16} className="mr-1" />
            Clear
          </Button>
          <div className="ml-auto flex gap-2">
            <Button size="sm" variant="outline" className="h-7">
              Export
            </Button>
            <Button size="sm" variant="destructive" className="h-7">
              Delete
            </Button>
          </div>
        </div>
      )}

      <div
        className="rounded-md border"
        ref={tableRef}
        style={{ position: "relative" }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              {onRowSelect && (
                <TableHead className="w-10">
                  <Checkbox
                    checked={allSelected}
                    // Remove the indeterminate prop as it's not supported
                    data-state={someSelected && !allSelected ? "indeterminate" : undefined}
                    onCheckedChange={handleToggleSelectAll}
                    aria-label="Select all rows"
                  />
                </TableHead>
              )}
              
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className={cn(
                    "relative",
                    column.sortable && "cursor-pointer select-none",
                  )}
                  style={{ width: columnWidths[column.id] }}
                  onClick={() => column.sortable && handleHeaderClick(column)}
                >
                  <div className="flex items-center gap-1">
                    <div>{column.header}</div>
                    {column.sortable && sortField === column.id ? (
                      sortDirection === "asc" ? (
                        <ArrowDownAZ size={16} />
                      ) : (
                        <ArrowUpAZ size={16} />
                      )
                    ) : null}
                  </div>
                  <div
                    className="resize-handle"
                    onMouseDown={(e) => handleResizeStart(e, column.id)}
                  ></div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={onRowSelect ? columns.length + 1 : columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex justify-center items-center">
                    <svg
                      className="animate-spin h-5 w-5 text-primary mr-3"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Loading...
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={onRowSelect ? columns.length + 1 : columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => (
                <TableRow key={row.id}>
                  {onRowSelect && (
                    <TableCell>
                      <Checkbox
                        checked={Boolean(selectedRows[row.id])}
                        onCheckedChange={() => handleToggleRow(row.id)}
                        aria-label={`Select row ${row.id}`}
                      />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={`${row.id}-${column.id}`}>
                      {column.cell
                        ? column.cell(row)
                        : typeof column.accessorKey === "function"
                        ? column.accessorKey(row)
                        : String(row[column.accessorKey] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      {pagination && onPaginationChange && (
        <DataPagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          pageSize={pagination.pageSize}
          totalItems={pagination.total}
          onPageChange={(page) => onPaginationChange(page, pagination.pageSize)}
          onPageSizeChange={(size) => onPaginationChange(1, size)}
        />
      )}
    </div>
  );
}
