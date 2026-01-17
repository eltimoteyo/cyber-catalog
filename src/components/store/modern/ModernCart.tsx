"use client";

import { X, Trash2 } from 'lucide-react';
import { Product, TenantConfig } from '@/lib/types';

interface CartItem extends Product {
  quantity: number;
}

interface ModernCartProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  tenant: TenantConfig;
  onRemoveItem: (productId: string) => void;
}

export default function ModernCart({ 
  isOpen, 
  onClose, 
  cart, 
  tenant,
  onRemoveItem 
}: ModernCartProps) {
  if (!isOpen) return null;

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const whatsappNumber = tenant.whatsapp || "51990126720";
  
  const handleCheckout = () => {
    const message = `¡Hola! Quiero hacer un pedido:\n\n${cart.map(item => 
      `• ${item.name} x${item.quantity} - S/${(item.price * item.quantity).toFixed(2)}`
    ).join('\n')}\n\nTotal: S/${total.toFixed(2)}`;
    
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" 
        onClick={onClose} 
      />
      <div className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[60] shadow-2xl p-6 flex flex-col">
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold uppercase tracking-wide">TU BOLSA</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-12">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <X size={32} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">Tu carrito está vacío</p>
              <p className="text-sm text-gray-400 mt-1">Agrega productos para continuar</p>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <img 
                  src={item.imageUrls && item.imageUrls[0] || '/placeholder.svg'} 
                  className="w-20 h-20 rounded-lg object-cover flex-shrink-0" 
                  alt={item.name}
                />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm line-clamp-2">{item.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.quantity} x S/{item.price.toFixed(2)}
                  </p>
                  <p className="text-sm font-bold text-rose-600 mt-1">
                    S/{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
                <button 
                  onClick={() => onRemoveItem(item.id)}
                  className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors h-fit"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="pt-4 border-t mt-auto space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 font-medium">Subtotal</span>
              <span className="text-2xl font-bold">S/{total.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="block w-full bg-black text-white text-center py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg active:scale-[0.98]"
            >
              Confirmar Pedido por WhatsApp
            </button>
          </div>
        )}
      </div>
    </>
  );
}
