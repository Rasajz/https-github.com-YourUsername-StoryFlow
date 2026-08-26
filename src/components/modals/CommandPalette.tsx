'use client';

import React, { useState } from 'react';
import { Search, FileText, LayoutGrid, Film, Image as ImageIcon, X, ArrowRight } from 'lucide-react';
import { useStory } from '../../context/StoryContext';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    notes, 
    nodes, 
    scriptScenes, 
    mediaItems,
    setActiveView,
    setActiveNoteId,
    setSelectedNodeId,
    setActiveSceneId
  } = useStory();

  const [query, setQuery] = useState('');

  if (!isCommandPaletteOpen) return null;

  const filteredNotes = notes.filter((n) => n.title.toLowerCase().includes(query.toLowerCase()));
  const filteredNodes = nodes.filter((n) => (n.data.title as string || '').toLowerCase().includes(query.toLowerCase()));
  const filteredScenes = scriptScenes.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()));
  const filteredMedia = mediaItems.filter((m) => m.title.toLowerCase().includes(query.toLowerCase()));

  const handleSelectNote = (id: string) => {
    setIsCommandPaletteOpen(false);
    setActiveView('notes');
    setActiveNoteId(id);
  };

  const handleSelectNode = (id: string) => {
    setIsCommandPaletteOpen(false);
    setActiveView('storyboard');
    setSelectedNodeId(id);
  };

  const handleSelectScene = (id: string) => {
    setIsCommandPaletteOpen(false);
    setActiveView('script');
    setActiveSceneId(id);
  };

  const handleSelectMedia = () => {
    setIsCommandPaletteOpen(false);
    setActiveView('media');
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-start justify-center pt-20 p-4">
      <div className="w-full max-w-xl bg-[#14171F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Search Header */}
        <div className="p-4 border-b border-white/10 flex items-center gap-3">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search across Notes, Storyboard cards, Script scenes, and Media..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded text-gray-500 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-4">
          {/* Notes */}
          {filteredNotes.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <FileText className="w-3 h-3 text-amber-400" />
                <span>Notes ({filteredNotes.length})</span>
              </p>
              {filteredNotes.slice(0, 3).map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleSelectNote(n.id)}
                  className="px-3 py-2 rounded-lg hover:bg-amber-500/10 cursor-pointer flex items-center justify-between text-xs text-gray-200 group"
                >
                  <span className="font-semibold group-hover:text-amber-400 truncate">{n.title}</span>
                  <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-amber-400" />
                </div>
              ))}
            </div>
          )}

          {/* Storyboard Cards */}
          {filteredNodes.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <LayoutGrid className="w-3 h-3 text-amber-400" />
                <span>Storyboard Cards ({filteredNodes.length})</span>
              </p>
              {filteredNodes.slice(0, 3).map((node) => (
                <div
                  key={node.id}
                  onClick={() => handleSelectNode(node.id)}
                  className="px-3 py-2 rounded-lg hover:bg-amber-500/10 cursor-pointer flex items-center justify-between text-xs text-gray-200 group"
                >
                  <span className="font-semibold group-hover:text-amber-400 truncate">
                    {(node.data.title as string) || 'Card'}
                  </span>
                  <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-amber-400" />
                </div>
              ))}
            </div>
          )}

          {/* Script Scenes */}
          {filteredScenes.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <Film className="w-3 h-3 text-orange-400" />
                <span>Screenplay Scenes ({filteredScenes.length})</span>
              </p>
              {filteredScenes.slice(0, 3).map((scene) => (
                <div
                  key={scene.id}
                  onClick={() => handleSelectScene(scene.id)}
                  className="px-3 py-2 rounded-lg hover:bg-orange-500/10 cursor-pointer flex items-center justify-between text-xs text-gray-200 group"
                >
                  <span className="font-semibold group-hover:text-orange-400 truncate">{scene.title}</span>
                  <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-orange-400" />
                </div>
              ))}
            </div>
          )}

          {/* Media Items */}
          {filteredMedia.length > 0 && (
            <div className="space-y-1">
              <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
                <ImageIcon className="w-3 h-3 text-purple-400" />
                <span>Media Assets ({filteredMedia.length})</span>
              </p>
              {filteredMedia.slice(0, 2).map((m) => (
                <div
                  key={m.id}
                  onClick={handleSelectMedia}
                  className="px-3 py-2 rounded-lg hover:bg-purple-500/10 cursor-pointer flex items-center justify-between text-xs text-gray-200 group"
                >
                  <span className="font-semibold group-hover:text-purple-400 truncate">{m.title}</span>
                  <ArrowRight className="w-3 h-3 text-gray-600 group-hover:text-purple-400" />
                </div>
              ))}
            </div>
          )}

          {filteredNotes.length === 0 && filteredNodes.length === 0 && filteredScenes.length === 0 && (
            <div className="p-8 text-center text-xs text-gray-500">
              No matching assets found for &quot;{query}&quot;
            </div>
          )}
        </div>

        {/* Footer Shortcut Guide */}
        <div className="p-3 border-t border-white/5 bg-[#11141B] flex items-center justify-between text-[11px] text-gray-500">
          <span>Use &uarr;&darr; to navigate, Esc to exit</span>
          <kbd className="px-1.5 py-0.5 rounded bg-white/10 font-mono text-[10px] text-gray-400">Ctrl+K</kbd>
        </div>
      </div>
    </div>
  );
};
