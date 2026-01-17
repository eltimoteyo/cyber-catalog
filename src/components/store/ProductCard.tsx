"use client";

import { useState } from "react";
import { Send, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product, TenantConfig } from "@/lib/types";
import { getWhatsAppLink } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
  tenant: TenantConfig;
  isExpanded?: boolean;
  onExpand?: () => void;
  onCollapse?: () => void;
}

export default function ProductCard({ 
  product, 
  tenant,
  isExpanded, 
  onExpand, 
  onCollapse 
}: ProductCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const images = product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls : [];
  const whatsappNumber = tenant.whatsapp || "51990126720";

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const message = `¡Hola! 👋 Me interesa el producto: *${product.name}* - S/ ${product.price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}. ¿Está disponible?`;
    window.open(getWhatsAppLink(whatsappNumber, message), '_blank');
  };

  const handleCardClick = () => {
    if (!isExpanded && onExpand) {
      onExpand();
    }
  };

  const handleClose = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onCollapse) {
      onCollapse();
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  if (isExpanded) {
    return (
      <Card className="overflow-hidden col-span-full animate-fade-in">
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-3 right-3 z-10 bg-card/90 backdrop-blur-sm hover:bg-card rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
          
          <div className="flex flex-col md:flex-row">
            {/* Left side - Image */}
            <div className="relative w-full md:w-1/2 bg-muted flex items-center justify-center">
              <div className="w-full aspect-square">
                <img
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              
              {product.category && (
                <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-medium border-0">
                  {product.category}
                </Badge>
              )}

              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-card/90 backdrop-blur-sm hover:bg-card rounded-full"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-card/90 backdrop-blur-sm hover:bg-card rounded-full"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                  
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {images.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors ${
                          index === currentImageIndex ? 'bg-primary' : 'bg-card/60'
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Right side - Details */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-center space-y-5">
              <h2 className="font-bold text-xl md:text-2xl text-foreground">
                {product.name}
              </h2>
              
              {product.description && (
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              )}
              
              <p className="text-2xl md:text-3xl font-bold text-foreground">
                S/ {product.price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              
              <Button
                onClick={handleWhatsAppClick}
                className="w-full gap-2 py-3 h-auto text-base bg-green-600 hover:bg-green-700"
              >
                <Send className="w-5 h-5 flex-shrink-0" />
                <span>Iniciar pedido</span>
              </Button>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className="overflow-hidden group flex flex-col h-full cursor-pointer rounded-2xl border-0 shadow-card hover:shadow-card-hover transition-shadow duration-300"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden bg-muted flex-shrink-0 aspect-square rounded-t-2xl">
        <img
          src={images[0] || '/placeholder.svg'}
          alt={`${product.name} - Regalo personalizado`}
          className={`w-full h-full object-cover group-hover:scale-105 transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          width="400"
          height="400"
          onLoad={() => setImageLoaded(true)}
        />
        {product.category && (
          <Badge className="absolute top-3 right-3 bg-primary text-primary-foreground text-xs font-medium border-0 rounded-full px-3">
            {product.category}
          </Badge>
        )}
      </div>
      <CardContent className="p-4 space-y-2 flex flex-col flex-grow">
        <h3 className="font-normal text-base line-clamp-2 text-foreground leading-snug">
          {product.name}
        </h3>
        <p className="text-lg font-bold text-primary">
          S/ {product.price.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        <Button
          onClick={handleWhatsAppClick}
          variant="outline"
          className="w-full gap-2 mt-auto rounded-full text-sm h-9 border-green-600 text-green-600 hover:bg-green-50"
        >
          <Send className="w-4 h-4 flex-shrink-0" />
          <span>Pedir</span>
        </Button>
      </CardContent>
    </Card>
  );
}
