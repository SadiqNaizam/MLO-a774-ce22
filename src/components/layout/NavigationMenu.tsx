import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'; // Assuming react-router-dom for navigation
import { Home, CreditCard, User, PlusCircle, Settings, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'; // For mobile drawer

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/payments', label: 'Payments', icon: CreditCard },
  { href: '/accounts/new', label: 'New Account', icon: PlusCircle },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const NavigationMenu: React.FC = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  console.log("Rendering NavigationMenu, current path:", location.pathname);

  const isActive = (path: string) => location.pathname === path;

  // Mobile Navigation (Bottom Tab Bar style)
  const MobileNav = () => (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-t-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.slice(0, 4).map((item) => ( // Show first 4 items, rest in a "more" menu or drawer
          <Link
            key={item.label}
            to={item.href}
            className={`flex flex-col items-center justify-center p-2 rounded-md transition-colors ${
              isActive(item.href)
                ? 'text-primary'
                : 'text-muted-foreground hover:text-primary'
            }`}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            <item.icon className="h-6 w-6" />
            <span className="text-xs mt-1">{item.label}</span>
          </Link>
        ))}
        {/* Mobile Menu Drawer Trigger */}
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="flex flex-col items-center justify-center p-2 text-muted-foreground hover:text-primary">
              <Menu className="h-6 w-6" />
              <span className="text-xs mt-1">More</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-auto p-0">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Menu</h2>
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center space-x-3 p-3 rounded-md transition-colors ${
                      isActive(item.href)
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );

  // Desktop Navigation (Simple Top Bar)
  const DesktopNav = () => (
    <header className="hidden md:flex bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="text-xl font-bold text-primary">
          MyApp
        </Link>
        <nav className="flex items-center space-x-2">
          {navItems.map((item) => (
            <Button
              key={item.label}
              variant={isActive(item.href) ? 'secondary' : 'ghost'}
              asChild
            >
              <Link to={item.href}>
                <item.icon className="mr-2 h-4 w-4" />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
        {/* Potentially add Avatar/User menu here */}
      </div>
    </header>
  );

  return (
    <>
      <DesktopNav />
      <MobileNav />
      {/* Add padding to main content to avoid overlap with fixed mobile nav */}
      <div className="md:hidden pb-16"></div>
    </>
  );
};

export default NavigationMenu;