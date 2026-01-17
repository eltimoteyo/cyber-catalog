"use client";

import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, Flower2, Flower, Gift, Package, PackageOpen,
  Heart, HeartHandshake, PartyPopper, Candy, CandyCane,
  Cake, CakeSlice, Pizza, Sparkles, Star,
  Crown, Gem, Diamond, CircleDot, Shell,
  LucideIcon
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";

// Map icon names to lucide-react components
const iconMap: Record<string, LucideIcon> = {
  Flower2, Flower, Gift, Package, PackageOpen,
  Heart, HeartHandshake, PartyPopper, Candy, CandyCane,
  Cake, CakeSlice, Pizza, Sparkles, Star,
  Crown, Gem, Diamond, CircleDot, Shell,
  LayoutGrid,
};

// Helper to render icon by name
const IconRenderer = ({ iconName, className = "w-6 h-6" }: { iconName: string; className?: string }) => {
  const IconComponent = iconMap[iconName];
  if (!IconComponent) return <Gift className={className} />; // Fallback icon
  return <IconComponent className={className} />;
};

interface Category {
  value: string;
  label: string;
  icon: string;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function CategoryFilter({ 
  categories, 
  selectedCategory, 
  onCategoryChange 
}: CategoryFilterProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const allCategories = [
    { value: "all", label: "Todos", icon: "LayoutGrid" },
    ...categories,
  ];

  const onSelect = useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    api.on("scroll", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("scroll", onSelect);
    };
  }, [api, onSelect]);

  return (
    <div className="w-full relative">
      {/* Desktop: Flex layout with space-between */}
      <div className="hidden lg:flex justify-between items-start gap-4">
        {allCategories.map((category) => (
          <button
            key={category.value}
            onClick={() => onCategoryChange(category.value)}
            className="flex flex-col items-center gap-2 group flex-1 max-w-[120px]"
            aria-label={`Filtrar por ${category.label}`}
            aria-pressed={selectedCategory === category.value}
          >
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 border-2",
                selectedCategory === category.value
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                  : "bg-secondary text-primary border-primary/30 group-hover:border-primary/60 group-hover:shadow-md"
              )}
            >
              <IconRenderer iconName={category.icon} className="w-6 h-6" />
            </div>
            <span
              className={cn(
                "text-xs font-medium transition-colors whitespace-nowrap font-heading",
                selectedCategory === category.value
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground"
              )}
            >
              {category.label}
            </span>
          </button>
        ))}
      </div>
      
      {/* Mobile/Tablet: Carousel */}
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          dragFree: true,
        }}
        className="w-full lg:hidden"
      >
        <CarouselContent className="-ml-3 md:-ml-4">
          {allCategories.map((category) => (
            <CarouselItem key={category.value} className="pl-3 md:pl-4 basis-auto">
              <button
                onClick={() => onCategoryChange(category.value)}
                className="flex flex-col items-center gap-2 group"
                aria-label={`Filtrar por ${category.label}`}
                aria-pressed={selectedCategory === category.value}
              >
                <div
                  className={cn(
                    "w-16 h-16 rounded-full flex items-center justify-center transition-all duration-200 border-2",
                    selectedCategory === category.value
                      ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/25"
                      : "bg-secondary text-primary border-primary/30 group-hover:border-primary/60 group-hover:shadow-md"
                  )}
                >
                  <IconRenderer iconName={category.icon} className="w-6 h-6" />
                </div>
                <span
                  className={cn(
                    "text-xs font-medium transition-colors whitespace-nowrap font-heading",
                    selectedCategory === category.value
                      ? "text-primary"
                      : "text-muted-foreground group-hover:text-foreground"
                  )}
                >
                  {category.label}
                </span>
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
        {canScrollPrev && (
          <CarouselPrevious 
            className="absolute -left-2 top-8 -translate-y-1/2 h-8 w-8 border-0 bg-background/90 backdrop-blur-sm shadow-md hover:bg-background"
            variant="ghost"
          />
        )}
        {canScrollNext && (
          <CarouselNext 
            className="absolute -right-2 top-8 -translate-y-1/2 h-8 w-8 border-0 bg-background/90 backdrop-blur-sm shadow-md hover:bg-background"
            variant="ghost"
          />
        )}
      </Carousel>
    </div>
  );
}
