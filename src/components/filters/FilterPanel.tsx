
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

export interface FilterPanelProps {
  filters: Record<string, any>;
  onFilterChange: (filters: Record<string, any>) => void;
  categories?: string[];
  tags?: string[];
  onSearch: (term: string) => void;
  searchValue: string;
  onClearFilters: () => void;
  className?: string;
}

export function FilterPanel({
  filters,
  onFilterChange,
  categories = [],
  tags = [],
  onSearch,
  searchValue,
  onClearFilters,
  className,
}: FilterPanelProps) {
  const [searchTerm, setSearchTerm] = useState(searchValue);
  const [priceRange, setPriceRange] = useState([
    filters.priceMin || 0,
    filters.priceMax || 500,
  ]);
  const [dateFrom, setDateFrom] = useState<Date | undefined>(
    filters.dateFrom ? new Date(filters.dateFrom) : undefined
  );
  const [dateTo, setDateTo] = useState<Date | undefined>(
    filters.dateTo ? new Date(filters.dateTo) : undefined
  );
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  const handlePriceChange = (values: number[]) => {
    setPriceRange(values);
    onFilterChange({
      ...filters,
      priceMin: values[0],
      priceMax: values[1],
    });
  };
  
  const handleCategoryChange = (category: string, checked: boolean) => {
    const currentCategories = filters.category || [];
    let newCategories;
    
    if (checked) {
      newCategories = [...currentCategories, category];
    } else {
      newCategories = currentCategories.filter((c: string) => c !== category);
    }
    
    onFilterChange({
      ...filters,
      category: newCategories.length ? newCategories : undefined,
    });
  };
  
  const handleTagChange = (tag: string, checked: boolean) => {
    const currentTags = filters.tags || [];
    let newTags;
    
    if (checked) {
      newTags = [...currentTags, tag];
    } else {
      newTags = currentTags.filter((t: string) => t !== tag);
    }
    
    onFilterChange({
      ...filters,
      tags: newTags.length ? newTags : undefined,
    });
  };
  
  const handleDateFromChange = (date: Date | undefined) => {
    setDateFrom(date);
    onFilterChange({
      ...filters,
      dateFrom: date?.toISOString().split('T')[0],
    });
  };
  
  const handleDateToChange = (date: Date | undefined) => {
    setDateTo(date);
    onFilterChange({
      ...filters,
      dateTo: date?.toISOString().split('T')[0],
    });
  };
  
  const handleStatusChange = (value: string) => {
    onFilterChange({
      ...filters,
      status: value === "all" ? undefined : [value],
    });
  };
  
  const hasActiveFilters = Object.keys(filters).some(
    (key) => 
      filters[key] !== undefined && 
      (Array.isArray(filters[key]) ? filters[key].length > 0 : true)
  );

  return (
    <div className={cn("space-y-6", className)}>
      <form onSubmit={handleSearchSubmit} className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-8 pr-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {searchTerm && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-9 w-9"
            onClick={() => {
              setSearchTerm("");
              onSearch("");
            }}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </form>

      <div className="flex justify-between items-center">
        <h3 className="font-medium">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={onClearFilters}
          >
            <X className="mr-1 h-3 w-3" />
            Clear all filters
          </Button>
        )}
      </div>

      <Accordion type="multiple" defaultValue={["price", "category", "status"]}>
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider
                defaultValue={priceRange}
                min={0}
                max={500}
                step={5}
                onValueChange={handlePriceChange}
              />
              <div className="flex items-center justify-between">
                <div className="grid gap-1">
                  <Label htmlFor="minPrice">Min</Label>
                  <Input
                    id="minPrice"
                    type="number"
                    className="h-8"
                    value={priceRange[0]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        handlePriceChange([value, priceRange[1]]);
                      }
                    }}
                  />
                </div>
                <div className="mx-2 text-muted-foreground">-</div>
                <div className="grid gap-1">
                  <Label htmlFor="maxPrice">Max</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    className="h-8"
                    value={priceRange[1]}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        handlePriceChange([priceRange[0], value]);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="category">
          <AccordionTrigger>Category</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={(filters.category || []).includes(category)}
                    onCheckedChange={(checked) =>
                      handleCategoryChange(category, !!checked)
                    }
                  />
                  <label
                    htmlFor={`category-${category}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="status">
          <AccordionTrigger>Status</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              defaultValue={(filters.status || [])[0] || "all"}
              onValueChange={handleStatusChange}
              className="space-y-2 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="all" id="status-all" />
                <label
                  htmlFor="status-all"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  All
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="status-active" />
                <label
                  htmlFor="status-active"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Active
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="archived" id="status-archived" />
                <label
                  htmlFor="status-archived"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Archived
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="draft" id="status-draft" />
                <label
                  htmlFor="status-draft"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Draft
                </label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="tags">
          <AccordionTrigger>Tags</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              {tags.map((tag) => (
                <div key={tag} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tag-${tag}`}
                    checked={(filters.tags || []).includes(tag)}
                    onCheckedChange={(checked) =>
                      handleTagChange(tag, !!checked)
                    }
                  />
                  <label
                    htmlFor={`tag-${tag}`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {tag}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="date">
          <AccordionTrigger>Date Added</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pt-2">
              <div className="grid gap-2">
                <Label htmlFor="date-from" className="text-sm">
                  From
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-left font-normal h-8"
                      id="date-from"
                    >
                      {dateFrom ? (
                        format(dateFrom, "PPP")
                      ) : (
                        <span className="text-muted-foreground">Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateFrom}
                      onSelect={handleDateFromChange}
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="date-to" className="text-sm">
                  To
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="text-left font-normal h-8"
                      id="date-to"
                    >
                      {dateTo ? (
                        format(dateTo, "PPP")
                      ) : (
                        <span className="text-muted-foreground">Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dateTo}
                      onSelect={handleDateToChange}
                      className="p-3 pointer-events-auto"
                      disabled={(date) => dateFrom ? date < dateFrom : false}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="inStock">
          <AccordionTrigger>Availability</AccordionTrigger>
          <AccordionContent>
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id="in-stock"
                checked={!!filters.inStock}
                onCheckedChange={(checked) =>
                  onFilterChange({ ...filters, inStock: checked })
                }
              />
              <Label htmlFor="in-stock">In stock only</Label>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
