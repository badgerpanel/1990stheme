'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSettings } from '@/contexts/SettingsContext';
import { useAuthStore, useIsAdmin } from '@/stores/auth';
import {
  Server, LayoutDashboard, Settings, CreditCard, Ticket, User, Shield, Bell,
  HardDrive, Users, Egg, ChevronRight, Monitor
} from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  adminOnly?: boolean;
}

const userNav: NavItem[] = [
  { href: '/dashboard', label: 'My Computer', icon: Monitor },
  { href: '/dashboard/servers', label: 'My Servers', icon: Server },
  { href: '/billing', label: 'Control Panel', icon: CreditCard },
  { href: '/support/tickets', label: 'Help & Support', icon: Ticket },
  { href: '/notifications', label: 'Inbox', icon: Bell },
  { href: '/account', label: 'User Settings', icon: User },
];

const adminNav: NavItem[] = [
  { href: '/admin', label: 'Admin Dashboard', icon: Shield, adminOnly: true },
  { href: '/admin/servers', label: 'Server Manager', icon: Server, adminOnly: true },
  { href: '/admin/nodes', label: 'Network Nodes', icon: HardDrive, adminOnly: true },
  { href: '/admin/users', label: 'User Accounts', icon: Users, adminOnly: true },
  { href: '/admin/eggs', label: 'Game Templates', icon: Egg, adminOnly: true },
  { href: '/admin/settings', label: 'System Settings', icon: Settings, adminOnly: true },
];

export function Sidebar() {
  const pathname = usePathname();
  const { settings } = useSettings();
  const isAdmin = useIsAdmin();
  const [expandAdmin, setExpandAdmin] = useState(pathname.startsWith('/admin'));
  const panelName = settings?.panel_name || 'BadgerPanel';

  return (
    <div
      className="w-[220px] bg-[#c0c0c0] border-r-2 border-r-[#808080] flex flex-col h-full"
      style={{ fontFamily: "'VT323', 'MS Sans Serif', monospace" }}
    >
      {/* Windows 95 style vertical banner */}
      <div className="flex flex-1 overflow-hidden">
        {/* Vertical brand strip */}
        <div className="w-[26px] bg-gradient-to-b from-[#000080] to-[#808080] flex items-end justify-center pb-2 shrink-0">
          <span
            className="text-white text-xs font-bold tracking-widest"
            style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
          >
            {panelName}
          </span>
        </div>

        {/* Nav items */}
        <div className="flex-1 py-1 overflow-y-auto">
          {/* Separator */}
          <div className="mx-1 my-1 border-t border-t-[#808080] border-b border-b-white" />

          {/* User navigation */}
          {userNav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}

          {/* Admin section */}
          {isAdmin && (
            <>
              <div className="mx-1 my-1 border-t border-t-[#808080] border-b border-b-white" />

              <button
                onClick={() => setExpandAdmin(!expandAdmin)}
                className="w-full text-left px-2 py-1 text-xs flex items-center gap-2 hover:bg-[#000080] hover:text-white"
              >
                <ChevronRight className={`h-3 w-3 transition-transform ${expandAdmin ? 'rotate-90' : ''}`} />
                <Shield className="h-4 w-4" />
                <span className="font-bold">Administration</span>
              </button>

              {expandAdmin && adminNav.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} indent />
              ))}
            </>
          )}

          <div className="mx-1 my-1 border-t border-t-[#808080] border-b border-b-white" />
        </div>
      </div>
    </div>
  );
}

function NavLink({ item, pathname, indent }: { item: NavItem; pathname: string; indent?: boolean }) {
  const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-2 px-2 py-1 text-xs transition-colors ${indent ? 'pl-6' : ''} ${
        isActive
          ? 'bg-[#000080] text-white'
          : 'text-black hover:bg-[#000080] hover:text-white'
      }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

export default Sidebar;
