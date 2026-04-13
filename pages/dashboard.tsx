'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { serverApi } from '@/lib/api';
import { useAuthStore } from '@/stores/auth';
import { Server, Monitor, CreditCard, Ticket, Settings, Bell, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Win95Window {
  id: string;
  title: string;
  content: React.ReactNode;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  zIndex: number;
}

let nextZ = 10;

export default function Win95Desktop() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [windows, setWindows] = useState<Win95Window[]>([]);
  const [dragState, setDragState] = useState<{ id: string; offsetX: number; offsetY: number; mode: 'move' | 'resize' } | null>(null);
  const [activeWindow, setActiveWindow] = useState<string | null>(null);
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);

  const { data: serverData } = useQuery({
    queryKey: ['servers'],
    queryFn: () => serverApi.list(1, 50),
  });

  const servers = serverData?.data || serverData || [];
  const runningCount = servers.filter((s: any) => s.status === 'running').length;

  const openWindow = useCallback((id: string, title: string, content: React.ReactNode, width = 500, height = 400) => {
    setWindows(prev => {
      const existing = prev.find(w => w.id === id);
      if (existing) {
        nextZ++;
        return prev.map(w => w.id === id ? { ...w, minimized: false, zIndex: nextZ } : w);
      }
      nextZ++;
      return [...prev, { id, title, content, x: 100 + (prev.length * 30) % 200, y: 30 + (prev.length * 30) % 150, width, height, minimized: false, zIndex: nextZ }];
    });
    setActiveWindow(id);
  }, []);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindow === id) setActiveWindow(null);
  }, [activeWindow]);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, minimized: true } : w));
  }, []);

  const focusWindow = useCallback((id: string) => {
    nextZ++;
    setWindows(prev => prev.map(w => w.id === id ? { ...w, zIndex: nextZ, minimized: false } : w));
    setActiveWindow(id);
  }, []);

  const onMouseDown = useCallback((id: string, e: React.MouseEvent) => {
    const el = document.getElementById(`win-${id}`);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setDragState({ id, offsetX: e.clientX - rect.left, offsetY: e.clientY - rect.top, mode: 'move' });
    focusWindow(id);
    e.preventDefault();
  }, [focusWindow]);

  const onResizeDown = useCallback((id: string, e: React.MouseEvent) => {
    const el = document.getElementById(`win-${id}`);
    if (!el) return;
    setDragState({ id, offsetX: e.clientX, offsetY: e.clientY, mode: 'resize' });
    focusWindow(id);
    e.preventDefault();
    e.stopPropagation();
  }, [focusWindow]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragState) return;
    if (dragState.mode === 'resize') {
      const dx = e.clientX - dragState.offsetX;
      const dy = e.clientY - dragState.offsetY;
      setWindows(prev => prev.map(w => w.id === dragState.id ? { ...w, width: Math.max(250, w.width + dx), height: Math.max(150, w.height + dy) } : w));
      setDragState({ ...dragState, offsetX: e.clientX, offsetY: e.clientY });
    } else {
      setWindows(prev => prev.map(w => w.id === dragState.id ? { ...w, x: Math.max(0, e.clientX - dragState.offsetX), y: Math.max(0, e.clientY - dragState.offsetY) } : w));
    }
  }, [dragState]);

  const onMouseUp = useCallback(() => setDragState(null), []);

  const serverWindow = (
    <div style={{ fontFamily: "'VT323', monospace", fontSize: 14 }}>
      <div className="bg-[#c0c0c0] px-1 py-0.5 text-xs flex gap-4" style={{ borderBottom: '1px solid #808080' }}>
        <span><u>F</u>ile</span><span><u>E</u>dit</span><span><u>V</u>iew</span><span><u>H</u>elp</span>
      </div>
      <div className="flex bg-[#c0c0c0] text-[11px] font-bold" style={{ borderBottom: '1px solid #808080' }}>
        <div className="flex-1 px-1 py-0.5" style={{ borderRight: '1px solid #808080' }}>Name</div>
        <div className="w-20 px-1 py-0.5" style={{ borderRight: '1px solid #808080' }}>Status</div>
        <div className="w-20 px-1 py-0.5">Memory</div>
      </div>
      <div className="bg-white overflow-auto" style={{ maxHeight: 250 }}>
        {servers.length === 0 ? (
          <div className="p-4 text-center text-[#808080] text-sm">No servers found</div>
        ) : servers.map((srv: any, i: number) => (
          <div key={srv.uuid || i} onClick={() => router.push(`/servers/${srv.uuid}`)}
            className="group flex text-xs px-1 py-0.5 cursor-pointer text-black hover:bg-[#000080] hover:!text-white"
            style={{ background: i % 2 === 0 ? 'white' : '#f0f0f0' }}>
            <div className="flex-1 flex items-center gap-1"><Server className="h-3 w-3" />{srv.name}</div>
            <div className="w-20"><span className="group-hover:text-white" style={{ color: srv.status === 'running' ? 'green' : 'red' }}>●</span> {srv.status}</div>
            <div className="w-20">{srv.memory_limit || 0} MB</div>
          </div>
        ))}
      </div>
      <div className="bg-[#c0c0c0] px-1 py-0.5 text-[11px]" style={{ borderTop: '1px solid white' }}>
        {servers.length} object(s) | {runningCount} running
      </div>
    </div>
  );

  const welcomeWindow = (
    <div className="p-4" style={{ fontFamily: "'VT323', monospace" }}>
      <div className="flex items-start gap-3 mb-3">
        <span className="text-4xl">&#128075;</span>
        <div>
          <p className="font-bold mb-1">Welcome to BadgerPanel, {user?.first_name || user?.username}!</p>
          <p className="text-[#808080] text-sm">{servers.length} server(s) configured. {runningCount > 0 && `${runningCount} running.`}</p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #808080', borderBottom: '1px solid white' }} className="my-2" />
      <p className="text-xs text-[#808080]">Click a desktop icon to get started.</p>
    </div>
  );

  const icons = [
    { id: 'servers', label: 'My Servers', icon: <Monitor className="h-8 w-8" />, action: () => openWindow('servers', 'My Servers', serverWindow, 500, 320) },
    { id: 'billing', label: 'Shop', icon: <CreditCard className="h-8 w-8" />, action: () => router.push('/billing') },
    { id: 'support', label: 'Help &\nSupport', icon: <Ticket className="h-8 w-8" />, action: () => router.push('/support/tickets') },
    { id: 'settings', label: 'My\nSettings', icon: <Settings className="h-8 w-8" />, action: () => router.push('/account') },
    { id: 'inbox', label: 'Inbox', icon: <Bell className="h-8 w-8" />, action: () => router.push('/notifications') },
    { id: 'network', label: 'Network', icon: <Globe className="h-8 w-8" />, action: () => openWindow('welcome', 'Welcome', welcomeWindow, 400, 200) },
  ];

  return (
    <div className="w-full h-full relative overflow-hidden" style={{ userSelect: dragState ? 'none' : 'auto' }}
      onMouseMove={onMouseMove} onMouseUp={onMouseUp} onClick={() => setSelectedIcon(null)}>

      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 flex flex-col gap-2">
        {icons.map(icon => (
          <div key={icon.id} onClick={(e) => { e.stopPropagation(); icon.action(); }}
            className="flex flex-col items-center w-[76px] p-2 cursor-pointer text-center rounded"
            style={{ background: selectedIcon === icon.id ? 'rgba(0,0,128,0.4)' : 'transparent' }}>
            <div className="text-white" style={{ filter: 'drop-shadow(1px 1px 0 #000)' }}>{icon.icon}</div>
            <span className="text-white text-[11px] mt-1 leading-tight whitespace-pre-line"
              style={{ fontFamily: "'VT323', monospace", textShadow: '1px 1px 0 #004040' }}>
              {icon.label}
            </span>
          </div>
        ))}
      </div>

      {/* Windows */}
      {windows.filter(w => !w.minimized).map(win => (
        <div key={win.id} id={`win-${win.id}`}
          className="absolute bg-[#c0c0c0]"
          style={{ left: win.x, top: win.y, width: win.width, zIndex: win.zIndex, border: '2px solid', borderColor: 'white #000 #000 white', boxShadow: '2px 2px 0 #000', fontFamily: "'VT323', monospace" }}>
          {/* Title bar */}
          <div onMouseDown={(e) => onMouseDown(win.id, e)}
            className="flex items-center justify-between px-1 py-0.5 cursor-move text-xs font-bold text-white"
            style={{ background: activeWindow === win.id ? 'linear-gradient(90deg, #000080, #1084d0)' : 'linear-gradient(90deg, #808080, #a0a0a0)' }}>
            <span>{win.title}</span>
            <div className="flex gap-[2px]">
              <button onClick={() => minimizeWindow(win.id)} className="w-4 h-[14px] bg-[#c0c0c0] text-[8px] flex items-center justify-center" style={{ border: '1px solid', borderColor: 'white #000 #000 white' }}>_</button>
              <button className="w-4 h-[14px] bg-[#c0c0c0] text-[8px] flex items-center justify-center" style={{ border: '1px solid', borderColor: 'white #000 #000 white' }}>&#9633;</button>
              <button onClick={() => closeWindow(win.id)} className="w-4 h-[14px] bg-[#c0c0c0] text-[8px] flex items-center justify-center" style={{ border: '1px solid', borderColor: 'white #000 #000 white' }}>x</button>
            </div>
          </div>
          <div style={{ height: win.height, overflow: 'auto' }}>{win.content}</div>
          {/* Resize handle */}
          <div onMouseDown={(e) => onResizeDown(win.id, e)}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
            style={{ background: 'linear-gradient(135deg, transparent 50%, #808080 50%, #808080 60%, transparent 60%, transparent 70%, #808080 70%, #808080 80%, transparent 80%)' }} />
        </div>
      ))}
    </div>
  );
}
