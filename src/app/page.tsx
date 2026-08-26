'use client';

import React from 'react';
import { useStory } from '../context/StoryContext';
import { Sidebar } from '../components/shell/Sidebar';
import { TopBar } from '../components/shell/TopBar';
import { NotesWorkspace } from '../components/notes/NotesWorkspace';
import { StoryboardCanvas } from '../components/storyboard/StoryboardCanvas';
import { ScriptStudioWorkspace } from '../components/script/ScriptStudioWorkspace';
import { MediaLibraryWorkspace } from '../components/media/MediaLibraryWorkspace';

export default function Home() {
  const { activeView } = useStory();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0B0D11]">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden relative">
        <TopBar />

        {/* View Switcher */}
        {activeView === 'notes' && <NotesWorkspace />}
        {activeView === 'storyboard' && <StoryboardCanvas />}
        {activeView === 'script' && <ScriptStudioWorkspace />}
        {activeView === 'media' && <MediaLibraryWorkspace />}
      </div>
    </div>
  );
}
