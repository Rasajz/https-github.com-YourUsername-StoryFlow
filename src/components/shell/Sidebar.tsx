'use client';

import React from 'react';
import { 
  Clapperboard, 
  FileText, 
  LayoutGrid, 
  Film, 
  Image as ImageIcon, 
  Search, 
  ChevronDown, 
  Sparkles,
  Cloud,
  CheckCircle2,
  FolderKanban
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
    { id: 'director', label: 'AI Director', icon: Sparkles },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR (Visible on md screens and up) */}
      <aside className="hidden md:flex w-64 h-screen bg-[#11141B] border-r border-white/5 flex-col justify-between shrink-0 select-none transition-all duration-200 z-30">
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
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-amber-400' : 'text-gray-500 group-hover:text-gray-300'}`} />
                    <span>{item.label}</span>
                  </div>
                  <span className="text-[10px] text-gray-600 font-mono uppercase tracking-wider">
                    {item.id === 'notes' ? 'N' : item.id === 'storyboard' ? 'S' : ''}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-white/5 space-y-2">
          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={() => setIsCommandPaletteOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] text-gray-400 hover:text-gray-200 text-xs transition-colors border border-white/5"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-gray-500" />
              <span>Quick Search</span>
            </div>
            <kbd className="text-[10px] font-mono text-gray-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
              Ctrl+K
            </kbd>
          </button>

          {/* Google Sync Button */}
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] text-gray-400 hover:text-gray-200 text-xs transition-colors border border-white/5"
          >
            <div className="flex items-center gap-2">
              <Cloud className="w-3.5 h-3.5 text-cyan-400" />
              <span>Local Backups & Recovery</span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-400" title="Stored on this device" />
          </button>

          {/* User Profile */}
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-white/[0.04] transition-colors cursor-pointer text-left"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center font-bold text-xs text-white">
              {googleUser ? googleUser.name.charAt(0) : 'S'}
            </div>
            <div className="truncate flex-1">
              <span className="block text-xs font-semibold text-gray-200 truncate">
                {'Local Creator'}
              </span>
              <span className="block text-[10px] text-gray-500 truncate flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 inline" />
                {'Local browser workspace'}
              </span>
            </div>
          </button>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAVIGATION BAR (Visible on mobile screens) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#11141B]/95 backdrop-blur-xl border-t border-white/10 h-16 px-2 flex items-center justify-around shadow-2xl safe-area-bottom">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;
          return (
            <button
              type="button"
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`min-w-0 flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
                isActive
                  ? 'text-amber-400 scale-105 font-bold'
                  : 'text-gray-400 hover:text-gray-200 font-medium'
              }`}
            >
              <Icon className={`w-5 h-5 mb-0.5 ${isActive ? 'text-amber-400' : 'text-gray-400'}`} />
              <span className="text-[9px] whitespace-nowrap">{item.id === 'script' ? 'Script' : item.id === 'media' ? 'Media' : item.id === 'director' ? 'AI' : item.label}</span>
            </button>
          );
        })}

        {/* Mobile Project Switcher Trigger */}
        <button
          type="button"
          onClick={() => setIsProjectModalOpen(true)}
          className="min-w-0 flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl text-gray-400 hover:text-amber-400 transition-all"
        >
          <FolderKanban className="w-5 h-5 mb-0.5 text-amber-400/80" />
          <span className="text-[10px] text-amber-400/90 whitespace-nowrap">Projects</span>
        </button>
      </nav>
    </>
  );
};
