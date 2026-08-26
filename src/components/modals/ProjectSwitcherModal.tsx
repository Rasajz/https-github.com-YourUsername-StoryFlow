'use client';

import React, { useState } from 'react';
import {
  X,
  Plus,
  FolderKanban,
  CheckCircle2,
  Film,
  Layers,
  FileText,
  Trash2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useStory } from '../../context/StoryContext';

export const ProjectSwitcherModal: React.FC = () => {
  const {
    projects,
    activeProjectId,
    switchProject,
    createProject,
    deleteProject,
    isProjectModalOpen,
    setIsProjectModalOpen
  } = useStory();

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newGenre, setNewGenre] = useState('Feature Film / Short');
  const [newDescription, setNewDescription] = useState('');

  if (!isProjectModalOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    createProject(newTitle.trim(), newGenre, newDescription.trim());
    setNewTitle('');
    setNewDescription('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-2xl bg-[#14171F] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-950/30 via-[#181D28] to-[#14171F] border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-black flex items-center justify-center font-bold shadow-lg shadow-amber-500/20">
              <FolderKanban className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Story Projects & Workspaces</h3>
              <p className="text-xs text-gray-400">Switch between your active films, scripts, and video projects</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => { setIsProjectModalOpen(false); setIsCreating(false); }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!isCreating ? (
            <div className="space-y-4">
              {/* Top Create Button */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Your Projects ({projects.length})</p>
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>New Project</span>
                </button>
              </div>

              {/* Projects Grid List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {projects.map((proj) => {
                  const isActive = proj.id === activeProjectId;
                  return (
                    <div
                      key={proj.id}
                      onClick={() => switchProject(proj.id)}
                      className={`p-4 rounded-xl border transition-all duration-150 cursor-pointer flex flex-col justify-between space-y-3 group ${isActive
                          ? 'bg-amber-500/10 border-amber-500 ring-1 ring-amber-500/30'
                          : 'bg-[#181D28] border-white/5 hover:border-white/20 hover:bg-[#1D2332]'
                        }`}
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-bold text-sm text-white group-hover:text-amber-400 transition-colors truncate">
                            {proj.name}
                          </h4>
                          {isActive && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500 text-black flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Active
                            </span>
                          )}
                        </div>

                        {proj.genre && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.04] text-gray-300 border border-white/5">
                            {proj.genre}
                          </span>
                        )}

                        {proj.description && (
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed mt-1">
                            {proj.description}
                          </p>
                        )}
                      </div>

                      {/* Project Stats Footer */}
                      <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1" title="Notes count">
                            <FileText className="w-3 h-3 text-amber-400" />
                            {proj.notesCount || 2} notes
                          </span>
                          <span className="flex items-center gap-1" title="Storyboard cards">
                            <Layers className="w-3 h-3 text-purple-400" />
                            {proj.cardsCount || 3} cards
                          </span>
                          <span className="flex items-center gap-1" title="Screenplay scenes">
                            <Film className="w-3 h-3 text-orange-400" />
                            {proj.scenesCount || 1} scenes
                          </span>
                        </div>

                        {projects.length > 1 && !isActive && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteProject(proj.id);
                            }}
                            className="p-1 rounded text-gray-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Delete this project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Create New Project Form */
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Create a New Story Project</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. The Midnight Signal, Cyberpunk 2099..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0B0D11] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Format & Genre</label>
                <select
                  value={newGenre}
                  onChange={(e) => setNewGenre(e.target.value)}
                  className="w-full bg-[#0B0D11] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Feature Film / Short">Feature Film / Short Film</option>
                  <option value="Sci-Fi / Thriller">Sci-Fi / Thriller</option>
                  <option value="Mystery / Drama">Mystery / Drama</option>
                  <option value="YouTube / Video Essay">YouTube / Video Essay</option>
                  <option value="Animation / Anime">Animation / Anime</option>
                  <option value="Documentary / Commercial">Documentary / Commercial</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Story Premise / Logline</label>
                <textarea
                  rows={3}
                  placeholder="Brief 1-2 sentence description of the central protagonist, goal, and conflict..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-[#0B0D11] border border-white/10 rounded-xl p-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 resize-none leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300"
                >
                  Back to Projects
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center gap-1.5"
                >
                  <span>Create Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#0B0D11] border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
          <span>Click any project to switch your notes, storyboard canvas, and scripts.</span>
          <button
            type="button"
            onClick={() => setIsProjectModalOpen(false)}
            className="text-gray-400 hover:text-white font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
