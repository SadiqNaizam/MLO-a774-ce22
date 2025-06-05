import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import TransactionListItem from '@/components/TransactionListItem';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Search, Settings } from 'lucide-react';

const AccountDetailsPage = () => {
  const { accountId } = useParams<{ accountId: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  console.log(`AccountDetailsPage loaded for account ID: ${accountId}`);

  // Placeholder data - in a real app, fetch this based on accountId
  const accountDetails = {
    name: accountId === 'acc123' ? 'Primary Checking' : (accountId === 'acc456' ? 'Joint Savings' : 'Generic Account'),
    number: '**** **** **** 1234',
    sortCode: '00-11-22',
    iban: 'GB00 ABCD 00112233445566',
    balance: accountId === 'acc123' ? 12500.75 : (accountId === 'acc456' ? 45800.50 : 5000.00),
    currency: 'USD',
  };

  const placeholderTransactions = [
    { id: 'txn1', date: '2024-07-28', description: 'Salary Deposit', amount: 3500, type: 'credit' as const, status: 'completed' as const },
    { id: 'txn2', date: '2024-07-27', description: 'Grocery Shopping', amount: 75.50, type: 'debit' as const, status: 'completed' as const },
    { id: 'txn3', date: '2024-07-26', description: 'Online Subscription', amount: 12.99, type: 'debit' as const, status: 'pending' as const },
    { id: 'txn4', date: '2024-07-25', description: 'Transfer to Savings', amount: 500, type: 'internal' as const, status: 'completed' as const },
    { id: 'txn5', date: '2024-07-24', description: 'Restaurant Bill', amount: 45.00, type: 'debit' as const, status: 'completed' as const },
  ];

  const filteredTransactions = placeholderTransactions.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <main className="flex-grow p-4 md:p-6 lg:p-8 space-y-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink onClick={() => navigate('/dashboard')}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{accountDetails.name} Details</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <header className="bg-white p-6 rounded-lg shadow">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{accountDetails.name}</h1>
          <p className="text-xl text-green-600 font-semibold">
            {new Intl.NumberFormat('en-US', { style: 'currency', currency: accountDetails.currency }).format(accountDetails.balance)}
          </p>
        </header>

        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="details">Account Details</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="mt-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-grow">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="debit">Debit</SelectItem>
                    <SelectItem value="internal">Internal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ScrollArea className="h-[400px] border rounded-md">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map(tx => (
                    <TransactionListItem
                      key={tx.id}
                      id={tx.id}
                      date={tx.date}
                      description={tx.description}
                      amount={tx.amount}
                      type={tx.type}
                      status={tx.status}
                      currency={accountDetails.currency}
                      onClick={(id) => console.log(`Clicked transaction ${id}`)}
                    />
                  ))
                ) : (
                  <p className="p-4 text-center text-gray-500">No transactions match your criteria.</p>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="details" className="mt-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Account Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><span className="font-medium">Account Number:</span> {accountDetails.number}</div>
                <div><span className="font-medium">Sort Code:</span> {accountDetails.sortCode}</div>
                <div className="md:col-span-2"><span className="font-medium">IBAN:</span> {accountDetails.iban}</div>
              </div>
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" /> Download Statement
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="mt-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow space-y-4">
              <h2 className="text-xl font-semibold text-gray-700">Account Settings</h2>
              <p className="text-gray-600">Manage notifications, alerts, and other settings specific to this account.</p>
              {/* Placeholder for account-specific settings controls */}
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-gray-500" />
                <span>Account settings options will be displayed here.</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AccountDetailsPage;