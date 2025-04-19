
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutGrid,
  Users,
  FileText,
  Settings,
  Home,
  LineChart,
  Package,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarNavProps {
  collapsed: boolean;
}

interface NavItem {
  title: string;
  icon: React.ElementType;
  href: string;
}

const navItems: NavItem[] = [
  {
    title: "Overview",
    icon: Home,
    href: "/",
  },
  {
    title: "Products",
    icon: Package,
    href: "/products",
  },
  {
    title: "Customers",
    icon: Users,
    href: "/customers",
  },
  {
    title: "Reports",
    icon: LineChart,
    href: "/reports",
  },
  {
    title: "Content",
    icon: FileText,
    href: "/content",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
];

export function SidebarNav({ collapsed }: SidebarNavProps) {
  const location = useLocation();

  return (
    <div className="py-4">
      <nav className="space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                collapsed ? "px-2" : "px-3"
              )}
            >
              <Link to={item.href} className="flex items-center">
                <item.icon
                  size={20}
                  className={cn("mr-2", collapsed && "mr-0")}
                />
                {!collapsed && <span>{item.title}</span>}
              </Link>
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
