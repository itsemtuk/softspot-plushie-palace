
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CheckCircle, Download, Home, ShoppingBag } from "lucide-react";
import { MarketplacePlushie } from "@/types/marketplace";

interface OrderConfirmationProps {
  orderId: string;
  items: MarketplacePlushie[];
  total: number;
  estimatedDelivery: string;
}

export function OrderConfirmation({
  orderId,
  items,
  total,
  estimatedDelivery
}: OrderConfirmationProps) {
  const navigate = useNavigate();
  
  return (
    <div className="py-6">
      <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Thank You!</h1>
        <p className="text-gray-600 mb-4">Your order has been received</p>
        
        <div className="bg-gray-50 rounded p-4 mb-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-left">
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-medium">{orderId}</p>
            </div>
            <div className="text-left">
              <p className="text-sm text-gray-500">Estimated Delivery</p>
              <p className="font-medium">{estimatedDelivery}</p>
            </div>
          </div>
        </div>
        
        <div className="text-left mb-6">
          <h3 className="font-medium mb-3">Order Summary</h3>
          <div className="space-y-3 max-h-48 overflow-y-auto">
            {items.map(item => (
              <div key={item.id} className="flex items-center space-x-3">
                <div className="w-14 h-14 bg-gray-100 rounded overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                </div>
                <div className="text-sm font-medium">${item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <span className="font-medium">Total</span>
            <span className="font-bold">${total.toFixed(2)}</span>
          </div>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button 
            className="flex items-center justify-center gap-2"
            onClick={() => {/* Download receipt logic */}}
          >
            <Download className="w-4 h-4" />
            Download Receipt
          </Button>
          
          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2"
              onClick={() => navigate('/')}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Home</span>
              <span className="sm:hidden">Home</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="flex items-center justify-center gap-2"
              onClick={() => navigate('/marketplace')}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Continue Shopping</span>
              <span className="sm:hidden">Shop</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
