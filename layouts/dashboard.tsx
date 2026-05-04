'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore, useIsAdmin } from '@/stores/auth';
import { useSettings } from '@/contexts/SettingsContext';
import Link from 'next/link';
import {
  Server, Monitor, CreditCard, Ticket, Settings, Bell, Shield,
  HardDrive, Users, Egg, ChevronRight, X, Minus, Square, ArrowLeft
} from 'lucide-react';

export default function Win95DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, setLoading, user, logout } = useAuthStore();
  const _hasSession = useAuthStore((s) => s._hasSession);
  const isAdmin = useIsAdmin();
  const { settings } = useSettings();
  const [showStart, setShowStart] = useState(false);
  const [time, setTime] = useState('');

  useEffect(() => {
    if (!_hasSession && !isAuthenticated) { router.replace('/auth/login'); return; }
    setLoading(false);
  }, [_hasSession, isAuthenticated, router, setLoading]);

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!_hasSession && !isAuthenticated) return null;

  const handleLogout = () => { logout(); router.push('/auth/login'); };
  const isDashboardHome = pathname === '/dashboard';
  const panelName = settings?.panel_name || 'BadgerPanel';

  // Determine window title from pathname
  const getWindowTitle = () => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments[0] === 'dashboard' && segments[1] === 'servers') return 'My Servers';
    if (segments[0] === 'servers') return 'Server Console';
    if (segments[0] === 'billing') return 'Shop';
    if (segments[0] === 'support') return 'Help & Support';
    if (segments[0] === 'account') return 'My Settings';
    if (segments[0] === 'notifications') return 'Inbox';
    if (segments[0] === 'admin') return 'Administration';
    return 'BadgerPanel';
  };

  const startMenuItems = [
    { label: 'Desktop', icon: <Monitor className="h-4 w-4" />, href: '/dashboard' },
    { label: 'My Servers', icon: <Server className="h-4 w-4" />, href: '/dashboard/servers' },
    { label: 'Shop', icon: <CreditCard className="h-4 w-4" />, href: '/billing' },
    { label: 'Help & Support', icon: <Ticket className="h-4 w-4" />, href: '/support/tickets' },
    { label: 'Notifications', icon: <Bell className="h-4 w-4" />, href: '/notifications' },
    { label: 'Account', icon: <Settings className="h-4 w-4" />, href: '/account' },
  ];

  const adminItems = [
    { label: 'Dashboard', icon: <Shield className="h-4 w-4" />, href: '/admin' },
    { label: 'Servers', icon: <Server className="h-4 w-4" />, href: '/admin/servers' },
    { label: 'Nodes', icon: <HardDrive className="h-4 w-4" />, href: '/admin/nodes' },
    { label: 'Users', icon: <Users className="h-4 w-4" />, href: '/admin/users' },
    { label: 'Settings', icon: <Settings className="h-4 w-4" />, href: '/admin/settings' },
  ];

  return (
    <div className="win95 flex flex-col h-screen overflow-hidden"
      style={{ fontFamily: "'VT323', 'MS Sans Serif', Tahoma, sans-serif" }}
      onClick={() => showStart && setShowStart(false)}>

      {/* Desktop area */}
      <div className="flex-1 relative overflow-hidden">
        {isDashboardHome ? (
          // Desktop: show children (desktop icons) directly
          children
        ) : (
          // Any other page: wrap in a Windows 95 window frame
          <div className="absolute inset-4 flex flex-col" style={{
            background: '#c0c0c0',
            border: '2px solid',
            borderColor: 'white #000 #000 white',
            boxShadow: '2px 2px 0 #000',
          }}>
            {/* Window title bar */}
            <div className="flex items-center justify-between px-2 py-1 shrink-0"
              style={{ background: 'linear-gradient(90deg, #000080, #1084d0)' }}>
              <span className="text-white text-sm font-bold">{getWindowTitle()}</span>
              <div className="flex gap-[2px]">
                <button onClick={() => router.push('/dashboard')}
                  className="w-4 h-[14px] bg-[#c0c0c0] text-[8px] flex items-center justify-center"
                  style={{ border: '1px solid', borderColor: 'white #000 #000 white' }} title="Back to Desktop">
                  <ArrowLeft className="h-2 w-2" />
                </button>
                <button onClick={() => router.push('/dashboard')}
                  className="w-4 h-[14px] bg-[#c0c0c0] text-[8px] flex items-center justify-center"
                  style={{ border: '1px solid', borderColor: 'white #000 #000 white' }} title="Close">
                  x
                </button>
              </div>
            </div>
            {/* Window content */}
            <div className="flex-1 overflow-auto win95-content">
              {children}
            </div>
          </div>
        )}
      </div>

      {/* Start Menu */}
      {showStart && (
        <div onClick={(e) => e.stopPropagation()} style={{
          position: 'fixed', bottom: 28, left: 0, zIndex: 9999,
          background: '#c0c0c0', border: '2px solid', borderColor: 'white #000 #000 white',
          boxShadow: '2px -2px 0 rgba(0,0,0,0.2)', width: 220,
        }}>
          <div className="flex">
            <div style={{
              width: 24, background: 'linear-gradient(to top, #000080, #808080)',
              display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '4px 0',
            }}>
              <span style={{
                color: 'white', fontSize: '11px', fontWeight: 'bold',
                writingMode: 'vertical-rl', transform: 'rotate(180deg)', letterSpacing: '2px',
              }}>{panelName}</span>
            </div>
            <div className="flex-1">
              <div style={{ borderBottom: '1px solid #808080', margin: '2px 0' }} />
              {startMenuItems.map(item => (
                <Link key={item.href} href={item.href} onClick={() => setShowStart(false)}
                  className="flex items-center gap-3 px-3 py-1.5 text-sm hover:bg-[#000080] hover:text-white text-black">
                  {item.icon}{item.label}
                </Link>
              ))}
              {isAdmin && (
                <>
                  <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid white', margin: '2px 4px' }} />
                  <div className="px-3 py-1 text-xs text-[#808080] font-bold">Administration</div>
                  {adminItems.map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setShowStart(false)}
                      className="flex items-center gap-3 px-3 py-1.5 text-sm hover:bg-[#000080] hover:text-white text-black">
                      {item.icon}{item.label}
                    </Link>
                  ))}
                </>
              )}
              <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid white', margin: '2px 4px' }} />
              <button onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-1.5 text-sm hover:bg-[#000080] hover:text-white text-black w-full text-left">
                <ChevronRight className="h-4 w-4" />Shut Down...
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Taskbar */}
      <div style={{
        height: 28, background: '#c0c0c0', borderTop: '2px solid white',
        display: 'flex', alignItems: 'center', padding: '0 2px', gap: 2, zIndex: 9998, flexShrink: 0,
      }}>
        <button onClick={(e) => { e.stopPropagation(); setShowStart(!showStart); }} style={{
          height: 22, padding: '0 6px', background: '#c0c0c0',
          border: '2px solid', borderColor: showStart ? '#808080 white white #808080' : 'white #808080 #808080 white',
          fontWeight: 'bold', fontSize: 12, display: 'flex', alignItems: 'center', gap: 3,
          cursor: 'pointer', fontFamily: "'VT323', monospace",
        }}>
          Start
        </button>
        <div style={{ width: 1, height: 20, borderLeft: '1px solid #808080', borderRight: '1px solid white' }} />

        {/* Active window indicator in taskbar */}
        {!isDashboardHome && (
          <button onClick={() => {}} style={{
            height: 22, padding: '0 8px', background: '#c0c0c0', fontSize: 11,
            border: '1px solid', borderColor: '#808080 white white #808080',
            fontFamily: "'VT323', monospace", textAlign: 'left', maxWidth: 200, overflow: 'hidden',
            whiteSpace: 'nowrap', textOverflow: 'ellipsis',
          }}>
            {getWindowTitle()}
          </button>
        )}

        <div style={{ flex: 1 }} />
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4, height: 20, padding: '0 8px',
          border: '1px solid', borderColor: '#808080 white white #808080',
          fontSize: 11, fontFamily: "'VT323', monospace",
        }}>
          <span>{user?.username}</span>
          <span>{time}</span>
        </div>
      </div>
    </div>
  );
}
