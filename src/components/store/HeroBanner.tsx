"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Gift, Truck, Heart, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TenantConfig } from "@/lib/types";

interface Slide {
  title: string;
  subtitle: string;
  description: string;
  gradient: string;
  icon: LucideIcon;
}

interface HeroBannerProps {
  tenant: TenantConfig;
}

export default function HeroBanner({ tenant }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Slides personalizados o por defecto
  const slides: Slide[] = [
    {
      title: tenant.name,
      subtitle: "DETALLES PERSONALIZADOS",
      description: "Regalos únicos y especiales",
      gradient: "from-accent/40 to-secondary/60",
      icon: Gift,
    },
    {
      title: "Hacemos envíos a todo el Perú",
      subtitle: "ENTREGA SEGURA Y RÁPIDA",
      description: "Envíos gratis desde S/100",
      gradient: "from-primary/20 to-accent/40",
      icon: Truck,
    },
    {
      title: "Hechos con Amor",
      subtitle: "DETALLES QUE ENAMORAN",
      description: "Regalos personalizados",
      gradient: "from-secondary/60 to-primary/20",
      icon: Heart,
    },
  ];

  const totalSlides = slides.length;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  return (
    <>
      {/* Carousel visible on all screen sizes */}
      <div className="relative w-full md:h-[45vh] lg:h-[55vh] overflow-hidden px-4 md:px-0">
        {/* Mobile container - infinite carousel effect */}
        <div className="md:hidden relative w-full pt-6 pb-8 overflow-hidden container py-4 px-2">
          <div 
            className="flex gap-3 transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 312}px)` }}
          >
            {/* Render all slides plus first two for seamless loop */}
            {[...slides, slides[0], slides[1]].map((slide, idx) => {
              const IconComponent = slide.icon;
              return (
                <Card 
                  key={idx}
                  className={`flex-shrink-0 w-[300px] min-w-[300px] h-[133px] bg-gradient-to-br ${slide.gradient} border border-primary/20 shadow-lg overflow-hidden rounded-lg flex flex-col items-start justify-center p-3`}
                >
                  <div className="relative z-10">
                    <h2 className="text-sm font-bold text-foreground mb-1 line-clamp-1">{slide.title}</h2>
                    <p className="text-[10px] text-muted-foreground mb-1 line-clamp-1">{slide.subtitle}</p>
                    <p className="text-[10px] text-foreground/80 mb-2 line-clamp-1">{slide.description}</p>
                    <Button 
                      className="rounded-full px-2 py-0.5 text-[10px] h-6 bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                      <IconComponent className="w-3 h-3 mr-1" />
                      Ver
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Mobile dots indicator - bottom center */}
        <div className="md:hidden absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1 z-30">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                index === currentSlide ? "bg-primary w-4" : "bg-primary/30"
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>

        {/* Desktop container - full size cards */}
        <div className="hidden md:block h-full">
          {/* Slide 1: Bella Sorpresa */}
          {currentSlide === 0 && (
            <Card className="w-full h-full bg-gradient-to-br from-accent/40 to-secondary/60 border-0 shadow-none transition-all duration-700 overflow-hidden rounded-none">
              <div className="relative w-full h-full flex items-center justify-between px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-6 md:py-12">
                {/* Decorative circles - desktop only */}
                <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[25vw] h-[25vw] max-w-[300px] max-h-[300px] bg-primary/20 rounded-full hidden lg:flex items-center justify-center">
                  <div className="w-[80%] h-[80%] bg-primary/10 rounded-full flex items-center justify-center">
                    <Gift className="w-20 h-20 text-primary/40" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-xl">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 animate-fade-in">{tenant.name}</h2>
                  <p className="text-xs md:text-sm tracking-[0.2em] text-muted-foreground mb-4">DETALLES PERSONALIZADOS</p>
                  <p className="text-base md:text-lg text-foreground/80 mb-6">Regalos únicos y especiales para cada ocasión</p>
                  <Button 
                    className="rounded-full px-6 py-4 text-base bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Ver Catálogo
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Slide 2: Envíos Gratis */}
          {currentSlide === 1 && (
            <Card className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/40 border-0 shadow-none transition-all duration-700 overflow-hidden rounded-none">
              <div className="relative w-full h-full flex items-center justify-between px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-6 md:py-12">
                {/* Decorative circles - desktop only */}
                <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[25vw] h-[25vw] max-w-[300px] max-h-[300px] bg-primary/20 rounded-full hidden lg:flex items-center justify-center">
                  <div className="w-[80%] h-[80%] bg-primary/10 rounded-full flex items-center justify-center">
                    <Truck className="w-20 h-20 text-primary/40" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-xl">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 animate-fade-in">Hacemos envíos a todo el Perú</h2>
                  <p className="text-xs md:text-sm tracking-[0.2em] text-muted-foreground mb-4">ENTREGA SEGURA Y RÁPIDA</p>
                  <p className="text-base md:text-lg text-foreground/80 mb-6">Envíos gratis desde S/100</p>
                  <Button 
                    className="rounded-full px-6 py-4 text-base bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Truck className="w-4 h-4 mr-2" />
                    Ver Catálogo
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Slide 3: Hechos con Amor */}
          {currentSlide === 2 && (
            <Card className="w-full h-full bg-gradient-to-br from-secondary/60 to-primary/20 border-0 shadow-none transition-all duration-700 overflow-hidden rounded-none">
              <div className="relative w-full h-full flex items-center justify-between px-6 md:px-12 lg:px-16 xl:px-24 2xl:px-32 py-6 md:py-12">
                {/* Decorative circles - desktop only */}
                <div className="absolute right-[5%] top-1/2 -translate-y-1/2 w-[25vw] h-[25vw] max-w-[300px] max-h-[300px] bg-primary/20 rounded-full hidden lg:flex items-center justify-center">
                  <div className="w-[80%] h-[80%] bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-20 h-20 text-primary/40" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-xl">
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 animate-fade-in">Hechos con Amor</h2>
                  <p className="text-xs md:text-sm tracking-[0.2em] text-muted-foreground mb-4">DETALLES QUE ENAMORAN</p>
                  <p className="text-base md:text-lg text-foreground/80 mb-6">Cada regalo personalizado especialmente para ti</p>
                  <Button 
                    className="rounded-full px-6 py-4 text-base bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Ver Catálogo
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* Navigation arrows - desktop only */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/50 hover:bg-background/80 z-20"
            onClick={goToPrev}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-background/50 hover:bg-background/80 z-20"
            onClick={goToNext}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Dots indicator - desktop bottom center */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-30">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide ? "bg-primary w-5" : "bg-primary/30 hover:bg-primary/50"
                }`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          {/* Side thumbnails - desktop only */}
          <div className="hidden lg:flex flex-col gap-2 absolute right-6 top-1/2 -translate-y-1/2 z-30">
            {slides.map((slide, index) => {
              const IconComponent = slide.icon;
              return (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-12 h-12 rounded-lg overflow-hidden transition-all duration-300 flex items-center justify-center ${
                    currentSlide === index
                      ? "ring-2 ring-primary scale-110 bg-background"
                      : "bg-background/60 hover:bg-background/80"
                  }`}
                >
                  <IconComponent
                    className={`w-5 h-5 ${
                      currentSlide === index ? "text-primary" : "text-muted-foreground"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
