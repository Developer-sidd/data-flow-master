
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DataPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  className?: string;
}

export function DataPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  className,
}: DataPaginationProps) {
  const pageSizeOptions = [10, 20, 50, 100];
  
  // Calculate start and end item numbers for display
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);
  
  // Create array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 7;
    
    if (totalPages <= maxPagesToShow) {
      // If we have 7 or fewer pages, show all pages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);
      
      // Calculate start and end of page numbers to show
      let startPage = Math.max(currentPage - 1, 2);
      let endPage = Math.min(currentPage + 1, totalPages - 1);
      
      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = 5;
      }
      
      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }
      
      // Add ellipsis if needed
      if (startPage > 2) {
        pageNumbers.push("...");
      }
      
      // Add page numbers
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Add ellipsis if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push("...");
      }
      
      // Always include last page
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4", className)}>
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium">{Math.min(startItem, totalItems)}</span> to{" "}
        <span className="font-medium">{endItem}</span> of{" "}
        <span className="font-medium">{totalItems}</span> items
      </div>
      
      <div className="flex items-center gap-2">
        <div className="flex items-center space-x-2">
          <p className="text-sm whitespace-nowrap">Items per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => {
              onPageSizeChange(parseInt(value));
            }}
          >
            <SelectTrigger className="w-16">
              <SelectValue placeholder={pageSize.toString()} />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-1 ml-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          
          {getPageNumbers().map((page, index) => (
            typeof page === "number" ? (
              <Button
                key={index}
                variant={page === currentPage ? "default" : "outline"}
                size="icon"
                onClick={() => onPageChange(page)}
                className="w-9 h-9"
              >
                {page}
              </Button>
            ) : (
              <span key={index} className="px-2">
                {page}
              </span>
            )
          ))}
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
