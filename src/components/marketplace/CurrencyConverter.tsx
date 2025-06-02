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
const exchangeRates: Record<string, number> = {
  USD: 1.00,    // Base currency
  EUR: 0.93,    // 1 USD = 0.93 EUR
  GBP: 0.80,    // 1 USD = 0.80 GBP
  JPY: 150.59,  // 1 USD = 150.59 JPY
  CAD: 1.37,    // 1 USD = 1.37 CAD
  AUD: 1.51,    // 1 USD = 1.51 AUD
  CNY: 7.23,    // 1 USD = 7.23 CNY
  INR: 83.12    // 1 USD = 83.12 INR
};

const currencySymbols: Record<string, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  CAD: 'C$',
  AUD: 'A$',
  CNY: '¥',
  INR: '₹'
};

const getCurrencyIcon = (currency: string) => {
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
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('USD');
  const [convertedPrice, setConvertedPrice] = useState<number>(price);
  
  useEffect(() => {
    if (
      typeof price !== 'number' ||
      !exchangeRates[fromCurrency] ||
      !exchangeRates[toCurrency]
    ) {
      setConvertedPrice(0);
      return;
    }
    // Convert from 'fromCurrency' to USD, then to 'toCurrency'
    const priceInUSD = price / exchangeRates[fromCurrency];
    const result = priceInUSD * exchangeRates[toCurrency];
    setConvertedPrice(Number(result.toFixed(2)));
  }, [fromCurrency, toCurrency, price]);
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="flex items-center gap-1">
        {getCurrencyIcon(fromCurrency)}
        <Select 
          value={fromCurrency} 
          onValueChange={(value) => setFromCurrency(value)}
        >
          <SelectTrigger className="w-[80px] h-8 bg-white">
            <SelectValue placeholder="From" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {Object.keys(exchangeRates).map((currency) => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </span>
      <span className="font-medium">{currencySymbols[fromCurrency]}{price}</span>
      <span className="mx-1">→</span>
      <span className="flex items-center gap-1">
        {getCurrencyIcon(toCurrency)}
        <Select 
          value={toCurrency} 
          onValueChange={(value) => setToCurrency(value)}
        >
          <SelectTrigger className="w-[80px] h-8 bg-white">
            <SelectValue placeholder="To" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {Object.keys(exchangeRates).map((currency) => (
              <SelectItem key={currency} value={currency}>
                {currency}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </span>
      <span className="font-medium">
        {convertedPrice > 0 ? `${currencySymbols[toCurrency]}${convertedPrice}` : ''}
      </span>
    </div>
  );
};

export default CurrencyConverter;
