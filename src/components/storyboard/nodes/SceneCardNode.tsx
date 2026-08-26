'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Film, ArrowUpRight } from 'lucide-react';
import { StoryNodeData } from '../../../types';
import { useStory } from '../../../context/StoryContext';

export const SceneCardNode: React.FC<{ id: string; data: StoryNodeData; selected?: boolean }> = ({ id, data, selected }) => {
  const { openScriptScene, createScriptSceneFromCard } = useStory();

  const handleOpenScript = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.linkedScriptSceneId) {
      openScriptScene(data.linkedScriptSceneId);
    } else {
      createScriptSceneFromCard(id, data.title);
    }
  };

  return (
    <div className={`w-72 rounded-xl bg-[#1B202C] border transition-all duration-150 shadow-xl overflow-hidden ${
      selected ? 'border-orange-500 ring-2 ring-orange-500/30' : 'border-white/10 hover:border-white/20'
    }`}>
      <Handle type="target" position={Position.Top} className="!bg-orange-500" />
      <div className="h-1.5 bg-gradient-to-r from-orange-500 to-amber-500" />

      <div className="p-3 space-y-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-bold text-xs text-white truncate max-w-[140px]">{data.title || 'Scene Card'}</h4>
              <span className="text-[10px] text-orange-400 font-semibold uppercase tracking-wider">Screenplay Scene</span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-orange-500/10 text-orange-400 border border-orange-500/30">
            {data.statusBadge || 'Draft'}
          </span>
        </div>

        {data.description && (
          <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed">
            {data.description}
          </p>
        )}

        <button
          onClick={handleOpenScript}
          className="w-full py-1.5 px-3 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
        >
          <span>Open script</span>
          <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-orange-500" />
    </div>
  );
};
