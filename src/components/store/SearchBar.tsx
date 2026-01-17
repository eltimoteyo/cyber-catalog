"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({ value, onChange, placeholder = "Buscar productos..." }: SearchBarProps) {
  return (
    <div className="relative" role="search">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary/60" aria-hidden="true" />
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar productos"
        className="pl-12 pr-4 py-3 h-12 rounded-full border-2 border-primary/40 bg-background placeholder:text-muted-foreground focus-visible:ring-primary/30 focus-visible:border-primary"
      />
    </div>
  );
}
