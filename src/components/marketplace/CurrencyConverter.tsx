
import { useState, useEffect } from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Currency } from '@/types/marketplace';
import { 
  DollarSign, 
  Euro, 
  IndianRupee, 
  JapaneseYen, 
  PoundSterling,
  SquareAsterisk,
  CircleDollarSign
} from 'lucide-react';

// Mock exchange rates - in a real app, these would come from an API
const exchangeRates: Record<Currency, number> = {
  USD: 1.00,    // Base currency
  EUR: 0.93,    // 1 USD = 0.93 EUR
  GBP: 0.80,    // 1 USD = 0.80 GBP
  JPY: 150.59,  // 1 USD = 150.59 JPY
  CAD: 1.37,    // 1 USD = 1.37 CAD
  AUD: 1.51,    // 1 USD = 1.51 AUD
  CNY: 7.23,    // 1 USD = 7.23 CNY
  INR: 83.12    // 1 USD = 83.12 INR
};

const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CNY: '¥',
  INR: '₹'
};

const getCurrencyIcon = (currency: Currency) => {
  switch (currency) {
    case 'USD':
      return <DollarSign className="h-4 w-4" />;
    case 'EUR':
      return <Euro className="h-4 w-4" />;
    case 'GBP':
      return <PoundSterling className="h-4 w-4" />;
    case 'JPY':
      return <JapaneseYen className="h-4 w-4" />;
    case 'INR':
      return <IndianRupee className="h-4 w-4" />;
    case 'CAD':
    case 'AUD':
      return <CircleDollarSign className="h-4 w-4" />;
    case 'CNY':
      return <SquareAsterisk className="h-4 w-4" />;
    default:
      return <DollarSign className="h-4 w-4" />;
  }
};

interface CurrencyConverterProps {
  price: number;
  className?: string;
}

const CurrencyConverter = ({ price, className }: CurrencyConverterProps) => {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>('USD');
  const [convertedPrice, setConvertedPrice] = useState<number>(price);
  
  useEffect(() => {
    const rate = exchangeRates[selectedCurrency];
    setConvertedPrice(Number((price * rate).toFixed(2)));
  }, [selectedCurrency, price]);
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {getCurrencyIcon(selectedCurrency)}
      <Select 
        value={selectedCurrency} 
        onValueChange={(value) => setSelectedCurrency(value as Currency)}
      >
        <SelectTrigger className="w-[90px] h-8 bg-white">
          <SelectValue placeholder="Currency" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {Object.entries(exchangeRates).map(([currency]) => (
            <SelectItem key={currency} value={currency}>
              {currency}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <span className="font-medium">
        {price > 0 ? `${currencySymbols[selectedCurrency]}${convertedPrice}` : ''}
      </span>
    </div>
  );
};

export default CurrencyConverter;
