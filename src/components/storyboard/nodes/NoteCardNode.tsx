'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { StickyNote } from 'lucide-react';
import { StoryNodeData } from '../../../types';

export const NoteCardNode: React.FC<{ data: StoryNodeData; selected?: boolean }> = ({ data, selected }) => {
  return (
    <div className={`w-64 rounded-xl bg-[#1B202C] border transition-all duration-150 shadow-xl overflow-hidden ${
      selected ? 'border-amber-500 ring-2 ring-amber-500/30' : 'border-white/10 hover:border-white/20'
    }`}>
      {/* Handles */}
      <Handle type="target" position={Position.Top} className="!bg-amber-500" />
      
      {/* Top Accent Strip */}
      <div className="h-1.5 bg-amber-500" />

      {/* Header */}
      <div className="p-3 space-y-2">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded bg-amber-500/10 text-amber-400">
            <StickyNote className="w-3.5 h-3.5" />
          </div>
          <h4 className="font-semibold text-xs text-white truncate">{data.title || 'Note Card'}</h4>
        </div>

        {data.description && (
          <p className="text-[11px] text-gray-300 line-clamp-3 leading-relaxed font-normal">
            {data.description}
          </p>
        )}

        {data.tags && data.tags.length > 0 && (
          <div className="flex items-center gap-1 pt-1 flex-wrap">
            {data.tags.map((tag) => (
              <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-amber-500" />
    </div>
  );
};
