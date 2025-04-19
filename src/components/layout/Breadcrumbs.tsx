
import { cn } from "@/lib/utils";
import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

export interface Breadcrumb {
  title: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: Breadcrumb[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm">
        <li>
          <Link
            to="/"
            className="flex items-center text-muted-foreground hover:text-foreground"
          >
            <Home size={16} />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRight
              size={14}
              className="mx-1 text-muted-foreground"
              aria-hidden="true"
            />
            {item.href && index < items.length - 1 ? (
              <Link
                to={item.href}
                className="text-muted-foreground hover:text-foreground"
              >
                {item.title}
              </Link>
            ) : (
              <span className="font-medium text-foreground">
                {item.title}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
