
import { cn } from "@/lib/utils";
import { DataPagination } from "./DataPagination";

interface DataGridProps<T> {
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  onPaginationChange?: (page: number, pageSize: number) => void;
  isLoading?: boolean;
  className?: string;
}

export function DataGrid<T>({
  data,
  renderItem,
  pagination,
  onPaginationChange,
  isLoading,
  className,
}: DataGridProps<T>) {
  return (
    <div className={cn("space-y-4", className)}>
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
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
      ) : data.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No results found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((item, i) => (
            <div key={i} className="data-grid-item animate-fade-in" style={{animationDelay: `${i * 50}ms`}}>
              {renderItem(item)}
            </div>
          ))}
        </div>
      )}

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
