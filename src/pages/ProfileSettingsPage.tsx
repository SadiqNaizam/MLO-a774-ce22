import React from 'react';
import NavigationMenu from '@/components/layout/NavigationMenu';
import SecuritySettingsGroup from '@/components/SecuritySettingsGroup';
import type { SecuritySettingItem } from '@/components/SecuritySettingsGroup'; // Import type if needed for props
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useForm } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from "sonner";
import { UserCircle, ShieldCheck, Bell, Smartphone, FileText, LifeBuoy, Fingerprint, LockKeyhole } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Valid phone number required"),
  address: z.string().min(5, "Address is required"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileSettingsPage = () => {
  console.log('ProfileSettingsPage loaded');

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: 'Demo User',
      email: 'demo.user@example.com',
      phoneNumber: '555-123-4567',
      address: '123 Main St, Anytown, USA',
    },
  });

  const handleProfileSave = (data: ProfileFormData) => {
    console.log('Profile Data Saved:', data);
    toast.success("Profile Updated", { description: "Your personal information has been saved."});
  };

  const securitySettings: SecuritySettingItem[] = [
    {
      id: '2fa',
      label: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account.',
      icon: ShieldCheck,
      hasToggle: true,
      initialValue: true,
      onToggle: (id, enabled) => toast.info(`2FA ${enabled ? 'enabled' : 'disabled'}.`),
    },
    {
      id: 'biometric',
      label: 'Biometric Login',
      description: 'Use Face ID or fingerprint for faster login.',
      icon: Fingerprint,
      hasToggle: true,
      initialValue: false,
      onToggle: (id, enabled) => toast.info(`Biometric login ${enabled ? 'enabled' : 'disabled'}.`),
    },
    {
      id: 'change-password',
      label: 'Change Password',
      icon: LockKeyhole,
      actionText: 'Change',
      onAction: (id) => toast.info('Navigating to change password screen... (Placeholder)'),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <NavigationMenu />
      <main className="flex-grow p-4 md:p-6 lg:p-8 space-y-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Profile & Settings</h1>

        {/* Personal Information Section */}
        <section aria-labelledby="personal-info-title" className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-20 w-20">
              <AvatarImage src="https://via.placeholder.com/150/007bff/ffffff?Text=DU" alt="Demo User" />
              <AvatarFallback>DU</AvatarFallback>
            </Avatar>
            <div>
              <h2 id="personal-info-title" className="text-xl font-semibold text-gray-700">Personal Information</h2>
              <p className="text-sm text-gray-500">Manage your contact details and address.</p>
            </div>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleProfileSave)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl><Input type="email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input type="tel" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Save Profile</Button>
            </form>
          </Form>
        </section>

        {/* Security Settings Section */}
        <SecuritySettingsGroup title="Account Security" settings={securitySettings} />

        {/* Accordion for Other Settings */}
        <Accordion type="single" collapsible className="w-full bg-white p-0 rounded-lg shadow">
          <AccordionItem value="notifications">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center space-x-3">
                    <Bell className="h-5 w-5 text-primary"/>
                    <span className="font-semibold text-gray-700 text-lg">Notification Preferences</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0 space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="email-notifications" className="flex-grow">Email Notifications</Label>
                <Switch id="email-notifications" defaultChecked onCheckedChange={(c) => toast.info(`Email notifications ${c ? 'ON' : 'OFF'}`)}/>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-md">
                <Label htmlFor="sms-notifications" className="flex-grow">SMS Alerts</Label>
                <Switch id="sms-notifications" onCheckedChange={(c) => toast.info(`SMS alerts ${c ? 'ON' : 'OFF'}`)}/>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="linked-devices">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-primary"/>
                    <span className="font-semibold text-gray-700 text-lg">Linked Devices</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0">
              <p className="text-gray-600">You are currently logged in on: This Device (Chrome, Mac OS).</p>
              <Button variant="outline" size="sm" className="mt-2" onClick={() => toast.info("Manage devices clicked (Placeholder)")}>Manage Devices</Button>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="legal-support">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
                <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-primary"/>
                    <span className="font-semibold text-gray-700 text-lg">Legal & Support</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-4 pt-0 space-y-2">
              <Button variant="link" className="p-0 h-auto text-primary" onClick={() => toast.info("Viewing Terms & Conditions...")}>Terms & Conditions</Button><br/>
              <Button variant="link" className="p-0 h-auto text-primary" onClick={() => toast.info("Viewing Privacy Policy...")}>Privacy Policy</Button><br/>
              <Button variant="link" className="p-0 h-auto text-primary" onClick={() => toast.info("Contacting Support...")}><LifeBuoy className="mr-2 h-4 w-4"/>Contact Support</Button>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </main>
    </div>
  );
};

export default ProfileSettingsPage;