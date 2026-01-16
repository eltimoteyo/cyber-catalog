import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Store, Zap, Globe, Palette, Shield, TrendingUp } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Store className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Createam</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="hover:text-primary">Características</Link>
            <Link href="#pricing" className="hover:text-primary">Precios</Link>
            <Link href="/login" className="hover:text-primary">Iniciar Sesión</Link>
            <Link href="/registro">
              <Button>Crear Tienda Gratis</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-background to-muted">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Crea tu Tienda Online<br />
            <span className="text-primary">en Minutos</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Lanza tu e-commerce con dominio personalizado, diseño único y gestión de productos simplificada.
            Sin conocimientos técnicos necesarios.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registro">
              <Button size="lg" className="text-lg px-8">
                Empezar Gratis
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Todo lo que necesitas para vender online
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Globe className="h-12 w-12 text-primary" />}
              title="Dominio Personalizado"
              description="Usa tu propio dominio o un subdominio de createam.cloud. Tu marca, tu identidad."
            />
            <FeatureCard 
              icon={<Palette className="h-12 w-12 text-primary" />}
              title="Diseño Personalizable"
              description="Configura colores, logo y estilo de tu tienda sin tocar código."
            />
            <FeatureCard 
              icon={<Zap className="h-12 w-12 text-primary" />}
              title="Configuración Rápida"
              description="Empieza a vender en menos de 5 minutos. Setup automático y guiado."
            />
            <FeatureCard 
              icon={<Shield className="h-12 w-12 text-primary" />}
              title="Seguro y Confiable"
              description="Infraestructura robusta con Firebase. Tus datos siempre protegidos."
            />
            <FeatureCard 
              icon={<TrendingUp className="h-12 w-12 text-primary" />}
              title="SEO Optimizado"
              description="Posiciona tu tienda en Google. Tecnología Next.js para máximo rendimiento."
            />
            <FeatureCard 
              icon={<Store className="h-12 w-12 text-primary" />}
              title="Gestión Simplificada"
              description="Panel admin intuitivo. Agrega productos, categorías y configura WhatsApp."
            />
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">
            Planes Transparentes
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <PricingCard 
              name="Básico"
              price="$19"
              features={[
                "Subdominio createam.cloud",
                "Hasta 50 productos",
                "Personalización básica",
                "Soporte por email"
              ]}
            />
            <PricingCard 
              name="Pro"
              price="$49"
              popular
              features={[
                "Dominio personalizado",
                "Productos ilimitados",
                "Personalización completa",
                "Soporte prioritario",
                "Analytics avanzados"
              ]}
            />
            <PricingCard 
              name="Enterprise"
              price="Custom"
              features={[
                "Múltiples tiendas",
                "API personalizada",
                "Soporte dedicado",
                "SLA garantizado"
              ]}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para empezar a vender?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Únete a cientos de negocios que ya venden con Createam
          </p>
          <Link href="/registro">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Crear Mi Tienda Ahora
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2026 Createam. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-6 border rounded-lg hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

function PricingCard({ name, price, features, popular }: { name: string; price: string; features: string[]; popular?: boolean }) {
  return (
    <div className={`p-8 border rounded-lg ${popular ? 'border-primary shadow-xl scale-105' : ''}`}>
      {popular && <div className="text-primary font-semibold mb-2">Más Popular</div>}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        {price !== "Custom" && <span className="text-muted-foreground">/mes</span>}
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="text-primary mt-1">✓</span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <Button className="w-full" variant={popular ? "default" : "outline"}>
        Elegir Plan
      </Button>
    </div>
  );
}
