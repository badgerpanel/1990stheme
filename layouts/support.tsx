'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { ArrowLeft } from 'lucide-react';

export default function Win95SupportLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, setLoading } = useAuthStore();
  const _hasSession = useAuthStore((s) => s._hasSession);

  useEffect(() => {
    if (!_hasSession && !isAuthenticated) { router.replace('/auth/login'); return; }
    setLoading(false);
  }, [_hasSession, isAuthenticated, router, setLoading]);

  if (!_hasSession && !isAuthenticated) return null;

  const title = pathname.includes('/new') ? 'New Ticket' : pathname.includes('/tickets/') && !pathname.endsWith('/tickets') ? 'Ticket' : 'Help & Support';

  return (
    <div className="win95 h-screen flex flex-col" style={{ fontFamily: "'VT323', monospace" }}>
      <div className="flex-1 relative overflow-hidden">
        <div className="absolute inset-4 flex flex-col" style={{ background: '#c0c0c0', border: '2px solid', borderColor: 'white #000 #000 white', boxShadow: '2px 2px 0 #000' }}>
          <div className="flex items-center justify-between px-2 py-1 shrink-0" style={{ background: 'linear-gradient(90deg, #000080, #1084d0)' }}>
            <span className="text-white text-sm font-bold">{title}</span>
            <div className="flex gap-[2px]">
              <button onClick={() => router.push('/dashboard')} className="w-4 h-[14px] bg-[#c0c0c0] text-[8px] flex items-center justify-center" style={{ border: '1px solid', borderColor: 'white #000 #000 white' }}><ArrowLeft className="h-2 w-2" /></button>
              <button onClick={() => router.push('/dashboard')} className="w-4 h-[14px] bg-[#c0c0c0] text-[8px] flex items-center justify-center" style={{ border: '1px solid', borderColor: 'white #000 #000 white' }}>x</button>
            </div>
          </div>
          <div className="flex-1 overflow-auto win95-content">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
