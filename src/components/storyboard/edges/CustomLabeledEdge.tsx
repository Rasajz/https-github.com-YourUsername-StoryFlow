'use client';

import React, { useState } from 'react';
import { 
  BaseEdge, 
  EdgeLabelRenderer, 
  EdgeProps, 
  getBezierPath 
} from '@xyflow/react';

const LABELS = ['wants', 'leads to', 'visual style for', 'appears in', 'happens after'];

export const CustomLabeledEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  selected
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const [currentLabel, setCurrentLabel] = useState<string>((label as string) || 'leads to');
  const [showPopover, setShowPopover] = useState(false);

  return (
    <>
      <BaseEdge 
        id={id} 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          stroke: selected ? '#F59E0B' : '#475569',
          strokeWidth: selected ? 3.5 : 2.5,
          transition: 'stroke 0.15s ease, stroke-width 0.15s ease'
        }} 
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan z-10"
        >
          <button
            onClick={() => setShowPopover(!showPopover)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all shadow-md backdrop-blur-md ${
              selected
                ? 'bg-amber-500 text-black shadow-amber-500/30 ring-2 ring-amber-400'
                : 'bg-[#181C26]/90 text-amber-400 border border-amber-500/30 hover:border-amber-400'
            }`}
          >
            {currentLabel}
          </button>

          {/* Label Change Popover */}
          {showPopover && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-[#14171F] border border-white/10 rounded-lg shadow-2xl p-1.5 space-y-1 w-32 z-50">
              {LABELS.map((lbl) => (
                <button
                  key={lbl}
                  onClick={() => {
                    setCurrentLabel(lbl);
                    setShowPopover(false);
                  }}
                  className={`w-full text-left px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    currentLabel === lbl 
                      ? 'bg-amber-500/20 text-amber-400 font-semibold' 
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  {lbl}
                </button>
              ))}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
