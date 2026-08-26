'use client';

import React, { useCallback, useMemo, useState, useRef, useEffect } from 'react';
import { 
  ReactFlow, 
  Background, 
  Controls, 
  MiniMap, 
  addEdge, 
  applyNodeChanges,
  applyEdgeChanges,
  Connection, 
  Edge, 
  Node,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { 
  Plus, 
  LayoutGrid, 
  Image as ImageIcon, 
  Film, 
  Video, 
  User, 
  StickyNote, 
  Clock, 
  Layers, 
  X,
  Link as LinkIcon,
  Copy,
  Trash2,
  GitBranch,
  Palette,
  ArrowRight
} from 'lucide-react';
import { useStory } from '../../context/StoryContext';
import { NoteCardNode } from './nodes/NoteCardNode';
import { CharacterCardNode } from './nodes/CharacterCardNode';
import { SceneCardNode } from './nodes/SceneCardNode';
import { ImageCardNode } from './nodes/ImageCardNode';
import { VideoCardNode } from './nodes/VideoCardNode';
import { TimelineCardNode } from './nodes/TimelineCardNode';
import { SubboardCardNode } from './nodes/SubboardCardNode';
import { CustomLabeledEdge } from './edges/CustomLabeledEdge';
import { InspectorPanel } from './InspectorPanel';
import { StoryNodeType } from '../../types';

export const StoryboardCanvas: React.FC = () => {
  const { 
    nodes, 
    setNodes, 
    edges, 
    setEdges, 
    selectedNodeId,
    setSelectedNodeId, 
    addNodeToCanvas,
    updateNodeData,
    deleteNode,
    duplicateNode,
    breadcrumbStack,
    timelines,
    activeTimelineId,
    setActiveTimelineId,
    createTimeline,
    assignNodeTimeline,
    createScriptSceneFromCard
  } = useStory();

  // Context menu states
  const [paneContextMenu, setPaneContextMenu] = useState<{ x: number; y: number; canvasX: number; canvasY: number } | null>(null);
  const [nodeContextMenu, setNodeContextMenu] = useState<{ x: number; y: number; node: Node } | null>(null);
  
  // URL input modal state
  const [urlModal, setUrlModal] = useState<{ type: 'image' | 'video'; position: { x: number; y: number } } | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [titleInput, setTitleInput] = useState('');

  // New timeline modal state
  const [showNewTimelineModal, setShowNewTimelineModal] = useState(false);
  const [newTimelineName, setNewTimelineName] = useState('');
  const [newTimelineColor, setNewTimelineColor] = useState('#F59E0B');
  
  const [showAddMenu, setShowAddMenu] = useState(false);
  const flowRef = useRef<HTMLDivElement>(null);

  // Define custom node types
  const nodeTypes = useMemo(() => ({
    noteCard: NoteCardNode,
    characterCard: CharacterCardNode,
    sceneCard: SceneCardNode,
    imageCard: ImageCardNode,
    videoCard: VideoCardNode,
    timelineCard: TimelineCardNode,
    subboardCard: SubboardCardNode
  }), []);

  // Define custom edge types
  const edgeTypes = useMemo(() => ({
    customLabeled: CustomLabeledEdge
  }), []);

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `edge-${Date.now()}`,
        type: 'customLabeled',
        label: 'leads to'
      } as Edge;
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
      setPaneContextMenu(null);
      setNodeContextMenu(null);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setPaneContextMenu(null);
    setNodeContextMenu(null);
  }, [setSelectedNodeId]);

  // Right-click on empty canvas
  const onPaneContextMenu = useCallback((event: React.MouseEvent | MouseEvent) => {
    event.preventDefault();
    setNodeContextMenu(null);
    
    const reactFlowBounds = flowRef.current?.getBoundingClientRect();
    if (!reactFlowBounds) return;
    
    const screenX = 'clientX' in event ? event.clientX : 0;
    const screenY = 'clientY' in event ? event.clientY : 0;
    const canvasX = screenX - reactFlowBounds.left;
    const canvasY = screenY - reactFlowBounds.top;
    
    setPaneContextMenu({
      x: screenX,
      y: screenY,
      canvasX,
      canvasY
    });
  }, []);

  // Right-click on card / node
  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: Node) => {
    event.preventDefault();
    event.stopPropagation();
    setPaneContextMenu(null);
    setSelectedNodeId(node.id);
    
    const screenX = event.clientX;
    const screenY = event.clientY;
    
    setNodeContextMenu({
      x: screenX,
      y: screenY,
      node
    });
  }, [setSelectedNodeId]);

  // Keyboard Shortcuts Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeId) {
        // Only if not in an input/textarea
        const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
        if (tag !== 'input' && tag !== 'textarea') {
          e.preventDefault();
          deleteNode(selectedNodeId);
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd' && selectedNodeId) {
        e.preventDefault();
        duplicateNode(selectedNodeId);
      }
      if (e.key === 'Escape') {
        setPaneContextMenu(null);
        setNodeContextMenu(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNodeId, deleteNode, duplicateNode]);

  const handleAddCard = (type: StoryNodeType, position?: { x: number; y: number }) => {
    setPaneContextMenu(null);
    const pos = position || { 
      x: 300 + ((nodes.length * 35) % 280), 
      y: 180 + ((nodes.length * 45) % 220) 
    };

    switch (type) {
      case 'note':
        addNodeToCanvas({
          nodeType: 'note',
          title: 'New Story Card',
          description: 'Write your idea here...',
          tags: ['Idea'],
          accentColor: '#F59E0B',
          timelineId: activeTimelineId !== 'all' ? activeTimelineId : 'time-main'
        }, pos);
        break;
      case 'character':
        addNodeToCanvas({
          nodeType: 'character',
          title: 'New Character',
          description: 'Personality, goals, and conflict...',
          tags: ['Character'],
          accentColor: '#8B5CF6',
          timelineId: activeTimelineId !== 'all' ? activeTimelineId : 'time-main'
        }, pos);
        break;
      case 'scene':
        addNodeToCanvas({
          nodeType: 'scene',
          title: 'Scene: EXT. LOCATION - NIGHT',
          description: 'Key dramatic beat...',
          statusBadge: 'Draft',
          accentColor: '#F97316',
          timelineId: activeTimelineId !== 'all' ? activeTimelineId : 'time-main'
        }, pos);
        break;
      case 'image':
        setUrlModal({ type: 'image', position: pos });
        setUrlInput('');
        setTitleInput('');
        break;
      case 'video':
        setUrlModal({ type: 'video', position: pos });
        setUrlInput('');
        setTitleInput('');
        break;
      case 'timeline':
        addNodeToCanvas({
          nodeType: 'timeline',
          sequenceNumber: nodes.length + 1,
          title: 'Key Story Event',
          description: 'Sequence beat breakdown',
          accentColor: '#3B82F6',
          timelineId: activeTimelineId !== 'all' ? activeTimelineId : 'time-main'
        }, pos);
        break;
      case 'subboard':
        addNodeToCanvas({
          nodeType: 'subboard',
          title: 'Act Sequence Breakdown',
          description: 'Nested canvas for shot breakdowns',
          subBoardId: `sub-${nodes.length + 1}`,
          subBoardTitle: 'Act Breakdown',
          accentColor: '#10B981',
          timelineId: activeTimelineId !== 'all' ? activeTimelineId : 'time-main'
        }, pos);
        break;
    }
  };

  const handleAddConnectedCard = (originNode: Node, type: StoryNodeType) => {
    setNodeContextMenu(null);
    const newPos = {
      x: originNode.position.x + 320,
      y: originNode.position.y
    };
    handleAddCard(type, newPos);
  };

  const handleUrlSubmit = () => {
    if (!urlModal) return;
    
    if (urlModal.type === 'image') {
      addNodeToCanvas({
        nodeType: 'image',
        title: titleInput || 'Image Reference',
        imageUrl: urlInput || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
        description: 'Visual reference',
        accentColor: '#EC4899',
        timelineId: activeTimelineId !== 'all' ? activeTimelineId : 'time-main'
      }, urlModal.position);
    } else {
      addNodeToCanvas({
        nodeType: 'video',
        title: titleInput || 'Video Reference',
        videoUrl: urlInput || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        creatorNotes: 'Reference video',
        accentColor: '#06B6D4',
        timelineId: activeTimelineId !== 'all' ? activeTimelineId : 'time-main'
      }, urlModal.position);
    }
    
    setUrlModal(null);
    setUrlInput('');
    setTitleInput('');
  };

  const handleCreateTimelineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTimelineName.trim()) return;
    createTimeline(newTimelineName.trim(), newTimelineColor);
    setNewTimelineName('');
    setShowNewTimelineModal(false);
  };

  const currentBoardTitle = breadcrumbStack[breadcrumbStack.length - 1].title;

  // Filter nodes according to active timeline filter
  const displayedNodes = useMemo(() => {
    if (activeTimelineId === 'all') return nodes;
    return nodes.filter((n) => {
      const nodeData = n.data as { timelineId?: string };
      return !nodeData.timelineId || nodeData.timelineId === activeTimelineId;
    });
  }, [nodes, activeTimelineId]);

  const contextMenuItems = [
    { type: 'note' as StoryNodeType, label: 'Note Card', icon: StickyNote, color: 'text-amber-400' },
    { type: 'character' as StoryNodeType, label: 'Character', icon: User, color: 'text-purple-400' },
    { type: 'scene' as StoryNodeType, label: 'Scene', icon: Film, color: 'text-orange-400' },
    { type: 'image' as StoryNodeType, label: 'Add Image (URL)', icon: ImageIcon, color: 'text-pink-400' },
    { type: 'video' as StoryNodeType, label: 'Add Video Reference (URL)', icon: Video, color: 'text-cyan-400' },
    { type: 'timeline' as StoryNodeType, label: 'Timeline Beat', icon: Clock, color: 'text-blue-400' },
    { type: 'subboard' as StoryNodeType, label: 'Sub-board', icon: Layers, color: 'text-emerald-400' },
  ];

  const colorOptions = [
    { label: 'Amber', value: '#F59E0B' },
    { label: 'Purple', value: '#8B5CF6' },
    { label: 'Cyan', value: '#06B6D4' },
    { label: 'Emerald', value: '#10B981' },
    { label: 'Orange', value: '#F97316' },
    { label: 'Pink', value: '#EC4899' },
  ];

  return (
    <div className="flex-1 h-full flex bg-[#0B0D11] relative overflow-hidden pb-16 md:pb-0" ref={flowRef}>
      {/* Top Toolbar & Timeline Tracks Bar */}
      <div className="absolute top-2 left-2 sm:top-4 sm:left-6 z-10 flex items-center gap-2 sm:gap-3 flex-wrap max-w-[95vw] sm:max-w-[85vw]">
        {/* Main Board Badge & Add Button */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 bg-[#14171F]/90 backdrop-blur-md border border-white/10 p-1.5 sm:p-2 rounded-xl shadow-2xl">
          <div className="flex items-center gap-1.5 px-1.5 sm:px-2 border-r border-white/10">
            <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            <span className="font-bold text-xs text-white truncate max-w-[100px] sm:max-w-none">{currentBoardTitle}</span>
          </div>

          {/* Quick Add Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAddMenu(!showAddMenu)}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Add Card</span>
            </button>

            {showAddMenu && (
              <>
                <div 
                  className="fixed inset-0 z-30" 
                  onClick={() => setShowAddMenu(false)} 
                />
                <div className="absolute top-10 left-0 w-56 bg-[#14171F] border border-white/10 rounded-xl shadow-2xl shadow-black/60 p-1.5 space-y-1 z-40 animate-in fade-in zoom-in-95">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 px-2.5 py-1">Choose Card Type</p>
                  {contextMenuItems.map((item) => (
                    <button
                      type="button"
                      key={item.type}
                      onClick={() => {
                        setShowAddMenu(false);
                        handleAddCard(item.type);
                      }}
                      className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-200 hover:bg-white/10 transition-colors"
                    >
                      <item.icon className={`w-4 h-4 ${item.color}`} />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Storyline Timeline Tracks Bar */}
        <div className="flex items-center gap-1 sm:gap-1.5 bg-[#14171F]/90 backdrop-blur-md border border-white/10 p-1 sm:p-1.5 rounded-xl shadow-2xl overflow-x-auto scrollbar-none max-w-[90vw] sm:max-w-none">
          <div className="flex items-center gap-1 text-[10px] text-gray-500 font-bold uppercase tracking-wider px-1.5 sm:px-2 border-r border-white/10">
            <GitBranch className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Timelines</span>
          </div>

          <button
            type="button"
            onClick={() => setActiveTimelineId('all')}
            className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTimelineId === 'all'
                ? 'bg-amber-500 text-black shadow'
                : 'bg-white/[0.04] text-gray-400 hover:text-white'
            }`}
          >
            All ({nodes.length})
          </button>

          {timelines.map((tl) => (
            <button
              type="button"
              key={tl.id}
              onClick={() => setActiveTimelineId(tl.id)}
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1 sm:gap-1.5 ${
                activeTimelineId === tl.id
                  ? 'bg-white/20 text-white border border-white/30 shadow'
                  : 'bg-white/[0.04] text-gray-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tl.color }} />
              <span>{tl.name.split('(')[0]}</span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => setShowNewTimelineModal(true)}
            className="px-2 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-amber-400 text-xs font-semibold flex items-center gap-1"
            title="Create new narrative timeline track"
          >
            <Plus className="w-3 h-3" />
            <span className="hidden sm:inline">New Track</span>
          </button>
        </div>
      </div>

      {/* Right Hint Badge */}
      <div className="hidden lg:flex absolute top-4 right-6 z-10 bg-[#14171F]/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl shadow-lg items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
        <span className="text-[11px] text-gray-300 font-medium">Right-click cards for quick actions & shortcuts</span>
      </div>

      {/* Right-Click ON CANVAS Context Menu */}
      {paneContextMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setPaneContextMenu(null)}
            onContextMenu={(e) => { e.preventDefault(); setPaneContextMenu(null); }}
          />
          <div 
            className="fixed z-50 w-56 bg-[#14171F] border border-white/10 rounded-xl shadow-2xl shadow-black/50 p-1.5 animate-in fade-in zoom-in-95 duration-100"
            style={{ 
              left: Math.min(paneContextMenu.x, window.innerWidth - 240), 
              top: Math.min(paneContextMenu.y, window.innerHeight - 350) 
            }}
          >
            <div className="px-3 py-2 border-b border-white/5 mb-1 flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Add to Board</p>
              <span className="text-[9px] text-gray-600 font-mono">Right-click</span>
            </div>
            {contextMenuItems.map((item) => (
              <button
                type="button"
                key={item.type}
                onClick={() => handleAddCard(item.type, { x: paneContextMenu.canvasX, y: paneContextMenu.canvasY })}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-200 hover:bg-white/10 transition-colors"
              >
                <item.icon className={`w-4 h-4 ${item.color}`} />
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Right-Click ON CARD Shortcut Menu */}
      {nodeContextMenu && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setNodeContextMenu(null)}
            onContextMenu={(e) => { e.preventDefault(); setNodeContextMenu(null); }}
          />
          <div 
            className="fixed z-50 w-64 bg-[#14171F] border border-white/10 rounded-xl shadow-2xl shadow-black/60 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-100"
            style={{ 
              left: Math.min(nodeContextMenu.x, window.innerWidth - 270), 
              top: Math.min(nodeContextMenu.y, window.innerHeight - 400) 
            }}
          >
            <div className="px-2.5 py-1.5 border-b border-white/5 mb-1">
              <p className="text-xs font-bold text-white truncate">
                {(nodeContextMenu.node.data?.title as string) || 'Card Actions'}
              </p>
              <p className="text-[10px] text-gray-500">Quick card shortcuts</p>
            </div>

            {/* Duplicate */}
            <button
              type="button"
              onClick={() => {
                duplicateNode(nodeContextMenu.node.id);
                setNodeContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-200 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Copy className="w-3.5 h-3.5 text-amber-400" />
                <span>Duplicate Card</span>
              </div>
              <kbd className="text-[9px] text-gray-500 font-mono">Ctrl+D</kbd>
            </button>

            {/* Delete */}
            <button
              type="button"
              onClick={() => {
                deleteNode(nodeContextMenu.node.id);
                setNodeContextMenu(null);
              }}
              className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Card</span>
              </div>
              <kbd className="text-[9px] text-rose-400/60 font-mono">Del</kbd>
            </button>

            {/* Link to Script Scene */}
            <button
              type="button"
              onClick={() => {
                createScriptSceneFromCard(nodeContextMenu.node.id, (nodeContextMenu.node.data?.title as string) || 'Scene');
                setNodeContextMenu(null);
              }}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium text-orange-400 hover:bg-orange-500/10 transition-colors"
            >
              <Film className="w-3.5 h-3.5" />
              <span>Create Screenplay Scene</span>
            </button>

            {/* Color Switcher */}
            <div className="pt-1.5 border-t border-white/5 px-2.5 py-1">
              <p className="text-[10px] uppercase font-bold text-gray-500 mb-1.5 flex items-center gap-1">
                <Palette className="w-3 h-3" />
                <span>Change Color</span>
              </p>
              <div className="flex items-center gap-1.5">
                {colorOptions.map((c) => (
                  <button
                    type="button"
                    key={c.value}
                    onClick={() => {
                      updateNodeData(nodeContextMenu.node.id, { accentColor: c.value });
                      setNodeContextMenu(null);
                    }}
                    className="w-5 h-5 rounded-full border border-white/20 hover:scale-125 transition-transform"
                    style={{ backgroundColor: c.value }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Assign Timeline */}
            <div className="pt-1.5 border-t border-white/5 px-2.5 py-1">
              <p className="text-[10px] uppercase font-bold text-gray-500 mb-1 flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                <span>Assign to Timeline</span>
              </p>
              <div className="space-y-0.5">
                {timelines.map((tl) => (
                  <button
                    type="button"
                    key={tl.id}
                    onClick={() => {
                      assignNodeTimeline(nodeContextMenu.node.id, tl.id);
                      setNodeContextMenu(null);
                    }}
                    className="w-full flex items-center gap-1.5 px-2 py-1 rounded text-[11px] text-gray-300 hover:bg-white/10 transition-colors text-left truncate"
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: tl.color }} />
                    <span className="truncate">{tl.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Add Connected Node */}
            <div className="pt-1.5 border-t border-white/5 px-2.5 py-1">
              <p className="text-[10px] uppercase font-bold text-gray-500 mb-1 flex items-center gap-1">
                <ArrowRight className="w-3 h-3" />
                <span>Add Connected Node</span>
              </p>
              <div className="grid grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => handleAddConnectedCard(nodeContextMenu.node, 'note')}
                  className="px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[10px] font-medium text-amber-300 text-center"
                >
                  + Note Card
                </button>
                <button
                  type="button"
                  onClick={() => handleAddConnectedCard(nodeContextMenu.node, 'image')}
                  className="px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[10px] font-medium text-pink-300 text-center"
                >
                  + Image Ref
                </button>
                <button
                  type="button"
                  onClick={() => handleAddConnectedCard(nodeContextMenu.node, 'video')}
                  className="px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[10px] font-medium text-cyan-300 text-center"
                >
                  + Video Ref
                </button>
                <button
                  type="button"
                  onClick={() => handleAddConnectedCard(nodeContextMenu.node, 'scene')}
                  className="px-2 py-1 rounded bg-white/[0.04] hover:bg-white/[0.08] text-[10px] font-medium text-orange-300 text-center"
                >
                  + Scene Card
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* New Timeline Track Modal */}
      {showNewTimelineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#14171F] border border-white/10 rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-amber-400" />
                <span>Create Narrative Timeline Track</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNewTimelineModal(false)}
                className="p-1 text-gray-500 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTimelineSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Timeline Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flashback 1995, Subplot C, Alt Ending..."
                  value={newTimelineName}
                  onChange={(e) => setNewTimelineName(e.target.value)}
                  className="w-full bg-[#0B0D11] border border-white/10 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-300">Track Color</label>
                <div className="flex items-center gap-2">
                  {colorOptions.map((c) => (
                    <button
                      type="button"
                      key={c.value}
                      onClick={() => setNewTimelineColor(c.value)}
                      className={`w-7 h-7 rounded-full border transition-all ${
                        newTimelineColor === c.value ? 'ring-2 ring-white scale-110' : 'border-white/20'
                      }`}
                      style={{ backgroundColor: c.value }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewTimelineModal(false)}
                  className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-amber-500 text-black font-bold text-xs hover:bg-amber-400 transition-colors shadow-lg"
                >
                  Create Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* URL Input Modal (for Image / Video) */}
      {urlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#14171F] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {urlModal.type === 'image' ? (
                  <ImageIcon className="w-5 h-5 text-pink-400" />
                ) : (
                  <Video className="w-5 h-5 text-cyan-400" />
                )}
                <h3 className="text-sm font-bold text-white">
                  {urlModal.type === 'image' ? 'Add Image Reference' : 'Add Video Reference'}
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => { setUrlModal(null); setUrlInput(''); setTitleInput(''); }}
                className="p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Title Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                Title (optional)
              </label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                placeholder={urlModal.type === 'image' ? 'e.g. Rainy street mood' : 'e.g. Camera movement reference'}
                className="w-full bg-[#0B0D11] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
              />
            </div>

            {/* URL Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1">
                <LinkIcon className="w-3 h-3" />
                {urlModal.type === 'image' ? 'Image URL' : 'Video URL (YouTube, Vimeo, etc.)'}
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={urlModal.type === 'image' ? 'https://example.com/image.jpg' : 'https://youtube.com/watch?v=...'}
                className="w-full bg-[#0B0D11] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-amber-500/50 transition-colors"
                autoFocus
                onKeyDown={(e) => { if (e.key === 'Enter') handleUrlSubmit(); }}
              />
              <p className="text-[10px] text-gray-500">
                {urlModal.type === 'image' 
                  ? 'Paste any image URL. Leave empty for a placeholder.' 
                  : 'Paste any video URL (YouTube, Vimeo, etc.). Leave empty for a placeholder.'}
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => { setUrlModal(null); setUrlInput(''); setTitleInput(''); }}
                className="flex-1 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs text-gray-300 font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUrlSubmit}
                className="flex-1 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-black font-bold text-xs shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                Add to Board
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main React Flow Canvas */}
      <div className="flex-1 w-full h-full">
        {displayedNodes.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 z-10 bg-[#0B0D11]/90">
            <LayoutGrid className="w-14 h-14 stroke-1 text-amber-500/60 mb-4 animate-bounce" />
            <h3 className="text-xl font-bold text-white tracking-wide">No cards in this timeline track</h3>
            <p className="text-xs text-gray-400 mt-2 max-w-md leading-relaxed">
              Right-click anywhere to add cards or switch to &quot;All Tracks&quot; to see all cards.
            </p>
            <button
              type="button"
              onClick={() => handleAddCard('note')}
              className="mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-orange-400 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Add card to timeline</span>
            </button>
          </div>
        ) : null}

        <ReactFlow
          nodes={displayedNodes}
          edges={edges}
          onNodesChange={(changes) => {
            setNodes((nds) => applyNodeChanges(changes, nds));
          }}
          onEdgesChange={(changes) => {
            setEdges((eds) => applyEdgeChanges(changes, eds));
          }}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          onPaneContextMenu={onPaneContextMenu}
          onNodeContextMenu={onNodeContextMenu}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          fitView
          colorMode="dark"
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1.5} color="#1E2330" />
          <Controls position="bottom-right" />
          <MiniMap 
            position="bottom-left" 
            nodeColor={(node) => {
              if (node.type === 'sceneCard') return '#F97316';
              if (node.type === 'characterCard') return '#8B5CF6';
              if (node.type === 'subboardCard') return '#10B981';
              if (node.type === 'imageCard') return '#EC4899';
              if (node.type === 'videoCard') return '#06B6D4';
              return '#F59E0B';
            }}
          />
        </ReactFlow>
      </div>

      {/* Right Inspector Panel */}
      <InspectorPanel />
    </div>
  );
};
