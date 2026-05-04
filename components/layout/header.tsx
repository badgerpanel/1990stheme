'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/stores/auth';
import { useSettings } from '@/contexts/SettingsContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/lib/api/notifications';

export function Header() {
  const { settings } = useSettings();
  const panelName = settings?.panel_name || 'BadgerPanel';
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const queryClient = useQueryClient();
  const [showNotifs, setShowNotifs] = useState(false);

  const { data: unreadCount = 0 } = useQuery({
    queryKey: ['unread-count'],
    queryFn: async () => {
      const res = await notificationsApi.getUnreadCount();
      return res?.count ?? 0;
    },
    refetchInterval: 30000,
  });

  const handleLogout = useCallback(() => {
    logout();
    router.push('/auth/login');
  }, [logout, router]);

  return (
    <div className="bg-[#c0c0c0] border-b-2 border-b-[#808080] px-2 py-1 flex items-center justify-between"
         style={{ fontFamily: "'VT323', 'MS Sans Serif', monospace" }}>
      {/* Left: breadcrumb-style path */}
      <div className="flex items-center gap-2 text-sm">
        <span className="font-bold">C:\{panelName}&gt;</span>
        <span className="text-[#808080]">_</span>
      </div>

      {/* Right: status icons like system tray */}
      <div className="flex items-center gap-1">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="bg-[#c0c0c0] border border-t-white border-l-white border-b-[#808080] border-r-[#808080] px-2 py-0 text-xs flex items-center gap-1"
          >
            {unreadCount > 0 && (
              <span className="bg-red-600 text-white px-1 text-[10px] font-bold">{unreadCount}</span>
            )}
            Mail
          </button>

          {showNotifs && (
            <div className="absolute right-0 top-full mt-1 z-50 bg-[#c0c0c0] border-2 border-t-white border-l-white border-b-[#000] border-r-[#000] w-64 shadow-md">
              <div className="bg-gradient-to-r from-[#000080] to-[#1084d0] text-white px-2 py-0.5 text-xs font-bold flex justify-between">
                <span>Notifications</span>
                <button onClick={() => setShowNotifs(false)} className="text-white hover:text-red-300">x</button>
              </div>
              <div className="p-2 text-xs">
                {unreadCount > 0 ? (
                  <p>You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}.</p>
                ) : (
                  <p>No new notifications.</p>
                )}
                <Link
                  href="/notifications"
                  className="text-[#000080] underline mt-1 block"
                  onClick={() => setShowNotifs(false)}
                >
                  View All Notifications
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <div className="border-l-2 border-l-[#808080] border-r-2 border-r-white pl-2 ml-1 flex items-center gap-2 text-xs">
          <Link href="/account" className="text-[#000080] underline">{user?.username || 'User'}</Link>
          <button
            onClick={handleLogout}
            className="bg-[#c0c0c0] border border-t-white border-l-white border-b-[#808080] border-r-[#808080] px-2 py-0 text-xs"
          >
            Log Off
          </button>
        </div>

        {/* Clock */}
        <div className="border-2 border-t-[#808080] border-l-[#808080] border-b-white border-r-white px-2 py-0 text-xs ml-1">
          <Clock />
        </div>
      </div>
    </div>
  );
}

function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));

  if (typeof window !== 'undefined') {
    setTimeout(() => setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })), 60000);
  }

  return <span>{time}</span>;
}

export default Header;
