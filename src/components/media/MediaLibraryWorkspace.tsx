'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import { 
  Image as ImageIcon, 
  Music, 
  Plus, 
  Search, 
  X, 
  Play, 
  HelpCircle, 
  Link as LinkIcon, 
  ExternalLink, 
  Copy, 
  Check,
  Video,
  Camera
} from 'lucide-react';
import { useStory } from '../../context/StoryContext';
import { MediaHelpModal } from '../modals/MediaHelpModal';

export const MediaLibraryWorkspace: React.FC = () => {
  const { mediaItems, addMediaItem, scriptScenes, nodes, projectName, showToast } = useStory();

  const [filterType, setFilterType] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showAddLinkModal, setShowAddLinkModal] = useState<boolean>(false);
  const [showHelpModal, setShowHelpModal] = useState<boolean>(false);
  const [copiedLinkIndex, setCopiedLinkIndex] = useState<number | null>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState<'image' | 'video' | 'sketch' | 'audio'>('image');

  // Aggregate all live links & references from script scenes and storyboard cards
  const scriptAndCardLinks = useMemo(() => {
    const links: { id: string; title: string; url: string; type: 'video' | 'image' | 'camera'; source: string; details?: string }[] = [];

    // Extract from Script Scenes
    scriptScenes.forEach((scene) => {
      if (scene.moodImage) {
        links.push({
          id: `link-sc-mood-${scene.id}`,
          title: `${scene.title} Mood Reference`,
          url: scene.moodImage,
          type: 'image',
          source: `Script Scene ${scene.number}`,
          details: scene.storyPurpose || 'Visual lighting reference from screenplay'
        });
      }
      scene.shotIdeas.forEach((shot, sIdx) => {
        links.push({
          id: `link-shot-${scene.id}-${sIdx}`,
          title: shot,
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(shot + ' cinematic camera angle')}`,
          type: 'camera',
          source: `Script Scene ${scene.number}`,
          details: 'Camera shot idea from scene breakdown'
        });
      });
    });

    // Extract from Storyboard Nodes
    nodes.forEach((n) => {
      const d = n.data as { videoUrl?: string; imageUrl?: string; title?: string; creatorNotes?: string };
      if (d.videoUrl) {
        links.push({
          id: `link-node-vid-${n.id}`,
          title: d.title || 'Video Reference',
          url: d.videoUrl,
          type: 'video',
          source: 'Storyboard Video Card',
          details: d.creatorNotes || 'Motion & cinematography reference'
        });
      }
      if (d.imageUrl) {
        links.push({
          id: `link-node-img-${n.id}`,
          title: d.title || 'Image Reference',
          url: d.imageUrl,
          type: 'image',
          source: 'Storyboard Image Card',
          details: 'Visual mood concept image'
        });
      }
    });

    return links;
  }, [scriptScenes, nodes]);

  const filteredItems = mediaItems.filter((item) => {
    const matchesFilter = filterType === 'All' || item.type === filterType.toLowerCase().slice(0, -1);
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
                          item.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addMediaItem({
      title: newTitle,
      url: newUrl || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
      type: newType,
      tags: ['Reference'],
      connectedSceneOrBoard: 'Main Story Map'
    });
    setShowUploadModal(false);
    setShowAddLinkModal(false);
    setNewTitle('');
    setNewUrl('');
  };

  const handleCopyLink = (url: string, index: number) => {
    navigator.clipboard?.writeText(url);
    setCopiedLinkIndex(index);
    showToast('Link Copied', 'Copied reference URL to clipboard');
    setTimeout(() => setCopiedLinkIndex(null), 2000);
  };

  const handleImportLinkToGallery = (link: { title: string; url: string; type: 'video' | 'image' | 'camera'; source: string }) => {
    addMediaItem({
      title: link.title,
      url: link.url,
      type: link.type === 'camera' ? 'image' : link.type,
      tags: ['Script Link', link.type],
      connectedSceneOrBoard: link.source
    });
  };

  return (
    <div className="flex-1 h-[calc(100vh-3.5rem)] flex flex-col bg-[#0B0D11] overflow-y-auto p-8 space-y-6">
      {/* Top Header Controls */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-amber-400" />
            <span>Media Library & Reference Gallery</span>
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Active Project: <strong className="text-amber-400 font-semibold">{projectName}</strong> &bull; Visual references, sketches, video links, and audio tracks.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Quick Script Links Button */}
          <button
            type="button"
            onClick={() => setFilterType('Links')}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all shadow ${
              filterType === 'Links'
                ? 'bg-amber-500 text-black border-amber-400'
                : 'bg-white/[0.05] hover:bg-white/[0.1] border-white/10 text-gray-200 hover:text-white'
            }`}
          >
            <LinkIcon className="w-4 h-4 text-amber-400" />
            <span>Script & Story Links ({scriptAndCardLinks.length})</span>
          </button>

          {/* Quick Add Web Link */}
          <button
            type="button"
            onClick={() => { setShowAddLinkModal(true); setNewType('video'); }}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition-all shadow"
          >
            <Video className="w-4 h-4 text-cyan-400" />
            <span>+ Add Video/URL Link</span>
          </button>

          {/* How to use button */}
          <button
            type="button"
            onClick={() => setShowHelpModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-gray-200 hover:text-white font-semibold text-xs transition-all shadow"
          >
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>How to use</span>
          </button>

          {/* Upload Asset Button */}
          <button
            type="button"
            onClick={() => setShowUploadModal(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold text-xs shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Upload Media Asset</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex items-center justify-between gap-4 flex-wrap bg-[#14171F] p-3 rounded-xl border border-white/5">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {['All', 'Links', 'Images', 'Sketches', 'Videos', 'Audios'].map((f) => (
            <button
              type="button"
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                filterType === f 
                  ? 'bg-amber-500 text-black shadow' 
                  : 'bg-white/[0.04] text-gray-400 hover:text-white'
              }`}
            >
              {f === 'Links' && <LinkIcon className="w-3 h-3" />}
              <span>{f}</span>
              {f === 'Links' && (
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-black/30">
                  {scriptAndCardLinks.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="relative w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
          <input
            type="text"
            placeholder="Search media & references..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#181C26] border border-white/10 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* VIEW: SCRIPT & STORYBOARD LINKS AGGREGATOR */}
      {filterType === 'Links' ? (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-amber-400" />
              <span>All Script & Storyboard Links in &quot;{projectName}&quot; ({scriptAndCardLinks.length})</span>
            </h3>
            <span className="text-xs text-gray-400">Auto-extracted from your screenplay scenes and canvas cards</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scriptAndCardLinks.map((link, idx) => (
              <div 
                key={link.id}
                className="p-4 rounded-xl bg-[#14171F] border border-white/10 hover:border-amber-500/30 transition-all flex flex-col justify-between space-y-3 group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {link.type === 'video' ? (
                        <div className="w-7 h-7 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                          <Video className="w-4 h-4" />
                        </div>
                      ) : link.type === 'camera' ? (
                        <div className="w-7 h-7 rounded-lg bg-orange-500/10 text-orange-400 flex items-center justify-center shrink-0">
                          <Camera className="w-4 h-4" />
                        </div>
                      ) : (
                        <div className="w-7 h-7 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center shrink-0">
                          <ImageIcon className="w-4 h-4" />
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-xs text-white group-hover:text-amber-400 transition-colors truncate max-w-[180px]">
                          {link.title}
                        </h4>
                        <span className="text-[10px] text-amber-400/80 font-medium">
                          {link.source}
                        </span>
                      </div>
                    </div>

                    <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-white/[0.04] text-gray-400 border border-white/5">
                      {link.type}
                    </span>
                  </div>

                  {link.details && (
                    <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                      {link.details}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-gray-400 hover:text-cyan-300 flex items-center gap-1 font-mono truncate max-w-[140px]"
                  >
                    <span>{link.url.replace(/^https?:\/\//, '')}</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(link.url, idx)}
                      className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-400 hover:text-white text-xs transition-colors"
                      title="Copy URL"
                    >
                      {copiedLinkIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleImportLinkToGallery(link)}
                      className="px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[10px] font-bold transition-colors"
                    >
                      Save Asset
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* STANDARD MEDIA GALLERY GRID */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[#14171F] border border-white/10 hover:border-amber-500/40 overflow-hidden transition-all duration-200 group shadow-xl flex flex-col justify-between"
            >
              {/* Asset Preview */}
              <div className="relative h-44 w-full bg-black/40 overflow-hidden">
                {item.type === 'video' ? (
                  <div className="w-full h-full bg-gradient-to-br from-slate-900 to-cyan-950 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-400/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-cyan-400 ml-0.5" />
                    </div>
                  </div>
                ) : item.type === 'audio' ? (
                  <div className="w-full h-full bg-gradient-to-br from-purple-950 to-indigo-950 flex items-center justify-center">
                    <Music className="w-10 h-10 text-purple-400" />
                  </div>
                ) : (
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                )}

                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30">
                  {item.type}
                </div>
              </div>

              {/* Asset Information */}
              <div className="p-4 space-y-3">
                <div>
                  <h4 className="font-semibold text-xs text-white group-hover:text-amber-400 transition-colors truncate">
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">{item.createdAt}</p>
                </div>

                {item.connectedSceneOrBoard && (
                  <div className="text-[11px] text-gray-400 flex items-center gap-1.5 truncate">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="truncate">{item.connectedSceneOrBoard}</span>
                  </div>
                )}

                <div className="flex items-center gap-1 flex-wrap pt-1">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-white/[0.04] text-[10px] text-gray-400 border border-white/5"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Add Video / URL Link Modal */}
      {showAddLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#14171F] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-cyan-400" />
                <span>Add Web Reference Link ({projectName})</span>
              </h3>
              <button 
                type="button"
                onClick={() => setShowAddLinkModal(false)}
                className="p-1 text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Reference Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Blade Runner 2049 Lighting Breakdown"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0B0D11] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Reference URL (YouTube, Vimeo, Pinterest)</label>
                <input
                  type="url"
                  required
                  placeholder="https://youtube.com/watch?v=..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-[#0B0D11] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Asset Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as 'image' | 'video' | 'sketch' | 'audio')}
                  className="w-full bg-[#0B0D11] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="video">Video Reference (YouTube / Vimeo)</option>
                  <option value="image">Image / Lighting Reference</option>
                  <option value="audio">Audio / Sound Track Reference</option>
                  <option value="sketch">Sketch / Concept Art</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLinkModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-colors shadow-lg"
                >
                  Save Link to Media
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Media Asset Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#14171F] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>Upload Media Asset</span>
              </h3>
              <button 
                type="button"
                onClick={() => setShowUploadModal(false)}
                className="p-1 text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Asset Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rainy Mood Board"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-[#0B0D11] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Image / Asset URL</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full bg-[#0B0D11] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Asset Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as 'image' | 'video' | 'sketch' | 'audio')}
                  className="w-full bg-[#0B0D11] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="image">Visual Image Reference</option>
                  <option value="video">Video Reference</option>
                  <option value="sketch">Storyboard Sketch</option>
                  <option value="audio">Audio / Sound Asset</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors shadow-lg"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Media Guide Modal */}
      <MediaHelpModal isOpen={showHelpModal} onClose={() => setShowHelpModal(false)} />
    </div>
  );
};
