import React from 'react';
import { ArrowDownLeft, ArrowUpRight, CircleDollarSign } from 'lucide-react'; // Icons for transaction type

interface TransactionListItemProps {
  id: string;
  date: string; // Could be Date object, formatted string for simplicity here
  description: string;
  amount: number;
  currency?: string;
  type: 'debit' | 'credit' | 'internal'; // To determine icon and color
  status?: 'pending' | 'completed' | 'failed';
  onClick?: (id: string) => void;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({
  id,
  date,
  description,
  amount,
  currency = 'USD',
  type,
  status = 'completed',
  onClick,
}) => {
  console.log("Rendering TransactionListItem:", description, id);

  const isDebit = type === 'debit';
  const amountColor = isDebit ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';
  const amountPrefix = isDebit ? '-' : '+';

  const Icon = type === 'debit' ? ArrowUpRight : type === 'credit' ? ArrowDownLeft : CircleDollarSign;

  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(Math.abs(amount));

  return (
    <div
      className={`flex items-center justify-between p-3 sm:p-4 border-b border-border last:border-b-0 ${onClick ? 'cursor-pointer hover:bg-muted/50' : ''} transition-colors`}
      onClick={onClick ? () => onClick(id) : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick(id) : undefined}
    >
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className={`p-2 rounded-full bg-muted ${isDebit ? 'text-red-500' : 'text-green-500'}`}>
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </div>
        <div>
          <p className="font-medium text-sm sm:text-base text-foreground">{description}</p>
          <p className="text-xs sm:text-sm text-muted-foreground">{date}
            {status === 'pending' && <span className="ml-2 text-yellow-500">(Pending)</span>}
            {status === 'failed' && <span className="ml-2 text-red-500">(Failed)</span>}
          </p>
        </div>
      </div>
      <div className={`text-sm sm:text-base font-semibold ${amountColor}`}>
        {amountPrefix}{formattedAmount}
      </div>
    </div>
  );
};

export default TransactionListItem;