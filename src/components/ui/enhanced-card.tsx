
import React from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface EnhancedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const EnhancedCard = ({ children, className, ...props }: EnhancedCardProps) => {
  return (
    <Card 
      className={cn(
        "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100",
        className
      )} 
      {...props}
    >
      {children}
    </Card>
  );
};
