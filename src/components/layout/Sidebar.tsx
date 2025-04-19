
import { cn } from "@/lib/utils";
import { useState } from "react";
import { SidebarNav } from "./SidebarNav";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex h-16 items-center border-b px-4">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-sidebar-foreground animate-fade-in">
            DataFlow
          </h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          className={cn("ml-auto", collapsed && "mx-auto")}
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>
      <SidebarNav collapsed={collapsed} />
    </div>
  );
}
