'use client';

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Layers, ArrowRight } from 'lucide-react';
import { StoryNodeData } from '../../../types';
import { useStory } from '../../../context/StoryContext';

export const SubboardCardNode: React.FC<{ data: StoryNodeData; selected?: boolean }> = ({ data, selected }) => {
  const { drillDownSubBoard } = useStory();

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    drillDownSubBoard(data.subBoardId || 'subboard-bus-stop', data.subBoardTitle || data.title);
  };

  return (
    <div 
      onDoubleClick={handleDoubleClick}
      className={`w-72 rounded-xl bg-[#1B202C] border transition-all duration-150 shadow-xl overflow-hidden cursor-pointer group ${
        selected ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-white/10 hover:border-emerald-500/40'
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-emerald-500" />
      <div className="h-1.5 bg-gradient-to-r from-emerald-500 to-teal-400" />

      <div className="p-3.5 space-y-2.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 group-hover:scale-110 transition-transform">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs text-white group-hover:text-emerald-400 transition-colors truncate">
              {data.title || 'Nested Sub-board'}
            </h4>
            <span className="text-[9px] text-emerald-400/80 font-medium">Double-click to expand canvas</span>
          </div>
        </div>

        {data.description && (
          <p className="text-[11px] text-gray-300 line-clamp-2 leading-relaxed">
            {data.description}
          </p>
        )}

        <button
          onClick={handleDoubleClick}
          className="w-full py-1.5 px-3 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all border border-emerald-500/30"
        >
          <span>Open sub-board</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <Handle type="source" position={Position.Bottom} className="!bg-emerald-500" />
    </div>
  );
};
