'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/lib/api/notifications';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Bell, Check, Trash2, CheckCheck, Trash, Settings } from 'lucide-react';
import Link from 'next/link';

export default function Win95NotificationsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [unreadOnly, setUnreadOnly] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['notifications', 'all', unreadOnly],
    queryFn: async () => {
      const res = await notificationsApi.getNotifications({ limit: 50, unread_only: unreadOnly });
      return res?.data?.notifications ?? [];
    },
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationsApi.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-count'] });
    },
  });

  const deleteReadMutation = useMutation({
    mutationFn: () => notificationsApi.deleteAllRead(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const notifications = data || [];

  return (
    <div className="win95 h-screen flex flex-col" style={{ fontFamily: "'VT323', monospace" }}>
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-4 flex flex-col" style={{ background: '#c0c0c0', border: '2px solid', borderColor: 'white #000 #000 white', boxShadow: '2px 2px 0 #000' }}>
          {/* Title bar */}
          <div className="flex items-center justify-between px-2 py-1 shrink-0" style={{ background: 'linear-gradient(90deg, #000080, #1084d0)' }}>
            <span className="text-white text-sm font-bold">Inbox</span>
            <div className="flex gap-[2px]">
              <button onClick={() => router.push('/dashboard')} className="w-4 h-[14px] bg-[#c0c0c0] text-[8px] flex items-center justify-center" style={{ border: '1px solid', borderColor: 'white #000 #000 white' }}><ArrowLeft className="h-2 w-2" /></button>
              <button onClick={() => router.push('/dashboard')} className="w-4 h-[14px] bg-[#c0c0c0] text-[8px] flex items-center justify-center" style={{ border: '1px solid', borderColor: 'white #000 #000 white' }}>x</button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-3 py-2 bg-[#c0c0c0]" style={{ borderBottom: '1px solid #808080' }}>
            <div className="flex items-center gap-2">
              <button onClick={() => router.push('/dashboard')} className="text-xs text-[#000080] hover:underline flex items-center gap-1">
                <ArrowLeft className="h-3 w-3" /> Back
              </button>
              <label className="flex items-center gap-1 text-xs cursor-pointer ml-4">
                <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} />
                Unread only
              </label>
            </div>
            <div className="flex gap-1">
              <Link href="/notifications/preferences" className="text-xs px-2 py-0.5 bg-[#c0c0c0]" style={{ border: '2px solid', borderColor: 'white #000 #000 white' }}>
                <Settings className="h-3 w-3 inline mr-1" />Preferences
              </Link>
              <button onClick={() => markAllMutation.mutate()} className="text-xs px-2 py-0.5 bg-[#c0c0c0]" style={{ border: '2px solid', borderColor: 'white #000 #000 white' }}>
                <CheckCheck className="h-3 w-3 inline mr-1" />Mark All Read
              </button>
              <button onClick={() => deleteReadMutation.mutate()} className="text-xs px-2 py-0.5 bg-[#c0c0c0]" style={{ border: '2px solid', borderColor: 'white #000 #000 white' }}>
                <Trash className="h-3 w-3 inline mr-1" />Clear Read
              </button>
            </div>
          </div>

          {/* Notification list */}
          <div className="flex-1 overflow-auto bg-white">
            {isLoading ? (
              <div className="p-8 text-center text-[#808080] text-sm">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-8 w-8 text-[#808080] mx-auto mb-2" />
                <p className="text-sm font-bold">No notifications</p>
                <p className="text-xs text-[#808080]">You're all caught up.</p>
              </div>
            ) : (
              notifications.map((notif: any) => (
                <div key={notif.uuid} className="flex items-start gap-3 px-3 py-2 text-xs hover:bg-[#000080] hover:text-white cursor-pointer group" style={{ borderBottom: '1px solid #c0c0c0', background: notif.read ? 'white' : '#ffffcc' }}>
                  <div className={`mt-1 w-2 h-2 shrink-0 ${notif.read ? 'bg-[#808080]' : 'bg-[#000080]'} group-hover:bg-white`} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold">{notif.title}</p>
                    <p className="text-[#808080] group-hover:text-white mt-0.5">{notif.message}</p>
                    {notif.action_url && (
                      <a href={notif.action_url} className="text-[#000080] group-hover:text-yellow-200 underline mt-1 inline-block">
                        {notif.action_text || 'View'} &#8599;
                      </a>
                    )}
                  </div>
                  <span className="text-[#808080] group-hover:text-white shrink-0">{notif.time_ago}</span>
                </div>
              ))
            )}
          </div>

          {/* Status bar */}
          <div className="px-2 py-0.5 text-[11px] bg-[#c0c0c0]" style={{ borderTop: '1px solid white' }}>
            {notifications.length} notification(s)
          </div>
        </div>
      </div>
    </div>
  );
}
