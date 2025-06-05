import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast'; // Using shadcn's own useToast
import { Send, CheckCircle, Loader2 } from 'lucide-react';

const inviteSchema = z.object({
  inviteeIdentifier: z.string().min(5, "Please enter a valid email or phone number."), // Basic validation
});

type InviteFormData = z.infer<typeof inviteSchema>;

interface JointApplicantInviteModuleProps {
  onInviteSent: (identifier: string) => Promise<void> | void; // Callback when invite is successfully "sent"
  initialInviteeIdentifier?: string;
  isInvitationSent?: boolean; // To show confirmation state
}

const JointApplicantInviteModule: React.FC<JointApplicantInviteModuleProps> = ({
  onInviteSent,
  initialInviteeIdentifier = '',
  isInvitationSent = false,
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [invitationConfirmed, setInvitationConfirmed] = useState(isInvitationSent);
  const [sentToIdentifier, setSentToIdentifier] = useState(initialInviteeIdentifier);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: { inviteeIdentifier: initialInviteeIdentifier }
  });

  console.log("Rendering JointApplicantInviteModule. Invitation sent state:", invitationConfirmed);

  const onSubmit: SubmitHandler<InviteFormData> = async (data) => {
    setIsLoading(true);
    console.log("Attempting to send invite to:", data.inviteeIdentifier);
    try {
      await onInviteSent(data.inviteeIdentifier);
      toast({
        title: "Invitation Sent!",
        description: `An invitation has been sent to ${data.inviteeIdentifier}.`,
        variant: "default", // 'default' instead of 'success' for shadcn ui/toast
      });
      setInvitationConfirmed(true);
      setSentToIdentifier(data.inviteeIdentifier);
      reset({ inviteeIdentifier: '' }); // Clear the input
    } catch (error) {
      console.error("Failed to send invite:", error);
      toast({
        title: "Error Sending Invite",
        description: "Could not send the invitation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (invitationConfirmed) {
    return (
      <div className="p-6 border rounded-lg bg-muted/50 text-center">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold">Invitation Sent</h3>
        <p className="text-muted-foreground">
          An invitation has been successfully sent to <span className="font-medium">{sentToIdentifier}</span>.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => {
          setInvitationConfirmed(false);
          setSentToIdentifier('');
        }}>
          Send Another Invite
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-6 border rounded-lg">
      <div>
        <Label htmlFor="inviteeIdentifier" className="text-base font-semibold">Invite Partner</Label>
        <p className="text-sm text-muted-foreground mb-2">Enter the email address or phone number of the person you want to invite to this joint account.</p>
        <Input
          id="inviteeIdentifier"
          type="text"
          placeholder="Email or Phone Number"
          {...register('inviteeIdentifier')}
          aria-invalid={errors.inviteeIdentifier ? "true" : "false"}
          className={errors.inviteeIdentifier ? "border-red-500" : ""}
        />
        {errors.inviteeIdentifier && (
          <p className="text-sm text-red-500 mt-1">{errors.inviteeIdentifier.message}</p>
        )}
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        {isLoading ? 'Sending...' : 'Send Invite'}
      </Button>
    </form>
  );
};

export default JointApplicantInviteModule;