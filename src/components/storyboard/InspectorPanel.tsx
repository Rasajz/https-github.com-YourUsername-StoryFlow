'use client';

import React from 'react';
import { 
  X, 
  Trash2, 
  Film, 
  Layers, 
  ArrowUpRight,
  Plus,
  GitBranch
} from 'lucide-react';
import { useStory } from '../../context/StoryContext';

export const InspectorPanel: React.FC = () => {
  const { 
    nodes, 
    selectedNodeId, 
    setSelectedNodeId, 
    updateNodeData, 
    deleteNode,
    openScriptScene,
    createScriptSceneFromCard,
    drillDownSubBoard,
    scriptScenes,
    timelines,
    assignNodeTimeline
  } = useStory();

  if (!selectedNodeId) return null;

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  if (!selectedNode) return null;

  const data = selectedNode.data;

  return (
    <aside className="w-full md:w-80 fixed md:relative bottom-16 md:bottom-auto left-0 md:left-auto right-0 max-h-[70vh] md:max-h-none md:h-[calc(100vh-3.5rem)] bg-[#12151D] border-t md:border-t-0 md:border-l border-white/10 md:border-white/5 flex flex-col justify-between shrink-0 z-40 shadow-2xl rounded-t-2xl md:rounded-none animate-in slide-in-from-bottom md:slide-in-from-right duration-200">
      {/* Panel Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span className="font-bold text-xs uppercase tracking-wider text-gray-300">
            Card Inspector
          </span>
        </div>
        <button
          onClick={() => setSelectedNodeId(null)}
          className="p-1 rounded text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Form Fields */}
      <div className="p-4 space-y-5 flex-1 overflow-y-auto">
        {/* Node Type Badge */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Type</span>
          <span className="px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30 capitalize">
            {data.nodeType as string || 'Card'}
          </span>
        </div>

        {/* Timeline Story Track */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <GitBranch className="w-3.5 h-3.5 text-amber-400" />
            <span>Timeline Story Track</span>
          </label>
          <select
            value={(data.timelineId as string) || 'time-main'}
            onChange={(e) => assignNodeTimeline(selectedNode.id, e.target.value)}
            className="w-full bg-[#181C26] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
          >
            {timelines.map((tl) => (
              <option key={tl.id} value={tl.id}>
                {tl.name}
              </option>
            ))}
          </select>
        </div>

        {/* Title Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Card Title</label>
          <input
            type="text"
            value={(data.title as string) || ''}
            onChange={(e) => updateNodeData(selectedNode.id, { title: e.target.value })}
            className="w-full bg-[#181C26] border border-white/10 rounded-lg px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>

        {/* Description Input */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Description / Beat</label>
          <textarea
            rows={4}
            value={(data.description as string) || ''}
            onChange={(e) => updateNodeData(selectedNode.id, { description: e.target.value })}
            className="w-full bg-[#181C26] border border-white/10 rounded-lg p-3 text-xs text-gray-200 focus:outline-none focus:border-amber-500 transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* Status Badge Input (for Scene Card) */}
        {data.nodeType === 'scene' && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Scene Status</label>
            <select
              value={(data.statusBadge as string) || 'Draft'}
              onChange={(e) => updateNodeData(selectedNode.id, { statusBadge: e.target.value })}
              className="w-full bg-[#181C26] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-amber-500"
            >
              <option value="Draft">Draft</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
        )}

        {/* Image URL Input (for Image Card) */}
        {data.nodeType === 'image' && (
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Image URL</label>
            <input
              type="text"
              value={(data.imageUrl as string) || ''}
              onChange={(e) => updateNodeData(selectedNode.id, { imageUrl: e.target.value })}
              placeholder="Paste any image URL..."
              className="w-full bg-[#181C26] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-amber-500"
            />
          </div>
        )}

        {/* Video URL Input (for Video Card) */}
        {data.nodeType === 'video' && (
          <>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Video URL (YouTube / Direct)</label>
              <input
                type="text"
                value={(data.videoUrl as string) || ''}
                onChange={(e) => updateNodeData(selectedNode.id, { videoUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                className="w-full bg-[#181C26] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Director / Creator Notes</label>
              <input
                type="text"
                value={(data.creatorNotes as string) || ''}
                onChange={(e) => updateNodeData(selectedNode.id, { creatorNotes: e.target.value })}
                placeholder="e.g. Reference for slow push-in shot"
                className="w-full bg-[#181C26] border border-white/10 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </>
        )}

        {/* Connected Script Scene Actions */}
        <div className="pt-3 border-t border-white/5 space-y-2">
          <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center justify-between">
            <span>Linked Script Scene</span>
            <Film className="w-3.5 h-3.5 text-orange-400" />
          </label>

          {data.linkedScriptSceneId ? (
            <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-orange-400">
                <span>{scriptScenes.find((s) => s.id === data.linkedScriptSceneId)?.title || 'Scene Linked'}</span>
              </div>
              <button
                onClick={() => openScriptScene(data.linkedScriptSceneId as string)}
                className="w-full py-1.5 rounded-md bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-xs flex items-center justify-center gap-1 shadow transition-all hover:brightness-110"
              >
                <span>Open linked script</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => createScriptSceneFromCard(selectedNode.id, (data.title as string) || 'Scene')}
              className="w-full py-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 font-semibold flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Create linked script scene</span>
            </button>
          )}
        </div>

        {/* Sub-board Drilldown Action */}
        {data.nodeType === 'subboard' && (
          <div className="pt-3 border-t border-white/5">
            <button
              onClick={() => drillDownSubBoard((data.subBoardId as string) || 'subboard-bus-stop', (data.title as string) || 'Sub-board')}
              className="w-full py-2.5 rounded-lg bg-emerald-500 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 hover:bg-emerald-400 transition-all"
            >
              <Layers className="w-4 h-4" />
              <span>Open Sub-Board Canvas</span>
            </button>
          </div>
        )}
      </div>

      {/* Delete Action */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => deleteNode(selectedNode.id)}
          className="w-full py-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete Card</span>
        </button>
      </div>
    </aside>
  );
};
