import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Fingerprint, ShieldCheck, LockKeyhole } from 'lucide-react'; // Example icons

interface SecuritySettingItem {
  id: string;
  label: string;
  description?: string;
  icon?: React.ElementType;
  hasToggle?: boolean; // If it's a switch
  actionText?: string; // For button actions like "Change Password"
  onToggle?: (id: string, enabled: boolean) => void;
  onAction?: (id: string) => void;
  initialValue?: boolean;
}

interface SecuritySettingsGroupProps {
  title?: string;
  settings: SecuritySettingItem[];
}

const SecuritySettingsGroup: React.FC<SecuritySettingsGroupProps> = ({
  title = "Security Settings",
  settings,
}) => {
  console.log("Rendering SecuritySettingsGroup with title:", title);

  // Local state to manage toggles if not managed externally
  const [internalToggleStates, setInternalToggleStates] = useState<{ [key: string]: boolean }>(
    settings.reduce((acc, setting) => {
      if (setting.hasToggle) {
        acc[setting.id] = setting.initialValue ?? false;
      }
      return acc;
    }, {} as { [key: string]: boolean })
  );

  const handleToggleChange = (id: string, checked: boolean) => {
    const setting = settings.find(s => s.id === id);
    if (setting?.onToggle) {
      setting.onToggle(id, checked);
    } else {
      setInternalToggleStates(prev => ({ ...prev, [id]: checked }));
      console.log(`Internal toggle for ${id} changed to ${checked}`);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Manage your account security preferences and settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings.map((setting) => {
          const IconComponent = setting.icon;
          const isToggled = setting.onToggle ? setting.initialValue : internalToggleStates[setting.id];

          return (
            <div key={setting.id} className="flex items-center justify-between p-3 rounded-md border hover:bg-muted/20 transition-colors">
              <div className="flex items-center space-x-3">
                {IconComponent && <IconComponent className="h-6 w-6 text-muted-foreground" />}
                <div>
                  <Label htmlFor={setting.hasToggle ? `switch-${setting.id}` : undefined} className="font-medium text-base">
                    {setting.label}
                  </Label>
                  {setting.description && (
                    <p className="text-sm text-muted-foreground">{setting.description}</p>
                  )}
                </div>
              </div>
              {setting.hasToggle && (
                <Switch
                  id={`switch-${setting.id}`}
                  checked={isToggled}
                  onCheckedChange={(checked) => handleToggleChange(setting.id, checked)}
                  aria-label={setting.label}
                />
              )}
              {setting.actionText && setting.onAction && (
                <Button variant="outline" size="sm" onClick={() => setting.onAction && setting.onAction(setting.id)}>
                  {setting.actionText}
                </Button>
              )}
            </div>
          );
        })}
        {settings.length === 0 && (
            <p className="text-muted-foreground text-center">No security settings available.</p>
        )}
      </CardContent>
    </Card>
  );
};

// Example usage (which you'd place in a page component, not here):
/*
const MyPage = () => {
  const exampleSettings: SecuritySettingItem[] = [
    {
      id: '2fa',
      label: 'Two-Factor Authentication',
      description: 'Add an extra layer of security to your account.',
      icon: ShieldCheck,
      hasToggle: true,
      initialValue: true,
      onToggle: (id, enabled) => console.log(`${id} toggled to ${enabled}`),
    },
    {
      id: 'biometric',
      label: 'Biometric Login',
      description: 'Use Face ID or fingerprint to log in.',
      icon: Fingerprint,
      hasToggle: true,
      initialValue: false,
      onToggle: (id, enabled) => console.log(`${id} toggled to ${enabled}`),
    },
    {
      id: 'change-password',
      label: 'Change Password',
      icon: LockKeyhole,
      actionText: 'Change',
      onAction: (id) => console.log(`Action for ${id} triggered`),
    },
  ];
  return <SecuritySettingsGroup settings={exampleSettings} />;
}
*/

export default SecuritySettingsGroup;