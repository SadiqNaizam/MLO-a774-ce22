import React, { useState } from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from "sonner";
import { Send, History, Repeat } from 'lucide-react';

const paymentSchema = z.object({
  payeeName: z.string().min(1, "Payee name is required"),
  accountNumber: z.string().min(8, "Valid account number required").max(20),
  amount: z.coerce.number().positive("Amount must be positive"),
  reference: z.string().optional(),
  sourceAccount: z.string().min(1, "Source account is required"),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

const PaymentPage = () => {
  const [otpValue, setOtpValue] = useState('');
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  
  console.log('PaymentPage loaded');

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: { payeeName: '', accountNumber: '', amount: 0, reference: '', sourceAccount: 'acc123' },
  });

  const placeholderPaymentHistory = [
    { id: 'pay1', date: '2024-07-25', payee: 'Utility Company', amount: 120.00, status: 'Completed' },
    { id: 'pay2', date: '2024-07-20', payee: 'John Doe', amount: 50.00, status: 'Completed' },
    { id: 'pay3', date: '2024-07-15', payee: 'Online Store', amount: 75.99, status: 'Processing' },
  ];

  const placeholderStandingOrders = [
    { id: 'so1', payee: 'Rent Payment', amount: 1200, frequency: 'Monthly', nextPayment: '2024-08-01' },
    { id: 'so2', payee: 'Gym Membership', amount: 50, frequency: 'Monthly', nextPayment: '2024-08-05' },
  ];

  const handlePaymentSubmit = (data: PaymentFormData) => {
    console.log('Payment Data:', data);
    // In a real app, initiate payment, then on success/OTP requirement:
    setIsOtpDialogOpen(true);
  };

  const handleOtpConfirm = () => {
    if (otpValue.length === 6) { // Assuming 6-digit OTP
      console.log('OTP Submitted:', otpValue);
      setIsOtpDialogOpen(false);
      setOtpValue('');
      form.reset();
      toast.success("Payment Successful!", { description: "Your payment has been processed."});
    } else {
      toast.error("Invalid OTP", { description: "Please enter a 6-digit OTP."});
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <main className="flex-grow p-4 md:p-6 lg:p-8 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Payments</h1>

        <Tabs defaultValue="new-payment" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
            <TabsTrigger value="new-payment"><Send className="mr-2 h-4 w-4 sm:hidden md:inline-block" />New Payment</TabsTrigger>
            <TabsTrigger value="history"><History className="mr-2 h-4 w-4 sm:hidden md:inline-block" />Payment History</TabsTrigger>
            <TabsTrigger value="standing-orders"><Repeat className="mr-2 h-4 w-4 sm:hidden md:inline-block" />Standing Orders</TabsTrigger>
          </TabsList>

          <TabsContent value="new-payment" className="mt-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Make a New Payment</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handlePaymentSubmit)} className="space-y-4 md:space-y-6">
                  <FormField
                    control={form.control}
                    name="sourceAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Account</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger><SelectValue placeholder="Select account to pay from" /></SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="acc123">Primary Checking (Balance: $12,500.75)</SelectItem>
                            <SelectItem value="acc456">Joint Savings (Balance: $45,800.50)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="payeeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payee Name</FormLabel>
                        <FormControl><Input placeholder="Enter payee's full name" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="accountNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payee Account Number</FormLabel>
                        <FormControl><Input placeholder="Enter payee's account number" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (USD)</FormLabel>
                        <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="reference"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reference (Optional)</FormLabel>
                        <FormControl><Input placeholder="e.g., Invoice #123" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full md:w-auto">
                    <Send className="mr-2 h-4 w-4" /> Proceed to Pay
                  </Button>
                </form>
              </Form>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Payment History</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Payee</TableHead>
                    <TableHead className="text-right">Amount (USD)</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderPaymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.payee}</TableCell>
                      <TableCell className="text-right">${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>{payment.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="standing-orders" className="mt-4">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Standing Orders & Direct Debits</h2>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Payee</TableHead>
                    <TableHead className="text-right">Amount (USD)</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Next Payment</TableHead>
                     <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {placeholderStandingOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.payee}</TableCell>
                      <TableCell className="text-right">${order.amount.toFixed(2)}</TableCell>
                      <TableCell>{order.frequency}</TableCell>
                      <TableCell>{order.nextPayment}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">Manage</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button variant="outline" className="mt-4">Set Up New Standing Order</Button>
            </div>
          </TabsContent>
        </Tabs>

        <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Enter OTP</DialogTitle>
              <DialogDescription>
                An OTP has been sent to your registered mobile number. Please enter it below to confirm your payment.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center py-4">
              <InputOTP maxLength={6} value={otpValue} onChange={(value) => setOtpValue(value)}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => { setIsOtpDialogOpen(false); setOtpValue(''); }}>Cancel</Button>
              <Button type="button" onClick={handleOtpConfirm}>Confirm Payment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default PaymentPage;