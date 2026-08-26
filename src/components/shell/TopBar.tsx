'use client';

import React from 'react';
import { 
  Plus, 
  Search, 
  ChevronRight, 
  Maximize2, 
  Minimize2,
  Cloud,
  FolderKanban,
  Clapperboard
} from 'lucide-react';
import { useStory } from '../../context/StoryContext';

export const TopBar: React.FC = () => {
  const { 
    activeView, 
    projectName, 
    saveStatus, 
    isSaving,
    breadcrumbStack,
    navigateBreadcrumb,
    addNote,
    addNodeToCanvas,
    addScriptScene,
    addMediaItem,
    setIsCommandPaletteOpen,
    focusMode,
    setFocusMode,
    googleUser,
    setIsGoogleModalOpen,
    setIsProjectModalOpen
  } = useStory();

  const getPageTitle = () => {
    switch (activeView) {
      case 'notes': return 'Notes';
      case 'storyboard': return 'Storyboard';
      case 'script': return 'Script Studio';
      case 'media': return 'Media Library';
    }
  };

  const handlePrimaryAction = () => {
    switch (activeView) {
      case 'notes':
        addNote({ title: 'New Story Idea', content: '' });
        break;
      case 'storyboard':
        addNodeToCanvas({
          nodeType: 'note',
          title: 'New Story Card',
          description: 'Type your card idea here...',
          tags: ['Idea'],
          accentColor: '#F59E0B'
        });
        break;
      case 'script':
        addScriptScene();
        break;
      case 'media':
        addMediaItem({ title: 'New Media Asset', type: 'image' });
        break;
    }
  };

  const getPrimaryActionLabel = () => {
    switch (activeView) {
      case 'notes': return 'New note';
      case 'storyboard': return 'Add card';
      case 'script': return 'New scene';
      case 'media': return 'Add media';
    }
  };

  return (
    <header className="h-14 bg-[#14171F]/90 backdrop-blur-md border-b border-white/5 px-3 md:px-6 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Left: Project & Page Context */}
      <div className="flex items-center gap-2 truncate max-w-[55vw] sm:max-w-none">
        {/* Mobile Logo Icon */}
        <div className="md:hidden w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white shrink-0 shadow">
          <Clapperboard className="w-4 h-4" />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 truncate">
          <button
            type="button"
            onClick={() => setIsProjectModalOpen(true)}
            className="font-bold text-gray-100 hover:text-amber-400 transition-colors flex items-center gap-1 hover:underline cursor-pointer truncate"
            title="Click to switch or rename story project"
          >
            <span className="truncate">{projectName}</span>
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />

          {activeView === 'storyboard' ? (
            <div className="flex items-center gap-1 truncate">
              <span className="text-gray-400 hidden sm:inline">Storyboard</span>
              {breadcrumbStack.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <ChevronRight className="w-3 h-3 text-gray-600 shrink-0 hidden sm:inline" />
                  <button
                    type="button"
                    onClick={() => navigateBreadcrumb(idx)}
                    className={`font-medium hover:text-amber-400 transition-colors truncate ${
                      idx === breadcrumbStack.length - 1 
                        ? 'text-amber-400 font-semibold' 
                        : 'text-gray-400 hidden sm:inline'
                    }`}
                  >
                    {step.title}
                  </button>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <span className="font-medium text-amber-400 truncate">{getPageTitle()}</span>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Google Sync Button */}
        <button
          type="button"
          onClick={() => setIsGoogleModalOpen(true)}
          className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-xs text-gray-300 transition-all group"
          title={googleUser ? `Synced with ${googleUser.email}` : 'Sign in with Gmail to restore/backup'}
        >
          <Cloud className="w-3.5 h-3.5 text-cyan-400 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-medium hidden md:inline">
            {googleUser ? 'Google Sync' : 'Gmail Backup'}
          </span>
        </button>

        {/* Autosave Badge */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.03] border border-white/5 text-xs text-gray-400 hidden sm:flex">
          <span className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
          <span className="text-[10px] font-medium text-gray-300">{saveStatus}</span>
        </div>

        {/* Quick Search */}
        <button
          type="button"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
          title="Search (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Focus Mode Toggle */}
        <button
          type="button"
          onClick={() => setFocusMode(!focusMode)}
          className={`p-1.5 sm:p-2 rounded-lg transition-all hidden sm:block ${
            focusMode
              ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
          }`}
          title="Toggle Focus Mode (F)"
        >
          {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Primary Action Button */}
        <button
          type="button"
          onClick={handlePrimaryAction}
          className="flex items-center gap-1 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95 shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span className="hidden sm:inline">{getPrimaryActionLabel()}</span>
        </button>
      </div>
    </header>
  );
};
