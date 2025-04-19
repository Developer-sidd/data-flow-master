
import { Badge } from "@/components/ui/badge";
import { Product } from "@/lib/data";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const getBadgeVariant = (status: string) => {
    switch (status) {
      case "active":
        return "default";
      case "archived":
        return "secondary";
      case "draft":
        return "outline";
      default:
        return "default";
    }
  };

  return (
    <div className="space-y-3">
      <div className="aspect-square bg-secondary/30 rounded-md flex items-center justify-center">
        <div className="text-2xl font-bold text-muted-foreground">
          {product.name.charAt(0)}
        </div>
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium truncate">{product.name}</h3>
          <Badge variant={getBadgeVariant(product.status)}>
            {product.status}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">{product.category}</div>
        <div className="flex items-center justify-between">
          <span className="font-semibold">${product.price}</span>
          <span className="text-xs text-muted-foreground">
            Stock: {product.stock}
          </span>
        </div>
        <div className="flex flex-wrap gap-1 pt-1">
          {product.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
