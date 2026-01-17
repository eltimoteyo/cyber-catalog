"use client";

import { useState, useEffect } from "react";
import { Package, Phone, MoreVertical } from "lucide-react";
import { FaTiktok, FaInstagram, FaFacebook } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import { TenantConfig } from "@/lib/types";

interface CatalogHeaderProps {
  tenant: TenantConfig;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
}

export default function CatalogHeader({ tenant, searchQuery = "", onSearchChange }: CatalogHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  const whatsappFormatted = tenant.whatsapp?.replace("51", "+51 ").replace(/(\d{3})(\d{3})(\d{3})/, "$1 $2 $3") || "";

  const navLinks = [
    { label: "Productos", href: "#productos", icon: Package, isNew: true },
    { 
      label: whatsappFormatted, 
      href: `tel:+${tenant.whatsapp}`, 
      icon: Phone, 
      isNew: false, 
      isPhone: true 
    },
  ];

  const socialLinks = [
    { label: "TikTok", href: tenant.socialMedia?.tiktok || "#", icon: FaTiktok },
    { label: "Instagram", href: tenant.socialMedia?.instagram || "#", icon: FaInstagram },
    { label: "Facebook", href: tenant.socialMedia?.facebook || "#", icon: FaFacebook },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`bg-background px-4 sticky top-0 z-40 overflow-visible transition-all duration-300 ${
      isScrolled ? "py-3" : "py-4"
    }`} role="banner">
      <div className="container px-0">
        <div className="flex justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className={`relative h-full transition-all duration-300 ${
              isScrolled 
                ? "w-[82px] md:w-[102px] lg:w-[122px]" 
                : "w-[116px] md:w-[144px] lg:w-[173px]"
            }`}>
              <div className={`absolute left-0 rounded-full transition-all duration-300 ${
                isScrolled 
                  ? "w-[82px] md:w-[102px] lg:w-[122px] -top-4 px-0 md:px-2" 
                  : "w-[116px] md:w-[144px] lg:w-[173px] -top-6 px-0 md:px-3"
              }`} style={{ background: 'white' }}>
                {tenant.logo ? (
                  <img
                    src={tenant.logo}
                    alt={`${tenant.name} Logo`}
                    className="w-full h-full object-cover rounded-full transition-all duration-300"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {tenant.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Center - show nav on md+ */}
          <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="relative text-foreground/80 hover:text-foreground transition-colors font-heading flex items-center gap-2"
              >
                {link.isNew && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] text-primary font-semibold">
                    New
                  </span>
                )}
                {link.isPhone && <Phone className="h-4 w-4" />}
                {link.label}
              </a>
            ))}
            {/* Social Media Icons */}
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-foreground/80 hover:text-primary transition-colors"
                    aria-label={social.label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </nav>

          {/* Actions - search (lg+ inline) and menu (mobile) */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="hidden md:block w-full max-w-md">
              <SearchBar 
                value={searchQuery}
                onChange={onSearchChange || (() => {})}
                placeholder="Buscar..."
              />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 md:hidden p-1">
                  <MoreVertical className="text-foreground" style={{ width: '32px', height: '32px' }} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-background border border-border shadow-lg">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <DropdownMenuItem key={link.label} asChild>
                      <a
                        href={link.href}
                        className="flex items-center gap-3 cursor-pointer font-heading"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{link.label}</span>
                        {link.isNew && (
                          <span className="ml-auto text-[10px] text-primary font-semibold">
                            New
                          </span>
                        )}
                      </a>
                    </DropdownMenuItem>
                  );
                })}
                <div className="border-t border-border my-1" />
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <DropdownMenuItem key={social.label} asChild>
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 cursor-pointer font-heading"
                      >
                        <Icon className="h-4 w-4" />
                        <span>{social.label}</span>
                      </a>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
