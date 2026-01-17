"use client";

import { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
}

const HERO_SLIDES: HeroSlide[] = [
  { 
    id: 1, 
    image: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=2000", 
    title: "REGALA EMOCIONES", 
    subtitle: "Nueva Colección 2025", 
    cta: "Consultar Promo" 
  },
  { 
    id: 2, 
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&q=80&w=2000", 
    title: "DESAYUNOS MÁGICOS", 
    subtitle: "Empieza el día con amor", 
    cta: "Ver Menú" 
  },
  { 
    id: 3, 
    image: "https://images.unsplash.com/photo-1522333649692-04e46359f518?auto=format&fit=crop&q=80&w=2000", 
    title: "FLORES PREMIUM", 
    subtitle: "Detalles que enamoran", 
    cta: "Pedir Ahora" 
  }
];

export default function ModernHero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <div className="relative h-[45vh] min-h-[420px] w-full overflow-hidden rounded-b-[2.5rem] shadow-sm pt-20 md:pt-24 group">
      {HERO_SLIDES.map((s, index) => (
        <div 
          key={s.id} 
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
          <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />
        </div>
      ))}
      
      <div className="absolute inset-0 z-20 flex flex-col justify-end pb-14 px-6 container mx-auto pointer-events-none">
        <div className="max-w-4xl animate-fade-in-up pointer-events-auto">
          <span className="inline-block px-3 py-1 mb-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white text-[10px] md:text-xs font-bold uppercase tracking-[0.2em]">
            {slide.subtitle}
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl text-white tracking-wide leading-[1] mb-3 uppercase drop-shadow-md">
            {slide.title}
          </h1>
          <a 
            href="#productos" 
            className="group flex items-center gap-2 bg-white text-black px-6 py-2.5 md:px-8 md:py-3 rounded-full font-bold text-xs md:text-sm hover:bg-rose-500 hover:text-white transition-all shadow-lg w-fit"
          >
            {slide.cta} <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      
      <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center gap-2">
        {HERO_SLIDES.map((_, index) => (
          <button 
            key={index} 
            onClick={() => setCurrentSlide(index)} 
            className={`h-1.5 rounded-full transition-all duration-300 ${currentSlide === index ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} 
          />
        ))}
      </div>
    </div>
  );
}
