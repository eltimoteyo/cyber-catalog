"use client";

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import Image from "next/image";
import {
  Layers,
  LayoutDashboard,
  Utensils,
  ShoppingCart,
  Calendar,
  BarChart3,
  ChevronRight,
  ExternalLink,
  Globe,
  Zap,
  ShieldCheck,
  Menu,
  Box,
  Smartphone,
  Laptop,
  CheckCircle2,
  X,
  Bell,
  MessageSquare,
  FileText,
  Search,
  Users,
  Clock,
  Palette,
  Layout,
  Link as LinkIcon,
  Filter,
  DollarSign,
  Instagram,
  Facebook,
  Share2,
  TrendingUp,
  Target,
  Bot,
  Tablet,
  Receipt,
  Package,
  Cpu,
  Download,
  Stethoscope,
  Activity,
  Lightbulb,
  Cloud
} from 'lucide-react';

// --- COMPONENTE LOGO ONTURN ---
const Logo = ({ dark = false, size = "md" }) => {
  const primaryColor = "#00A896"; // Turquesa
  const secondaryColor = dark ? "#FFFFFF" : "#003366"; // Azul/Blanco
  
  const iconHeight = size === "lg" ? 40 : 28;
  const iconWidth = size === "lg" ? 64 : 44;
  const fontSize = size === "lg" ? "text-4xl" : "text-2xl";
  const strokeWidth = size === "lg" ? 3 : 2.5;

  return (
    <div className="flex items-center gap-0.5 select-none tracking-tighter">
      <div className="flex items-center justify-center mr-0.5">
        <svg width={iconWidth} height={iconHeight} viewBox="0 0 44 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.5" y="1.5" width="41" height="25" rx="12.5" stroke={primaryColor} strokeWidth={strokeWidth} fill="none" />
            <circle cx="31" cy="14" r="7" fill={primaryColor} />
        </svg>
      </div>
      <div className="flex items-center pb-1">
          <span className={`${fontSize} font-extrabold`} style={{ color: primaryColor, marginLeft: -2 }}>n</span>
          <span className={`${fontSize} font-extrabold`} style={{ color: secondaryColor }}>Turn</span>
      </div>
    </div>
  );
};

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const [activeErpModule, setActiveErpModule] = useState('restaurant');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleResize = () => setIsMobile(window.innerWidth < 1024);

    // Initial check
    handleResize();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const erpModules: Record<string, { title: string; desc: string; icon: React.ReactNode; color: string; features: string[] }> = {
    restaurant: {
      title: 'Restaurante Inteligente',
      desc: 'Brazo robótico en mesa, menú en tablet y sistema KDS integrado para cocina.',
      icon: <Utensils />,
      color: 'from-orange-500 to-red-600',
      features: ['Autogestión en Mesa', 'KDS con Teclado Especial', 'Pago QR Directo']
    },
    pos: {
      title: 'Punto de Venta Híbrido',
      desc: 'Venta simultánea de productos y servicios (Bodegas, Ferreterías, Consultoría).',
      icon: <ShoppingCart />,
      color: 'from-cyan-500 to-blue-600',
      features: ['Control de Almacén', 'Venta de Servicios e Intalaciones', 'Sincronización Cloud']
    },
    facturacion: {
      title: 'Facturación Electrónica',
      desc: 'Emisión de comprobantes legales integrada o independiente.',
      icon: <Receipt />,
      color: 'from-emerald-500 to-teal-600',
      features: ['Validez Legal SUNAT/Dian', 'Envío Automático', 'Reportes Tributarios']
    },
    admin: {
      title: 'Gestión & ERP',
      desc: 'Administración total: Compras, Almacenes, Estadísticas y Configuración.',
      icon: <LayoutDashboard />,
      color: 'from-purple-500 to-indigo-600',
      features: ['Compras y Proveedores', 'Kardex de Almacén', 'Dashboard Estadístico']
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] text-white selection:bg-cyan-500/30 overflow-x-hidden">

      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute top-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-600/5 blur-[150px] rounded-full transition-transform duration-1000"
          style={{ transform: `translateY(${scrollY * 0.1}px)` }}
        ></div>
        <div
          className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-900/10 blur-[130px] rounded-full"
          style={{ transform: `translateY(${scrollY * -0.05}px)` }}
        ></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-[#020408]/80 backdrop-blur-2xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <div className="w-14 h-14 flex items-center justify-center transform group-hover:scale-110 transition-all duration-500">
                <Image 
                  src="/images/createam-cloud-logo.svg" 
                  alt="Createam Logo" 
                  width={56} 
                  height={56}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-black tracking-tight leading-none" style={{ fontFamily: '"Days One", sans-serif' }}>
                Createam
              </span>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-10 text-[11px] font-bold uppercase tracking-[0.2em]" style={{ fontFamily: '"Days One", sans-serif' }}>
            <a href="#on-turn" className="hover:text-cyan-400 transition-colors">Gestión de Turnos</a>
            <a href="#catalogo" className="hover:text-cyan-400 transition-colors">Catálogo Digital</a>
            <a href="#erp" className="hover:text-cyan-400 transition-colors">POS Integral</a>
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden p-2 text-white">
            <Menu size={28} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#020408] flex flex-col items-center justify-center space-y-8 animate-fade-in lg:hidden" style={{ fontFamily: '"Days One", sans-serif' }}>
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-white">
            <X size={32} />
          </button>
          <a href="#on-turn" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black hover:text-cyan-400 transition-colors">Gestión de Turnos</a>
          <a href="#catalogo" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black hover:text-cyan-400 transition-colors">Catálogo Digital</a>
          <a href="#erp" onClick={() => setIsMenuOpen(false)} className="text-3xl font-black hover:text-cyan-400 transition-colors">POS Integral</a>
        </div>
      )}

      {/* HERO SECTION */}
      <header className="relative pt-32 md:pt-64 pb-32 min-h-[90vh] flex flex-col items-center">
        <div className="container mx-auto px-6 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
            Ecosistema de Soluciones Cloud
          </div>

          <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.85] animate-slide-up">
            Tu negocio, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-blue-500">
              sin fronteras.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-gray-400 text-lg md:text-xl mb-12 font-medium opacity-80 leading-relaxed">
            Plataformas SaaS diseñadas para convertir la tecnología en rentabilidad. <br />
            Personaliza tu presencia, escala tus ventas y domina tu mercado.
          </p>
        </div>
      </header>

      {/* SECTION 1: ONTURN - Gestión de Turnos */}
      <section id="on-turn" className="py-32 relative border-t border-white/5 overflow-hidden">
        {/* PARALLAX DECORATIVE OBJECTS */}
        <div
          className="absolute right-[5%] top-[10%] opacity-20 text-cyan-500 pointer-events-none transition-transform duration-300"
          style={{ transform: `translateY(${scrollY * 0.15}px) rotate(${scrollY * 0.02}deg)` }}
        >
          <Bell size={120} strokeWidth={1} />
        </div>
        <div
          className="absolute left-[10%] bottom-[20%] opacity-10 text-blue-500 pointer-events-none transition-transform duration-300"
          style={{ transform: `translateY(${scrollY * -0.1}px) rotate(${scrollY * -0.01}deg)` }}
        >
          <Calendar size={180} strokeWidth={1} />
        </div>
        <div
          className="absolute right-[15%] bottom-[10%] opacity-10 text-cyan-300 pointer-events-none transition-transform duration-300"
          style={{ transform: `translateY(${scrollY * 0.05}px)` }}
        >
          <FileText size={100} strokeWidth={1} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <div className="mb-10">
                <Logo size="lg" />
              </div>

              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight">
                <span className="text-cyan-400">El tiempo en tus manos.</span>
              </h2>

              <p className="text-xl text-gray-300 font-bold mb-6 italic leading-relaxed">
                &quot;Ya no es necesario que tus clientes vayan físicamente a sacar un turno.&quot;
              </p>

              <p className="text-lg text-gray-400 leading-relaxed mb-10 max-w-xl">
                Tus clientes encuentran su establecimiento favorito y reservan en segundos. Ganas presencia digital, evitas errores de digitación y gestionas todo bajo un flujo de estados inteligente: <b className="text-cyan-400">Hall, Espera y Atendido.</b>
              </p>

              {/* GRID DE BENEFICIOS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div className="space-y-6">
                  <h4 className="text-cyan-400 font-black uppercase tracking-[0.2em] text-xs">Para el Negocio</h4>
                  <ul className="space-y-4">
                    {[
                      { icon: <Globe size={16} />, t: 'Presencia Online 24/7' },
                      { icon: <ShieldCheck size={16} />, t: 'Cero errores de digitación' },
                      { icon: <BarChart3 size={16} />, t: 'Historial de atención completo' }
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-300 group">
                        <div className="text-cyan-500 bg-cyan-500/10 p-2 rounded-lg group-hover:bg-cyan-500 group-hover:text-black transition-all">
                          {item.icon}
                        </div>
                        {item.t}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-6">
                  <h4 className="text-blue-400 font-black uppercase tracking-[0.2em] text-xs">Para el Cliente</h4>
                  <ul className="space-y-4">
                    {[
                      { icon: <Bell size={16} />, t: 'Push Notifications directas' },
                      { icon: <Activity size={16} />, t: 'Seguimiento en tiempo real' },
                      { icon: <Download size={16} />, t: 'Resultados descargables' }
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-300 group">
                        <div className="text-blue-400 bg-blue-400/10 p-2 rounded-lg group-hover:bg-blue-400 group-hover:text-black transition-all">
                          {item.icon}
                        </div>
                        {item.t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CARD ESPECIALIZADA SALUD */}
              <div className="relative group overflow-hidden bg-gradient-to-br from-cyan-950/40 to-black/40 p-8 rounded-[3rem] border border-white/5 mb-12 backdrop-blur-md">
                <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:opacity-20 transition-opacity duration-700">
                  <Stethoscope size={200} />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-cyan-500/20 p-3 rounded-2xl border border-cyan-500/20">
                    <Stethoscope className="text-cyan-400" size={24} />
                  </div>
                  <h4 className="text-xl font-black">Especial para Consultorios</h4>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                  Ideal para el sector salud: Los pacientes no solo reservan, sino que acceden a sus resultados médicos en tiempo real, ven el detalle de su reunión y descargan sus archivos PDF de forma segura.
                </p>
              </div>

              <button className="w-full md:w-auto px-12 py-5 bg-white text-black rounded-full font-black uppercase tracking-widest text-sm hover:bg-cyan-400 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-white/5 group">
                SOLICITAR ACCESO ONTURN <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* VISTA SMARTPHONE PARALLAX */}
            <div className="lg:w-1/2 w-full mt-32 lg:mt-0 relative flex justify-center" style={{ transform: isMobile ? 'none' : `translateY(${scrollY * -0.03}px)` }}>

              {/* Floating Status Indicator */}
              <div className="absolute -top-12 left-4 md:-left-20 bg-[#020408] border border-cyan-500/30 p-6 rounded-[2.5rem] shadow-2xl z-30 animate-float">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-ping absolute inset-0"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full relative"></div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Estado en Vivo</p>
                    <p className="font-black text-white">EN ATENCIÓN</p>
                  </div>
                </div>
              </div>

              {/* Simulated Device */}
              <div className="relative w-full max-w-[320px] aspect-[9/19] bg-[#1a1c20] rounded-[3.5rem] border-[10px] border-[#1a1c20] shadow-[0_50px_100px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="absolute inset-0 bg-[#0a0c10] flex flex-col">
                  {/* App Header */}
                  <div className="pt-12 px-6 pb-6 bg-gradient-to-br from-cyan-600 to-blue-800">
                    <div className="flex justify-between items-center mb-6">
                      <Menu className="text-white" size={20} />
                      <div className="w-8 h-8 rounded-full bg-white/20"></div>
                    </div>
                    <h3 className="text-white font-black text-2xl tracking-tight">OnTurn</h3>
                    <p className="text-cyan-200 text-xs font-bold mt-1">Hola, Ana García</p>
                  </div>

                  {/* App Content */}
                  <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-hide">

                    {/* Active Ticket */}
                    <div className="bg-white/5 border border-cyan-500/20 p-5 rounded-3xl relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-3">
                        <Zap size={14} className="text-cyan-400" />
                      </div>
                      <p className="text-[9px] font-black text-cyan-400 uppercase tracking-widest mb-1">Turno Actual</p>
                      <h4 className="text-white font-black">Consultorio general</h4>
                      <div className="flex items-baseline gap-2 mt-4">
                        <span className="text-4xl font-black text-white">A-24</span>
                        <span className="text-xs text-gray-500 font-bold">Posición: 2</span>
                      </div>
                    </div>

                    {/* Notifications Simulation */}
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Notificaciones</p>
                      <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5 animate-pulse">
                        <Bell size={14} className="text-yellow-400" />
                        <p className="text-[10px] font-bold">¡Tu turno está próximo! Faltan 5 min.</p>
                      </div>
                    </div>

                    {/* Medical History Section */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Historial de turnos</p>
                        <span className="text-[9px] text-cyan-400 font-bold">Ver Todo</span>
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white/5 rounded-lg">
                            <FileText size={14} className="text-gray-400" />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold text-white">Analítica General</p>
                            <p className="text-[9px] text-gray-500">14 Enero, 2024</p>
                          </div>
                        </div>
                        <button className="p-2 bg-cyan-400 text-black rounded-lg">
                          <Download size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Quick Link to WhatsApp */}
                    <div className="mt-4 p-4 bg-[#25D366]/10 rounded-2xl border border-[#25D366]/20 flex items-center justify-center gap-2">
                      <MessageSquare size={14} className="text-[#25D366] fill-current" />
                      <span className="text-[10px] font-black text-[#25D366]">CONSULTA VÍA WHATSAPP</span>
                    </div>

                  </div>
                </div>
              </div>

              {/* Floating Parallax Icon: Push Notification Pop-up */}
              <div
                className="absolute -right-4 top-2/3 md:top-1/2 md:-right-10 bg-white text-black p-4 rounded-2xl shadow-2xl z-40 max-w-[150px] md:max-w-[180px] block"
                style={{ transform: isMobile ? 'none' : `translateY(${scrollY * -0.1}px)` }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Bell size={14} className="text-cyan-600 animate-swing" />
                  <span className="text-[10px] font-black text-cyan-600">OnTurn</span>
                </div>
                <p className="text-[11px] font-bold leading-tight italic">&quot;Srta. Ana, el Dr. Arana ya la espera en el consultorio 204.&quot;</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: CATALOGO DIGITAL */}
      <section id="catalogo" className="py-32 relative bg-[#05070a] border-y border-white/5 overflow-hidden">
        <div
          className="absolute -right-20 top-0 text-fuchsia-500/5 transition-transform duration-300 pointer-events-none"
          style={{ transform: isMobile ? 'none' : `translateY(${scrollY * 0.12}px) rotate(15deg)` }}
        >
          <ShoppingCart size={800} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-20">
            <div className="lg:w-1/2">
              <h2 className="text-5xl font-black mb-6 tracking-tight leading-tight">Catálogo Digital: <br /> <span className="text-fuchsia-500">Más ventas, cero comisiones.</span></h2>

              <p className="text-xl text-white font-medium mb-6">Tu tienda virtual propia, personalizada y conectada a WhatsApp.</p>

              <p className="text-lg text-gray-400 leading-relaxed mb-8">
                Atrae clientes desde tus redes sociales y dales una experiencia de compra fluida. El cliente busca, filtra y envía su pedido directamente a tu WhatsApp listo para el pago.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-sm">
                <div className="flex items-center gap-3">
                  <Target className="text-fuchsia-500" />
                  <span className="font-bold">Imagen Profesional 24/7</span>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp className="text-fuchsia-500" />
                  <span className="font-bold">Llega a más personas</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="text-fuchsia-400 bg-fuchsia-400/10 p-2 rounded-lg"><LinkIcon size={18} /></div>
                  <span className="text-xs font-bold text-gray-300">Dominio Propio o subdominio</span>
                </div>
                <div className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <div className="text-fuchsia-400 bg-fuchsia-400/10 p-2 rounded-lg"><Palette size={18} /></div>
                  <span className="text-xs font-bold text-gray-300">Personaliza Colores y Banners</span>
                </div>
              </div>

              <Link href="/registro">
                <button className="px-10 py-5 bg-fuchsia-600 text-white rounded-full font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all flex items-center gap-2 shadow-2xl shadow-fuchsia-600/30 group">
                  Empieza tu Tienda <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
            </div>

            <div className="lg:w-1/2 w-full mt-12 lg:mt-0 relative" style={{ transform: isMobile ? 'none' : `translateY(${scrollY * 0.08}px)` }}>
              <div className="relative mx-auto w-full max-w-[320px] aspect-[9/19.5] z-20">

                {/* Floating Social Icons */}
                <div className="absolute left-0 md:-left-16 top-12 bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 p-4 rounded-2xl shadow-2xl animate-bounce z-30" style={{ animationDuration: '3s' }}>
                  <Instagram className="text-white" size={24} />
                </div>
                <div className="absolute right-0 md:-right-12 top-20 bg-black p-4 rounded-2xl shadow-2xl animate-bounce z-30 border border-white/20" style={{ animationDuration: '3.8s' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </div>
                <div className="absolute right-4 md:-right-16 top-1/2 bg-[#1877F2] p-4 rounded-2xl shadow-2xl animate-bounce z-30" style={{ animationDuration: '4.5s' }}>
                  <Facebook className="text-white" size={24} />
                </div>
                <div className="absolute right-8 md:-right-8 bottom-32 bg-[#25D366] p-4 rounded-2xl shadow-2xl animate-bounce z-30" style={{ animationDuration: '4.2s' }}>
                  <MessageSquare className="text-white fill-current" size={24} />
                </div>

                <div className="relative w-full h-full bg-gray-900 rounded-[3.5rem] border-[12px] border-[#1a1c20] shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden">
                  <div className="w-full h-full bg-white flex flex-col pt-8 overflow-y-auto scrollbar-hide">
                    <div className="h-40 w-full bg-gray-100 overflow-hidden relative">
                      <img src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=600&q=80" className="w-full h-full object-cover" alt="Banner" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                        <span className="text-white font-black text-2xl tracking-tighter uppercase">MI BOUTIQUE</span>
                      </div>
                    </div>
                    <div className="p-5 flex-1 bg-gray-50/30">
                      <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="bg-white rounded-2xl p-2 shadow-sm border border-gray-100">
                            <div className="aspect-square bg-gray-200 rounded-xl mb-2 overflow-hidden">
                              <img src={`https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=150&q=80`} className="w-full h-full object-cover" alt="Prod" />
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded mb-1"></div>
                            <span className="text-[10px] font-black text-fuchsia-600">$45.00</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-5 bg-white border-t border-gray-100 flex items-center justify-center">
                      <div className="w-full h-10 bg-green-500 rounded-xl flex items-center justify-center gap-2 text-white font-black text-[10px] shadow-lg animate-pulse">
                        <MessageSquare size={16} /> PEDIR POR WHATSAPP
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: ALL-IN-ONE ERP & MODULOS */}
      <section id="erp" className="py-32 relative overflow-hidden bg-[#020408]">
        <div className="absolute left-[-10%] top-20 text-cyan-500/10 transition-transform duration-500 pointer-events-none">
          <Bot size={400} />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-7xl font-black mb-6 tracking-tighter">
              Ecosistema <span className="text-cyan-500">POS Modular</span>
            </h2>
            <p className="text-gray-500 max-w-3xl mx-auto text-lg font-medium mb-8">
              Todo lo que tu negocio necesita en una sola nube. Activa solo lo que usas: desde una bodega básica hasta un restaurante con <b>inteligencia robótica</b>.
            </p>
            <button className="px-10 py-5 bg-cyan-400 text-black rounded-full font-black uppercase tracking-widest text-sm hover:bg-white hover:text-[#003366] transition-all inline-flex items-center gap-3 shadow-2xl shadow-cyan-400/20 group">
              Ver Planes y Precios <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 items-start">
            {/* Sidebar ERP */}
            <div className="lg:col-span-4 space-y-4 sticky top-32">
              {Object.entries(erpModules).map(([key, mod]) => (
                <button
                  key={key}
                  onClick={() => setActiveErpModule(key)}
                  className={`group w-full text-left p-6 rounded-3xl border transition-all duration-500 flex items-center gap-6 ${activeErpModule === key
                    ? 'bg-gradient-to-r from-white/10 to-transparent border-white/20 shadow-2xl'
                    : 'bg-transparent border-transparent opacity-40 hover:opacity-100'
                    }`}
                >
                  <div className={`p-4 rounded-2xl transition-all duration-500 ${activeErpModule === key ? `bg-gradient-to-br ${mod.color} text-white scale-110 shadow-lg` : 'bg-white/5 text-gray-500'}`}>
                    {React.cloneElement(mod.icon as React.ReactElement, { size: 24 })}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-black">{mod.title}</h4>
                    {activeErpModule === key && <p className="text-[11px] text-gray-400 mt-1 font-bold leading-tight">{mod.desc}</p>}
                  </div>
                </button>
              ))}
            </div>

            {/* Preview ERP */}
            <div className="lg:col-span-8">
              <div className="relative min-h-[600px] lg:min-h-0 lg:aspect-video bg-[#1a1c20] rounded-[3rem] border-[12px] border-[#1a1c20] shadow-[0_40px_100px_rgba(0,0,0,0.6)] overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br opacity-20 z-10 transition-all duration-700 ${erpModules[activeErpModule].color}`}></div>
                <div className="w-full h-full p-10 flex flex-col animate-fade-in" key={activeErpModule}>
                  <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${erpModules[activeErpModule].color} text-white`}>{erpModules[activeErpModule].icon}</div>
                      <h3 className="text-2xl font-black tracking-tight uppercase">{erpModules[activeErpModule].title}</h3>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col lg:grid lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-8 bg-white/5 rounded-3xl border border-white/5 p-8 backdrop-blur-md">
                      <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-4">Funciones Destacadas</h5>
                      <ul className="space-y-4">
                        {erpModules[activeErpModule].features.map((f, i) => (
                          <li key={i} className="flex items-center gap-3 text-sm font-bold text-gray-300">
                            <div className="w-2 h-2 rounded-full bg-cyan-500"></div> {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="lg:col-span-4 bg-white/5 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center p-4">
                      <BarChart3 className="text-white/20 mb-2" size={40} />
                      <span className="text-[10px] font-black text-gray-500 uppercase">Analítica</span>
                      <p className="text-[10px] font-bold mt-1">Reportes en Tiempo Real</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Restaurant Tablet Floating View */}
              {activeErpModule === 'restaurant' && (
                <div className="relative mt-8 mx-auto right-auto bottom-auto lg:absolute lg:-right-8 lg:-bottom-8 w-64 aspect-[4/3] bg-gray-900 rounded-3xl border-[8px] border-[#1a1c20] shadow-2xl z-20 animate-slide-up overflow-hidden p-4 flex flex-col">
                  <div className="bg-orange-500/10 p-2 rounded-lg border border-orange-500/20 mb-4 flex items-center gap-2">
                    <Bot size={16} className="text-orange-400" />
                    <span className="text-[8px] font-black uppercase tracking-widest text-orange-400">Brazo Robótico Activo</span>
                  </div>
                  <div className="flex-1 bg-white/5 rounded-xl border border-white/5 p-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">Menu Digital</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-10 bg-white/5 rounded-lg border border-white/5"></div>
                      <div className="h-10 bg-white/5 rounded-lg border border-white/5"></div>
                    </div>
                  </div>
                  <div className="mt-4 h-8 bg-orange-600 rounded-xl flex items-center justify-center text-[10px] font-black tracking-widest text-white">PAGAR EN MESA (QR)</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER / CREATEAM.IO */}
      <footer className="pt-32 pb-16 relative">
        <div className="container mx-auto px-4 md:px-6">
          <div className="relative rounded-[4rem] bg-gradient-to-tr from-[#0a0c10] to-[#020408] border border-white/5 p-8 md:p-16 overflow-hidden">
            <div className="absolute -top-24 -right-24 opacity-[0.05] text-cyan-500 pointer-events-none">
              <Cpu size={500} />
            </div>

            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
                Ingeniería que trasciende <br />
                <span className="text-cyan-400">bajo tus propias reglas.</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-400 mb-12 leading-relaxed font-medium">
                ¿Buscas una solución a medida? Nuestro equipo elite en <b>createam.io</b> construye arquitecturas únicas para los desafíos más complejos.
              </p>
              <a
                href="https://createam.io"
                target="_blank"
                className="bg-white text-black px-12 py-5 rounded-full font-black text-lg hover:bg-cyan-400 transition-all flex items-center gap-4 group shadow-xl shadow-white/5"
              >
                Conoce Createam.io <ExternalLink size={20} className="group-hover:rotate-12 transition-transform" />
              </a>
            </div>
          </div>

          <div className="mt-32 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] gap-8">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Sistemas Operativos en la Nube
            </div>
            <div>© 2024 CREATEAM.CLOUD // Ecosistema SaaS Modular</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Términos</a>
              <a href="#" className="hover:text-white transition-colors">Privacidad</a>
            </div>
          </div>
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes swing {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(10deg); }
          75% { transform: rotate(-10deg); }
        }
        .animate-fade-in { animation: fade-in 1s ease-out forwards; }
        .animate-slide-up { animation: slide-up 1.2s ease-out forwards; }
        .animate-float { animation: float 6s ease-in-out infinite; }
        .animate-swing { animation: swing 2s ease-in-out infinite; }
        html { scroll-behavior: smooth; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      ` }} />
    </div>
  );
}
