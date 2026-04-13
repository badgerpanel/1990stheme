'use client';

import { useParams, useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { serverApi } from '@/lib/api';
import { ArrowLeft } from 'lucide-react';
import { ServerDashboardLayout } from '@/components/server/dashboard';

export default function Win95ServerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const serverId = params.id as string;

  const { data: server } = useQuery({
    queryKey: ['server', serverId],
    queryFn: () => serverApi.get(serverId),
    enabled: !!serverId,
  });

  const serverName = (server as any)?.data?.name || (server as any)?.name || 'Server';

  const getTab = () => {
    if (pathname.includes('/files')) return 'Files';
    if (pathname.includes('/databases')) return 'Databases';
    if (pathname.includes('/schedules')) return 'Schedules';
    if (pathname.includes('/network')) return 'Network';
    if (pathname.includes('/startup')) return 'Startup';
    if (pathname.includes('/settings')) return 'Settings';
    if (pathname.includes('/activity')) return 'Activity';
    if (pathname.includes('/backups')) return 'Backups';
    if (pathname.includes('/subusers')) return 'Users';
    if (pathname.includes('/console')) return 'Console';
    return 'Console';
  };

  return (
    <div className="win95 h-screen flex flex-col" style={{ fontFamily: "'VT323', monospace" }}>
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-2 flex flex-col" style={{ background: '#c0c0c0', border: '2px solid', borderColor: 'white #000 #000 white', boxShadow: '2px 2px 0 #000' }}>
          {/* Title bar */}
          <div className="flex items-center justify-between px-2 py-1 shrink-0" style={{ background: 'linear-gradient(90deg, #000080, #1084d0)' }}>
            <span className="text-white text-sm font-bold">{serverName} - {getTab()}</span>
            <div className="flex gap-[2px]">
              <button onClick={() => router.push('/dashboard')} className="w-4 h-[14px] bg-[#c0c0c0] text-[8px] flex items-center justify-center" style={{ border: '1px solid', borderColor: 'white #000 #000 white' }}><ArrowLeft className="h-2 w-2" /></button>
              <button onClick={() => router.push('/dashboard')} className="w-4 h-[14px] bg-[#c0c0c0] text-[8px] flex items-center justify-center" style={{ border: '1px solid', borderColor: 'white #000 #000 white' }}>x</button>
            </div>
          </div>
          {/* Content - keep dark theme for server console/dashboard */}
          <div className="flex-1 overflow-auto" style={{ background: '#18181b', color: '#e4e4e7' }}>
            <ServerDashboardLayout>{children}</ServerDashboardLayout>
          </div>
        </div>
      </div>
    </div>
  );
}
