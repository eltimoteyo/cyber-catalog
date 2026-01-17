"use client";

import { Facebook, Instagram, Settings } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TenantConfig } from "@/lib/types";

interface FooterProps {
  tenant: TenantConfig;
}

export default function Footer({ tenant }: FooterProps) {
  return (
    <footer className="bg-card border-t border-border mt-12">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Created By Section */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground order-3 md:order-1">
            <span>Created by</span>
            <a 
              href="https://createam.io/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <span className="font-medium text-foreground">createam.io</span>
            </a>
          </div>

          {/* Social Media Links */}
          <div className="flex items-center gap-4 order-1 md:order-2">
            <span className="text-sm text-muted-foreground">Síguenos:</span>
            <div className="flex gap-3">
              {tenant.socialMedia?.facebook && (
                <a
                  href={tenant.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
              )}
              {tenant.socialMedia?.instagram && (
                <a
                  href={tenant.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              )}
              {tenant.socialMedia?.tiktok && (
                <a
                  href={tenant.socialMedia.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                  aria-label="TikTok"
                >
                  <FaTiktok size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Admin Link */}
          <Link href="/tenant-admin" className="order-2 md:order-3">
            <Button variant="outline" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span>Administrar Productos</span>
            </Button>
          </Link>
        </div>

        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} {tenant.name}. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
}
