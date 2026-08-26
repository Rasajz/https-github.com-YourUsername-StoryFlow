'use client';

import React from 'react';
import {
  Plus,
  Search,
  ChevronRight,
  Maximize2,
  Minimize2,
  Cloud
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
    setIsGoogleModalOpen
  } = useStory();

  const getPageTitle = () => {
    switch (activeView) {
      case 'notes': return 'Notes Workspace';
      case 'storyboard': return 'Storyboard Canvas';
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
      case 'media': return 'Upload media';
    }
  };

  return (
    <header className="h-14 bg-[#14171F]/80 backdrop-blur-md border-b border-white/5 px-6 flex items-center justify-between z-20 shrink-0 select-none">
      {/* Left: Breadcrumbs & Page Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <span className="font-medium text-gray-300">{projectName}</span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600" />

          {activeView === 'storyboard' ? (
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Storyboard</span>
              {breadcrumbStack.map((step, idx) => (
                <React.Fragment key={step.id}>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
                  <button
                    onClick={() => navigateBreadcrumb(idx)}
                    className={`font-medium hover:text-amber-400 transition-colors ${idx === breadcrumbStack.length - 1
                        ? 'text-amber-400 font-semibold'
                        : 'text-gray-400'
                      }`}
                  >
                    {step.title}
                  </button>
                </React.Fragment>
              ))}
            </div>
          ) : (
            <span className="font-medium text-amber-400">{getPageTitle()}</span>
          )}
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Google Cloud Backup & Restore Button */}
        <button
          type="button"
          onClick={() => setIsGoogleModalOpen(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 text-xs text-gray-300 transition-all group"
          title={googleUser ? `Synced with ${googleUser.email}` : 'Sign in with Gmail to restore/backup'}
        >
          <Cloud className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
          <span className="text-[11px] font-medium hidden sm:inline">
            {googleUser ? 'Google Sync' : 'Gmail Backup'}
          </span>
        </button>

        {/* Autosave Badge */}
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-white/[0.03] border border-white/5 text-xs text-gray-400">
          <span className={`w-2 h-2 rounded-full ${isSaving ? 'bg-amber-400 animate-ping' : 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
          <span className="text-[11px] font-medium text-gray-300">{saveStatus}</span>
        </div>

        {/* Quick Search */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-all"
          title="Search (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Focus Mode Toggle */}
        <button
          onClick={() => setFocusMode(!focusMode)}
          className={`p-2 rounded-lg transition-all ${focusMode
              ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/[0.06]'
            }`}
          title="Toggle Focus Mode (F)"
        >
          {focusMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>

        {/* Primary Action Button */}
        <button
          onClick={handlePrimaryAction}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-semibold text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>{getPrimaryActionLabel()}</span>
        </button>
      </div>
    </header>
  );
};
