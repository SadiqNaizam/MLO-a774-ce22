import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ArrowRight, Eye, EyeOff } from 'lucide-react'; // Example icons

interface AccountSummaryCardProps {
  accountId: string;
  accountName: string;
  accountType: string;
  balance: number;
  currency?: string;
  lastUpdated?: string;
  onViewDetails: (accountId: string) => void;
  isMasked?: boolean; // To control balance visibility
  onToggleMask?: () => void; // Function to toggle mask
}

const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({
  accountId,
  accountName,
  accountType,
  balance,
  currency = 'USD',
  lastUpdated,
  onViewDetails,
  isMasked = false,
  onToggleMask,
}) => {
  console.log("Rendering AccountSummaryCard for account:", accountName, accountId);

  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(balance);

  return (
    <Card className="w-full max-w-md shadow-lg hover:shadow-xl transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{accountName}</CardTitle>
            <CardDescription>{accountType}</CardDescription>
          </div>
          {onToggleMask && (
            <Button variant="ghost" size="icon" onClick={onToggleMask} aria-label={isMasked ? "Show balance" : "Hide balance"}>
              {isMasked ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <p className="text-sm text-muted-foreground">Available Balance</p>
          <p className={`text-3xl font-bold ${isMasked ? 'blur-sm select-none' : ''}`}>
            {isMasked ? `•••••••` : formattedBalance}
          </p>
        </div>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground">Last updated: {lastUpdated}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button variant="outline" onClick={() => onViewDetails(accountId)}>
          View Details <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AccountSummaryCard;