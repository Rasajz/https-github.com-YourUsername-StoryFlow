'use client';

import React from 'react';
import { 
  Clapperboard, 
  FileText, 
  LayoutGrid, 
  Film, 
  Image as ImageIcon, 
  Search, 
  Settings, 
  ChevronDown, 
  Sparkles,
  Cloud,
  CheckCircle2
} from 'lucide-react';
import { useStory } from '../../context/StoryContext';
import { WorkspaceView } from '../../types';

export const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    projectName, 
    setIsCommandPaletteOpen,
    focusMode,
    googleUser,
    setIsGoogleModalOpen,
    projects,
    setIsProjectModalOpen
  } = useStory();

  if (focusMode) return null;

  const navItems: { id: WorkspaceView; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'storyboard', label: 'Storyboard', icon: LayoutGrid },
    { id: 'script', label: 'Script Studio', icon: Film },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
  ];

  return (
    <aside className="w-64 h-screen bg-[#11141B] border-r border-white/5 flex flex-col justify-between shrink-0 select-none transition-all duration-200 z-30">
      {/* Top Header */}
      <div>
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shadow-lg shadow-amber-500/20">
              <Clapperboard className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-white tracking-wide text-base flex items-center gap-1.5">
                StoryFlow
                <Sparkles className="w-3.5 h-3.5 text-amber-400 inline" />
              </h1>
              <p className="text-[11px] text-gray-400 font-medium">Visual Creator Workspace</p>
            </div>
          </div>
        </div>

        {/* Project Selector */}
        <div className="p-3">
          <button 
            type="button"
            onClick={() => setIsProjectModalOpen(true)}
            className="w-full flex items-center justify-between p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-amber-500/30 transition-all text-left group cursor-pointer shadow-sm"
            title="Click to switch or create story projects"
          >
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wider text-gray-500 font-semibold">Active Project</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-mono">
                  {projects.length}
                </span>
              </div>
              <span className="block text-sm font-semibold text-gray-200 group-hover:text-amber-400 transition-colors truncate mt-0.5">
                {projectName}
              </span>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500 group-hover:text-amber-400 transition-colors shrink-0" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-2 space-y-1 mt-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                type="button"
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 group ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border-l-2 border-amber-500 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.id === 'notes' && <span className="text-[10px] text-gray-500 font-mono">N</span>}
                {item.id === 'storyboard' && <span className="text-[10px] text-gray-500 font-mono">S</span>}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Area */}
      <div className="p-3 border-t border-white/5 space-y-1">
        <button 
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-gray-200 hover:bg-white/[0.04] transition-all"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-gray-400" />
            <span>Quick Search</span>
          </div>
          <kbd className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-gray-400 font-mono">Ctrl+K</kbd>
        </button>

        <button 
          type="button"
          onClick={() => setIsGoogleModalOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium text-gray-400 hover:text-amber-400 hover:bg-white/[0.04] transition-all group"
        >
          <div className="flex items-center gap-2.5">
            <Cloud className="w-3.5 h-3.5 text-gray-400 group-hover:text-amber-400" />
            <span>Cloud Backup & Restore</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        {/* User Profile / Gmail Sign In Button */}
        <button
          type="button"
          onClick={() => setIsGoogleModalOpen(true)}
          className="w-full pt-2 mt-2 border-t border-white/5 flex items-center justify-between p-2 rounded-xl hover:bg-white/[0.05] transition-all text-left group"
          title="Click to manage Google / Gmail cloud backup and restore"
        >
          <div className="flex items-center gap-3 truncate">
            {googleUser ? (
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white text-xs font-bold ring-2 ring-amber-500/30 shrink-0 shadow">
                {googleUser.name.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-400 text-xs font-bold ring-2 ring-white/10 shrink-0">
                G
              </div>
            )}
            <div className="truncate">
              <span className="block text-xs font-semibold text-gray-200 group-hover:text-amber-400 transition-colors truncate">
                {googleUser ? googleUser.name : 'Sign in with Gmail'}
              </span>
              <span className="block text-[10px] text-gray-500 truncate flex items-center gap-1">
                {googleUser ? (
                  <>
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 inline" />
                    <span>{googleUser.email}</span>
                  </>
                ) : (
                  'Enable cloud backup'
                )}
              </span>
            </div>
          </div>
          <Settings className="w-3.5 h-3.5 text-gray-500 group-hover:text-gray-300 shrink-0" />
        </button>
      </div>
    </aside>
  );
};
