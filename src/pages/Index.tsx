
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, LineChart, FileText } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  
  const dashboardItems = [
    {
      title: "Products",
      description: "Manage your product inventory with advanced filtering and sorting options.",
      icon: <Package className="h-8 w-8" />,
      path: "/products",
    },
    {
      title: "Customers",
      description: "View and manage customer information and purchase history.",
      icon: <Users className="h-8 w-8" />,
      path: "/customers",
    },
    {
      title: "Reports",
      description: "Access analytics and insights about your business performance.",
      icon: <LineChart className="h-8 w-8" />,
      path: "/reports",
    },
    {
      title: "Content",
      description: "Create and manage content for your website and marketing materials.",
      icon: <FileText className="h-8 w-8" />,
      path: "/content",
    },
  ];
  
  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">DataFlow Master</h1>
        <p className="text-muted-foreground">
          Welcome to your dashboard. Explore the various modules below.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardItems.map((item, index) => (
          <Card key={item.title} className="hover:shadow-md transition-shadow animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
            <CardHeader>
              <div className="p-2 w-fit rounded-md bg-primary/10 text-primary mb-2">
                {item.icon}
              </div>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => navigate(item.path)}>
                {item.title === "Products" ? "Explore Now" : "Coming Soon"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="pt-6 text-center text-muted-foreground">
        <p>
          This dashboard demonstrates advanced data handling capabilities with full-featured UI controls.
        </p>
      </div>
    </div>
  );
};

export default Index;
