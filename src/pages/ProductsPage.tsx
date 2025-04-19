
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { DataView } from "@/components/data-display/DataView";
import { FilterPanel } from "@/components/filters/FilterPanel";
import { Product, fetchProducts, getAllCategories, getAllTags } from "@/lib/data";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/ProductCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { FilterX, Plus, Upload } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  });
  
  const categories = useMemo(() => getAllCategories(), []);
  const tags = useMemo(() => getAllTags(), []);

  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const updateUrlParams = useCallback(() => {
    const params = new URLSearchParams();

    // Pagination params
    params.set("page", pagination.page.toString());
    params.set("pageSize", pagination.pageSize.toString());

    // Sort params
    params.set("sort", sortField);
    params.set("order", sortDirection);

    // Search term
    if (searchTerm) params.set("q", searchTerm);

    // Filter params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach((v) => params.append(key, v));
        } else {
          params.set(key, String(value));
        }
      }
    });

    // Tab
    params.set("tab", activeTab);

    setSearchParams(params);
  }, [pagination, sortField, sortDirection, searchTerm, filters, activeTab, setSearchParams]);

  // Parse URL params on initial load
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const sort = searchParams.get("sort") || "name";
    const order = (searchParams.get("order") || "asc") as "asc" | "desc";
    const query = searchParams.get("q") || "";
    const tab = searchParams.get("tab") || "all";

    // Parse filters
    const initialFilters: Record<string, any> = {};
    searchParams.forEach((value, key) => {
      if (!["page", "pageSize", "sort", "order", "q", "tab"].includes(key)) {
        if (key.endsWith("[]")) {
          const cleanKey = key.replace("[]", "");
          if (!initialFilters[cleanKey]) initialFilters[cleanKey] = [];
          initialFilters[cleanKey].push(value);
        } else {
          initialFilters[key] = value;
        }
      }
    });

    // Set state from URL params
    setPagination((prev) => ({ ...prev, page, pageSize }));
    setSortField(sort);
    setSortDirection(order);
    setSearchTerm(query);
    setFilters(initialFilters);
    setActiveTab(tab);
  }, [searchParams]);

  const loadProducts = useCallback(async () => {
    setIsLoading(true);

    try {
      // Handle tab filtering
      let statusFilter: string[] | undefined;
      if (activeTab !== "all") {
        statusFilter = [activeTab];
      }

      const result = await fetchProducts({
        page: pagination.page,
        pageSize: pagination.pageSize,
        filters: { ...filters, status: statusFilter },
        sortField,
        sortDirection,
        searchTerm,
      });

      setProducts(result.data);
      setPagination((prev) => ({
        ...prev,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      }));
    } catch (error) {
      console.error("Error loading products", error);
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.pageSize, filters, activeTab, sortField, sortDirection, searchTerm, toast]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    updateUrlParams();
  }, [updateUrlParams]);

  const handleFilterChange = (newFilters: Record<string, any>) => {
    setFilters(newFilters);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleSort = (field: string, direction: "asc" | "desc") => {
    setSortField(field);
    setSortDirection(direction);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePaginationChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, page, pageSize }));
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleClearFilters = () => {
    setFilters({});
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleExport = () => {
    toast({
      title: "Export initiated",
      description: "Your data export is being prepared.",
    });
  };

  const columns = useMemo(
    () => [
      {
        id: "name",
        header: "Product",
        accessorKey: "name",
        cell: (row: Product) => (
          <div className="flex flex-col">
            <div className="font-medium">{row.name}</div>
            <div className="text-sm text-muted-foreground">
              {row.description.substring(0, 30)}...
            </div>
          </div>
        ),
        sortable: true,
      },
      {
        id: "category",
        header: "Category",
        accessorKey: "category",
        sortable: true,
      },
      {
        id: "price",
        header: "Price",
        accessorKey: "price",
        cell: (row: Product) => <span>${row.price}</span>,
        sortable: true,
      },
      {
        id: "stock",
        header: "Stock",
        accessorKey: "stock",
        sortable: true,
      },
      {
        id: "rating",
        header: "Rating",
        accessorKey: "rating",
        cell: (row: Product) => (
          <div className="flex items-center">
            <span className="mr-1">{row.rating}</span>
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{ width: `${(row.rating / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        ),
        sortable: true,
      },
      {
        id: "status",
        header: "Status",
        accessorKey: "status",
        cell: (row: Product) => {
          const variant =
            row.status === "active"
              ? "default"
              : row.status === "archived"
              ? "secondary"
              : "outline";
          return <Badge variant={variant}>{row.status}</Badge>;
        },
        sortable: true,
      },
      {
        id: "dateAdded",
        header: "Date Added",
        accessorKey: "dateAdded",
        sortable: true,
      },
    ],
    []
  );

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <div className="p-6 space-y-6">
        <PageHeader
          title="Products"
          description="Manage your product inventory"
          breadcrumbs={[{ title: "Products" }]}
        >
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleExport}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleExport}>
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </PageHeader>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-1">
            <FilterPanel
              filters={filters}
              onFilterChange={handleFilterChange}
              categories={categories}
              tags={tags}
              onSearch={handleSearch}
              searchValue={searchTerm}
              onClearFilters={handleClearFilters}
            />
          </div>
          <div className="lg:col-span-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="archived">Archived</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
              </TabsList>
            </Tabs>
            
            {Object.keys(filters).length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-4 animate-fade-in">
                <span className="text-sm font-medium">Active filters:</span>
                {Object.entries(filters).map(([key, value]) => (
                  <Badge key={key} variant="secondary" className="flex items-center gap-1">
                    <span>
                      {key}: {Array.isArray(value) ? value.join(", ") : value}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-3 w-3 ml-1 p-0"
                      onClick={() => {
                        const newFilters = { ...filters };
                        delete newFilters[key];
                        handleFilterChange(newFilters);
                      }}
                    >
                      <X className="h-2 w-2" />
                      <span className="sr-only">Remove</span>
                    </Button>
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7"
                  onClick={handleClearFilters}
                >
                  <FilterX className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              </div>
            )}

            <DataView
              data={products}
              columns={columns}
              onSort={handleSort}
              sortField={sortField}
              sortDirection={sortDirection}
              pagination={{
                page: pagination.page,
                pageSize: pagination.pageSize,
                total: pagination.total,
                totalPages: pagination.totalPages,
              }}
              onPaginationChange={handlePaginationChange}
              isLoading={isLoading}
              renderGridItem={(product) => <ProductCard product={product} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
