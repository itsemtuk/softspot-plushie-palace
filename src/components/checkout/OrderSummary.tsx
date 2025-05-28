
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { MarketplacePlushie } from '@/types/marketplace';

interface OrderSummaryProps {
  items: MarketplacePlushie[];
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
  collapsible?: boolean;
}

export function OrderSummary({
  items,
  subtotal,
  shippingCost,
  tax,
  total,
  collapsible = true
}: OrderSummaryProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  
  const toggleCollapse = () => {
    if (collapsible) {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
      <div 
        className="p-4 border-b border-gray-100 flex justify-between items-center"
        onClick={toggleCollapse}
      >
        <h3 className="font-medium text-lg">Order Summary</h3>
        {collapsible && (
          <button className="text-gray-500">
            {isCollapsed ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
          </button>
        )}
      </div>
      
      <div className={collapsible && isCollapsed ? "hidden" : "block"}>
        <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
          {items.map((item) => {
            // Ensure price is a number with fallback
            const itemPrice = typeof item.price === 'number' ? item.price : 0;
            
            return (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.brand || 'Unknown brand'}</p>
                </div>
                <div className="text-sm font-medium">${itemPrice.toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="p-4 space-y-2 bg-gray-50">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>
        <div className="h-px bg-gray-200 my-2" />
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span className="text-lg">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
