import { Button } from '@/components/ui/button';
import { Settings, LogOut } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4 justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="Darpo" className="h-8 w-8" />
          <span className="text-xl font-bold">Darpo</span>
        </div>

        {/* User Menu */}
        <div className="flex items-center gap-4">
          <span className="text-sm">John Doe</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}