import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import AccountSummaryCard from '@/components/AccountSummaryCard';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from "sonner"; // For notifications as per page description context
import { PlusCircle, Send, TrendingUp } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [isBalanceMasked, setIsBalanceMasked] = useState(false);

  console.log('DashboardPage loaded');

  const handleViewDetails = (accountId: string) => {
    navigate(`/account-details/${accountId}`);
  };

  const placeholderAccounts = [
    { accountId: 'acc123', accountName: 'Primary Checking', accountType: 'Checking Account', balance: 12500.75, currency: 'USD', lastUpdated: 'Today, 10:30 AM' },
    { accountId: 'acc456', accountName: 'Joint Savings', accountType: 'Savings Account', balance: 45800.50, currency: 'USD', lastUpdated: 'Yesterday, 3:45 PM' },
    { accountId: 'acc789', accountName: 'Holiday Fund', accountType: 'Savings Account', balance: 2100.00, currency: 'USD', lastUpdated: 'Today, 09:00 AM' },
  ];

  const handleQuickAction = (action: string) => {
    toast.info(`Navigating to ${action}...`);
    if (action === 'Make a Payment') navigate('/payments');
    if (action === 'Apply for Joint Account') navigate('/joint-account-application');
    if (action === 'View Insights') console.log('Placeholder for View Insights');
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <main className="flex-grow p-4 md:p-6 lg:p-8 space-y-6">
        <header className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Welcome Back, User!</h1>
            <p className="text-gray-600">Here's your financial overview.</p>
          </div>
          <Avatar>
            <AvatarImage src="https://via.placeholder.com/100/007bff/ffffff?Text=U" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </header>

        <section aria-labelledby="account-summaries-title">
          <div className="flex justify-between items-center mb-4">
            <h2 id="account-summaries-title" className="text-xl font-semibold text-gray-700">Your Accounts</h2>
            <Button variant="outline" size="sm" onClick={() => setIsBalanceMasked(!isBalanceMasked)}>
              {isBalanceMasked ? 'Show Balances' : 'Hide Balances'}
            </Button>
          </div>
          <ScrollArea className="h-[calc(100vh-300px)] md:h-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {placeholderAccounts.map(acc => (
                <AccountSummaryCard
                  key={acc.accountId}
                  accountId={acc.accountId}
                  accountName={acc.accountName}
                  accountType={acc.accountType}
                  balance={acc.balance}
                  currency={acc.currency}
                  lastUpdated={acc.lastUpdated}
                  onViewDetails={handleViewDetails}
                  isMasked={isBalanceMasked}
                  onToggleMask={() => setIsBalanceMasked(!isBalanceMasked)}
                />
              ))}
            </div>
          </ScrollArea>
        </section>

        <section aria-labelledby="quick-actions-title">
          <h2 id="quick-actions-title" className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button size="lg" onClick={() => handleQuickAction('Make a Payment')} className="w-full">
              <Send className="mr-2 h-5 w-5" /> Make a Payment
            </Button>
            <Button size="lg" variant="secondary" onClick={() => handleQuickAction('Apply for Joint Account')} className="w-full">
              <PlusCircle className="mr-2 h-5 w-5" /> Apply for Joint Account
            </Button>
            <Button size="lg" variant="outline" onClick={() => handleQuickAction('View Insights')} className="w-full">
              <TrendingUp className="mr-2 h-5 w-5" /> View Spending Insights
            </Button>
          </div>
        </section>
        
        {/* Placeholder for recent transactions or alerts */}
        <section aria-labelledby="recent-activity-title" className="mt-8">
            <h2 id="recent-activity-title" className="text-xl font-semibold text-gray-700 mb-4">Recent Activity</h2>
            <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-gray-600">Your latest transactions and account alerts will appear here.</p>
                {/* Example of a toast trigger, actual toasts often triggered by actions */}
                <Button variant="ghost" className="mt-2" onClick={() => toast.success("Test Notification!", { description: "This is a sample toast from Sonner." })}>Test Notification</Button>
            </div>
        </section>

      </main>
      {/* Mobile navigation already adds padding-bottom if needed */}
    </div>
  );
};

export default DashboardPage;