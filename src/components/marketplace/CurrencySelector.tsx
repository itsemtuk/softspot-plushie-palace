
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DollarSign, Euro, PoundSterling, Yen } from "lucide-react";

export function CurrencySelector() {
  const [currency, setCurrency] = useState("USD");

  const currencies = [
    { code: "USD", symbol: "$", label: "US Dollar", icon: DollarSign },
    { code: "EUR", symbol: "€", label: "Euro", icon: Euro },
    { code: "GBP", symbol: "£", label: "British Pound", icon: PoundSterling },
    { code: "JPY", symbol: "¥", label: "Japanese Yen", icon: Yen },
  ];

  const currentCurrency = currencies.find(c => c.code === currency);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center space-x-1">
          {currentCurrency && <currentCurrency.icon className="h-4 w-4" />}
          <span>{currency}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {currencies.map((curr) => (
          <DropdownMenuItem
            key={curr.code}
            onClick={() => setCurrency(curr.code)}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <curr.icon className="h-4 w-4" />
            <span>{curr.symbol} {curr.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
