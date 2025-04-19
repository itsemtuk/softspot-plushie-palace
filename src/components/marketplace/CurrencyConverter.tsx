
import { useState, useEffect } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Currency } from '@/types/marketplace';
import { DollarSign } from 'lucide-react';

// Mock exchange rates - in a real app, these would come from an API
const exchangeRates: Record<Currency, number> = {
  USD: 1.00,    // Base currency
  EUR: 0.93,    // 1 USD = 0.93 EUR
  GBP: 0.80,    // 1 USD = 0.80 GBP
  JPY: 150.59,  // 1 USD = 150.59 JPY
  CAD: 1.37,    // 1 USD = 1.37 CAD
  AUD: 1.51     // 1 USD = 1.51 AUD
};

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$'
};

interface CurrencyConverterProps {
  price: number;
  className?: string;
}

const CurrencyConverter = ({ price, className }: CurrencyConverterProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [convertedPrice, setConvertedPrice] = useState<number>(price);
  
  useEffect(() => {
    // Convert the price based on the selected currency
    const rate = exchangeRates[selectedCurrency];
    setConvertedPrice(Number((price * rate).toFixed(2)));
  }, [selectedCurrency, price]);
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <DollarSign className="h-4 w-4 text-gray-500" />
      <Select 
        value={selectedCurrency} 
        onValueChange={(value) => setSelectedCurrency(value as Currency)}
      >
        <SelectTrigger className="w-[90px] h-8">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(exchangeRates).map(([currency]) => (
            <SelectItem key={currency} value={currency}>
              {currency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="font-medium">
        {currencySymbols[selectedCurrency]}{convertedPrice}
      </span>
    </div>
  );
};

export default CurrencyConverter;
