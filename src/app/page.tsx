'use client';

import React from 'react';
import { useStory } from '../context/StoryContext';
import { Sidebar } from '../components/shell/Sidebar';
import { TopBar } from '../components/shell/TopBar';
import { NotesWorkspace } from '../components/notes/NotesWorkspace';
import { StoryboardCanvas } from '../components/storyboard/StoryboardCanvas';
import { ScriptStudioWorkspace } from '../components/script/ScriptStudioWorkspace';
import { MediaLibraryWorkspace } from '../components/media/MediaLibraryWorkspace';
import { DirectorWorkspace } from '../components/director/DirectorWorkspace';

export default function Home() {
  const { activeView } = useStory();

  return (
    <div className="flex h-[100dvh] w-screen overflow-hidden bg-[#0B0D11] relative">
      {/* Persistent Left Sidebar (Desktop only) */}
      <Sidebar />

      {/* Main Workspace Area */}
      <main className="flex-1 flex flex-col h-[100dvh] min-w-0 overflow-hidden relative">
        <TopBar />

        {/* View Switcher Container */}
        <div className="flex-1 min-h-0 relative overflow-hidden flex flex-col">
          {activeView === 'notes' && <NotesWorkspace />}
          {activeView === 'storyboard' && <StoryboardCanvas />}
          {activeView === 'script' && <ScriptStudioWorkspace />}
          {activeView === 'media' && <MediaLibraryWorkspace />}
          {activeView === 'director' && <DirectorWorkspace />}
        </div>
      </main>
    </div>
  );
}
