
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { PlusCircle } from "lucide-react";

export function QuickSellBanner() {
  const navigate = useNavigate();
  
  const handleSellClick = () => {
    navigate('/sell');
  };
  
  return (
    <div className="bg-gradient-to-r from-softspot-500 to-purple-500 rounded-xl p-6 mb-8 text-white">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="text-2xl font-bold mb-2">Start Selling in Minutes</h2>
          <p className="text-softspot-100">List your plushies and reach thousands of collectors</p>
        </div>
        <Button 
          onClick={handleSellClick} 
          className="bg-white text-softspot-500 hover:bg-gray-100 font-bold px-6 py-5"
        >
          <PlusCircle className="w-5 h-5 mr-2" />
          Sell Now
        </Button>
      </div>
    </div>
  );
}
