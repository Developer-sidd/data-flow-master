
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DataTable, Column } from "./DataTable";
import { DataGrid } from "./DataGrid";
import { LayoutGrid, LayoutList } from "lucide-react";

interface DataViewProps<T> {
  data: T[];
  columns: Column<T>[];
  onSort?: (field: string, direction: "asc" | "desc") => void;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  onPaginationChange?: (page: number, pageSize: number) => void;
  isLoading?: boolean;
  renderGridItem?: (item: T) => React.ReactNode;
}

export function DataView<T extends { id: string | number }>({
  data,
  columns,
  onSort,
  sortField,
  sortDirection,
  pagination,
  onPaginationChange,
  isLoading,
  renderGridItem,
}: DataViewProps<T>) {
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedRows, setSelectedRows] = useState<T[]>([]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
          >
            <LayoutList className="mr-2 h-4 w-4" />
            List
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            Grid
          </Button>
        </div>
      </div>

      {viewMode === "table" ? (
        <DataTable
          data={data}
          columns={columns}
          onSort={onSort}
          sortField={sortField}
          sortDirection={sortDirection}
          onRowSelect={setSelectedRows}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
          isLoading={isLoading}
        />
      ) : (
        <DataGrid
          data={data}
          renderItem={renderGridItem}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}
