import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigationMenu from '@/components/layout/NavigationMenu';
import JointApplicantInviteModule from '@/components/JointApplicantInviteModule';
import { Progress } from '@/components/ui/progress';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useForm } from '@/components/ui/form'; // Assuming shadcn form
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label'; // Used for non-Form elements or structure
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from "sonner";

const steps = [
  { id: 1, name: 'Your Details' },
  { id: 2, name: 'Invite Partner' },
  { id: 3, name: 'Verification (KYC)' },
  { id: 4, name: 'Review & Confirm' },
];

const applicantDetailsSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), "Invalid date"),
  address: z.string().min(10, "Address is required"),
});

type ApplicantDetailsFormData = z.infer<typeof applicantDetailsSchema>;

const JointAccountApplicationPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isInvitationSent, setIsInvitationSent] = useState(false);
  const [inviteeIdentifier, setInviteeIdentifier] = useState('');
  const [kycDocs, setKycDocs] = useState<{ primary?: File, secondary?: File }>({});
  const [termsAgreed, setTermsAgreed] = useState(false);

  console.log(`JointAccountApplicationPage loaded, current step: ${currentStep}`);

  const form = useForm<ApplicantDetailsFormData>({
    resolver: zodResolver(applicantDetailsSchema),
    defaultValues: { fullName: '', email: '', dateOfBirth: '', address: '' },
  });

  const progressValue = (currentStep / steps.length) * 100;

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onPrimaryApplicantSubmit = (data: ApplicantDetailsFormData) => {
    console.log('Primary Applicant Details:', data);
    toast.success("Your details saved!");
    handleNextStep();
  };
  
  const handleInviteSent = async (identifier: string) => {
    console.log(`Invite sent to: ${identifier}`);
    setInviteeIdentifier(identifier); // Store for display or review
    setIsInvitationSent(true); // Update state for JointApplicantInviteModule
    // toast.success(`Invitation sent to ${identifier}!`); // Module handles its own toast
    // No automatic next step here, user might want to review or module might control flow
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, applicantType: 'primary' | 'secondary') => {
    if (event.target.files && event.target.files[0]) {
      setKycDocs(prev => ({ ...prev, [applicantType]: event.target.files![0] }));
      toast.info(`Document ${event.target.files[0].name} selected for ${applicantType} applicant.`);
    }
  };

  const handleSubmitApplication = () => {
    if (!termsAgreed) {
      toast.error("Please agree to the terms and conditions.");
      return;
    }
    console.log('Submitting joint account application...');
    console.log('Primary Applicant:', form.getValues());
    console.log('Invited Partner:', inviteeIdentifier);
    console.log('KYC Docs:', kycDocs);
    // AlertDialog will be triggered by button, action inside AlertDialog will navigate or show final message
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavigationMenu />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Progress value={progressValue} className="w-full mb-6" />
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Apply for a Joint Account</h1>
        <p className="text-gray-600 mb-6">Step {currentStep} of {steps.length}: {steps[currentStep - 1].name}</p>

        <div className="bg-white p-6 md:p-8 rounded-lg shadow-md">
          {currentStep === 1 && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onPrimaryApplicantSubmit)} className="space-y-6">
                <h2 className="text-xl font-semibold">Your Details (Primary Applicant)</h2>
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="Enter your full name" {...field} /></FormControl>
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
                      <FormControl><Input type="email" placeholder="Enter your email" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date of Birth</FormLabel>
                      <FormControl><Input type="date" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Address</FormLabel>
                      <FormControl><Textarea placeholder="Enter your full residential address" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Save & Next</Button>
              </form>
            </Form>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Invite Your Partner</h2>
              <JointApplicantInviteModule 
                onInviteSent={handleInviteSent}
                isInvitationSent={isInvitationSent}
              />
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Verification (KYC)</h2>
              <p className="text-gray-600">Please upload identification documents for all applicants. Accepted documents include Passport, Driver's License, or National ID card.</p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="kycPrimary" className="font-medium">Primary Applicant Document</Label>
                  <Input id="kycPrimary" type="file" onChange={(e) => handleFileUpload(e, 'primary')} className="mt-1" />
                  {kycDocs.primary && <p className="text-sm text-green-600 mt-1">Uploaded: {kycDocs.primary.name}</p>}
                </div>
                <div>
                  <Label htmlFor="kycSecondary" className="font-medium">Second Applicant Document (if applicable)</Label>
                  <Input id="kycSecondary" type="file" onChange={(e) => handleFileUpload(e, 'secondary')} className="mt-1" disabled={!isInvitationSent} />
                   {kycDocs.secondary && <p className="text-sm text-green-600 mt-1">Uploaded: {kycDocs.secondary.name}</p>}
                  {!isInvitationSent && <p className="text-xs text-gray-500 mt-1">Please invite partner first for them to upload their documents, or upload on their behalf if provided.</p>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Review & Confirm</h2>
              <div>
                <h3 className="font-medium text-lg">Primary Applicant Details:</h3>
                <p>Name: {form.getValues("fullName") || "N/A"}</p>
                <p>Email: {form.getValues("email") || "N/A"}</p>
                {/* ... more details ... */}
              </div>
              {isInvitationSent && (
                <div>
                  <h3 className="font-medium text-lg">Invited Partner:</h3>
                  <p>Identifier: {inviteeIdentifier || "N/A"}</p>
                </div>
              )}
              <div>
                <h3 className="font-medium text-lg">Uploaded Documents:</h3>
                <p>Primary Applicant: {kycDocs.primary?.name || "Not uploaded"}</p>
                <p>Second Applicant: {kycDocs.secondary?.name || "Not uploaded"}</p>
              </div>
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox id="terms" checked={termsAgreed} onCheckedChange={(checked) => setTermsAgreed(Boolean(checked))} />
                <Label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  I agree to the terms and conditions for a joint account.
                </Label>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button onClick={handleSubmitApplication} disabled={!termsAgreed} className="w-full md:w-auto">Submit Application</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirm Submission</AlertDialogTitle>
                    <AlertDialogDescription>
                      Your joint account application is ready. Once submitted, it will be sent for review.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => {
                      toast.success("Application Submitted!", { description: "We will review your application and get back to you soon."});
                      navigate('/dashboard'); // Or to a dedicated confirmation page
                    }}>
                      Yes, Submit Now
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}

          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handlePreviousStep} disabled={currentStep === 1}>
              Previous
            </Button>
            {currentStep < steps.length && (
                <Button onClick={handleNextStep} disabled={currentStep === 1 && !form.formState.isValid}>Next</Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default JointAccountApplicationPage;