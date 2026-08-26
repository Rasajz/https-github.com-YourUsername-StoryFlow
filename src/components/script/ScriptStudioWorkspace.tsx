'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  Plus, 
  Search, 
  Film, 
  Clock, 
  Download, 
  LayoutGrid, 
  ExternalLink, 
  ChevronUp, 
  ChevronDown, 
  SidebarClose, 
  SidebarOpen,
  Sparkles,
  User,
  Camera,
  Trash2,
  GitBranch,
  ArrowLeft
} from 'lucide-react';
import { useStory } from '../../context/StoryContext';
import { ScreenplayBlockType, ScreenplayBlock } from '../../types';

export const ScriptStudioWorkspace: React.FC = () => {
  const { 
    scriptScenes, 
    activeSceneId, 
    setActiveSceneId, 
    addScriptScene, 
    updateScriptScene,
    reorderScriptScenes,
    openLinkedCardInStoryboard,
    focusMode,
    showToast,
    timelines,
    assignSceneTimeline
  } = useStory();

  const [sceneSearch, setSceneSearch] = useState('');
  const [selectedTimelineFilter, setSelectedTimelineFilter] = useState<string>('all');
  const [showRefPanel, setShowRefPanel] = useState(true);
  const [scriptTheme, setScriptTheme] = useState<'paper' | 'dark'>('paper');
  const [newShotText, setNewShotText] = useState('');

  // Mobile active tab view ('script' | 'scenes' | 'references')
  const [mobileTab, setMobileTab] = useState<'script' | 'scenes' | 'references'>('script');

  const activeScene = scriptScenes.find((s) => s.id === activeSceneId) || scriptScenes[0];

  const filteredScenes = scriptScenes.filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(sceneSearch.toLowerCase());
    const matchesTimeline = selectedTimelineFilter === 'all' || s.timelineId === selectedTimelineFilter;
    return matchesSearch && matchesTimeline;
  });

  const handleBlockChange = (blockId: string, text: string) => {
    if (!activeScene) return;
    const updatedBlocks = activeScene.blocks.map((b) =>
      b.id === blockId ? { ...b, text } : b
    );
    updateScriptScene(activeScene.id, { blocks: updatedBlocks });
  };

  const handleBlockTypeChange = (blockId: string, type: ScreenplayBlockType) => {
    if (!activeScene) return;
    const updatedBlocks = activeScene.blocks.map((b) =>
      b.id === blockId ? { ...b, type } : b
    );
    updateScriptScene(activeScene.id, { blocks: updatedBlocks });
  };

  const handleAddBlock = (afterId: string, type: ScreenplayBlockType = 'action') => {
    if (!activeScene) return;
    const newBlock: ScreenplayBlock = {
      id: `b-${Date.now()}`,
      type,
      text: ''
    };
    const index = activeScene.blocks.findIndex((b) => b.id === afterId);
    const updatedBlocks = [...activeScene.blocks];
    updatedBlocks.splice(index + 1, 0, newBlock);
    updateScriptScene(activeScene.id, { blocks: updatedBlocks });
  };

  const handleKeyDown = (e: React.KeyboardEvent, block: ScreenplayBlock) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      let nextType: ScreenplayBlockType = 'action';
      if (block.type === 'character') nextType = 'dialogue';
      if (block.type === 'dialogue') nextType = 'action';
      if (block.type === 'heading') nextType = 'action';

      handleAddBlock(block.id, nextType);
    }
  };

  const handleDeleteBlock = (blockId: string) => {
    if (!activeScene || activeScene.blocks.length <= 1) return;
    const updatedBlocks = activeScene.blocks.filter((b) => b.id !== blockId);
    updateScriptScene(activeScene.id, { blocks: updatedBlocks });
  };

  const handleMoveScene = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= scriptScenes.length) return;
    const newScenes = [...scriptScenes];
    const [moved] = newScenes.splice(index, 1);
    newScenes.splice(newIndex, 0, moved);
    reorderScriptScenes(newScenes);
  };

  const handleAddShotIdea = (customText?: string) => {
    const textToAdd = customText || newShotText;
    if (!textToAdd.trim() || !activeScene) return;
    const updatedShots = [...activeScene.shotIdeas, textToAdd.trim()];
    updateScriptScene(activeScene.id, { shotIdeas: updatedShots });
    setNewShotText('');
    showToast('Shot Idea Added', `Added "${textToAdd}" to ${activeScene.title}`);
  };

  const handleDeleteShotIdea = (indexToRemove: number) => {
    if (!activeScene) return;
    const removedShot = activeScene.shotIdeas[indexToRemove];
    const updatedShots = activeScene.shotIdeas.filter((_, idx) => idx !== indexToRemove);
    updateScriptScene(activeScene.id, { shotIdeas: updatedShots });
    showToast('Camera Shot Removed', `Removed "${removedShot || 'shot'}"`);
  };

  const handleExportFormattedScript = () => {
    let exportContent = `STORYFLOW SCREENPLAY EXPORT\n====================================\n\n`;
    scriptScenes.forEach((scene) => {
      exportContent += `SCENE ${scene.number}: ${scene.title}\n`;
      if (scene.timelineId) {
        const tName = timelines.find((t) => t.id === scene.timelineId)?.name;
        if (tName) exportContent += `[Timeline: ${tName}]\n`;
      }
      exportContent += `------------------------------------\n`;
      scene.blocks.forEach((b) => {
        if (b.type === 'heading') exportContent += `\n${b.text.toUpperCase()}\n\n`;
        else if (b.type === 'action') exportContent += `${b.text}\n\n`;
        else if (b.type === 'character') exportContent += `\t\t\t${b.text.toUpperCase()}\n`;
        else if (b.type === 'parenthetical') exportContent += `\t\t(${b.text})\n`;
        else if (b.type === 'dialogue') exportContent += `\t\t${b.text}\n\n`;
        else if (b.type === 'transition') exportContent += `\t\t\t\t\t\t${b.text.toUpperCase()}:\n\n`;
      });
      exportContent += `\n`;
    });

    const blob = new Blob([exportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `StoryFlow_Screenplay_Export.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Screenplay Exported', 'Downloaded formatted screenplay .txt file');
  };

  const handleSelectSceneMobile = (id: string) => {
    setActiveSceneId(id);
    setMobileTab('script');
  };

  const cameraPresets = [
    'Close-Up (CU)',
    'Wide Establishing (WS)',
    'Over-the-Shoulder (OTS)',
    'Low Angle Hero',
    'Tracking / Dolly',
    'POV Shot'
  ];

  return (
    <div className="flex-1 h-full flex flex-col md:flex-row bg-[#0B0D11] overflow-hidden pb-16 md:pb-0">
      {/* MOBILE TOP TAB SWITCHER (Visible on mobile only) */}
      <div className="md:hidden flex items-center justify-around bg-[#14171F] border-b border-white/5 p-2 shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab('script')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mobileTab === 'script' ? 'bg-amber-500 text-black shadow' : 'text-gray-400'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          <span>Screenplay</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('scenes')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mobileTab === 'scenes' ? 'bg-amber-500 text-black shadow' : 'text-gray-400'
          }`}
        >
          <span>Scenes ({scriptScenes.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab('references')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            mobileTab === 'references' ? 'bg-amber-500 text-black shadow' : 'text-gray-400'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>References</span>
        </button>
      </div>

      {/* 1. Left Scene Navigator */}
      {!focusMode && (
        <div className={`w-full md:w-72 bg-[#12151D] border-r border-white/5 flex flex-col shrink-0 ${
          mobileTab === 'scenes' ? 'flex' : 'hidden md:flex'
        }`}>
          {/* Top Scene Controls */}
          <div className="p-3 space-y-2 border-b border-white/5">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Film className="w-3.5 h-3.5 text-orange-400" />
                <span>Scene Navigator</span>
              </h2>
              <button
                type="button"
                onClick={() => { addScriptScene(); setMobileTab('script'); }}
                className="p-1 rounded bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 transition-all flex items-center gap-1 text-xs px-2 font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New</span>
              </button>
            </div>

            {/* Scene Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search scenes..."
                value={sceneSearch}
                onChange={(e) => setSceneSearch(e.target.value)}
                className="w-full bg-[#181C26] border border-white/5 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500/50"
              />
            </div>

            {/* Timeline Filter */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
              <button
                type="button"
                onClick={() => setSelectedTimelineFilter('all')}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap transition-all ${
                  selectedTimelineFilter === 'all'
                    ? 'bg-orange-500 text-black shadow'
                    : 'bg-white/[0.04] text-gray-400 hover:text-white'
                }`}
              >
                All
              </button>
              {timelines.map((tl) => (
                <button
                  type="button"
                  key={tl.id}
                  onClick={() => setSelectedTimelineFilter(tl.id)}
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap transition-all flex items-center gap-1 ${
                    selectedTimelineFilter === tl.id
                      ? 'bg-amber-500 text-black shadow'
                      : 'bg-white/[0.04] text-gray-400 hover:text-white'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tl.color }} />
                  <span>{tl.name.split('(')[0]}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Scene List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredScenes.map((scene, idx) => {
              const isActive = scene.id === activeSceneId;
              const sceneTimeline = timelines.find((t) => t.id === scene.timelineId);
              return (
                <div
                  key={scene.id}
                  onClick={() => handleSelectSceneMobile(scene.id)}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all duration-150 border group ${
                    isActive
                      ? 'bg-orange-500/10 border-orange-500/30 text-white shadow-sm'
                      : 'bg-white/[0.02] hover:bg-white/[0.05] border-transparent text-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-white/10 text-gray-300 font-bold text-[10px] flex items-center justify-center shrink-0">
                        {scene.number}
                      </span>
                      <div className="truncate">
                        <h3 className={`font-semibold text-xs truncate max-w-[140px] ${isActive ? 'text-orange-400' : 'text-gray-200'}`}>
                          {scene.title}
                        </h3>
                        {sceneTimeline && (
                          <span className="inline-flex items-center gap-1 text-[9px] text-amber-400 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: sceneTimeline.color }} />
                            {sceneTimeline.name.split('(')[0]}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Reorder Buttons */}
                    <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleMoveScene(idx, 'up'); }}
                        className="p-0.5 rounded hover:bg-white/10 text-gray-400 hover:text-white"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleMoveScene(idx, 'down'); }}
                        className="p-0.5 rounded hover:bg-white/10 text-gray-400 hover:text-white"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-gray-500 mt-1.5 pl-7">
                    <span>{scene.pageEstimate}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />
                      {scene.durationEstimate}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Center Screenplay Editor */}
      <div className={`flex-1 flex-col h-full overflow-y-auto bg-[#0B0D11] ${
        mobileTab === 'script' ? 'flex' : 'hidden md:flex'
      }`}>
        {/* Editor Sub-Header Toolbar */}
        <div className="h-12 bg-[#14171F] border-b border-white/5 px-3 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 truncate max-w-[50vw]">
            <span className="text-xs text-gray-400 font-medium hidden sm:inline">Script:</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider truncate">
              {activeScene ? activeScene.title : 'Scene'}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Paper Theme Switcher */}
            <div className="flex items-center bg-white/[0.04] p-0.5 rounded-lg border border-white/5 text-[10px] sm:text-[11px]">
              <button
                type="button"
                onClick={() => setScriptTheme('paper')}
                className={`px-2 py-0.5 rounded font-semibold transition-all ${
                  scriptTheme === 'paper' ? 'bg-amber-500 text-black shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Paper
              </button>
              <button
                type="button"
                onClick={() => setScriptTheme('dark')}
                className={`px-2 py-0.5 rounded font-semibold transition-all ${
                  scriptTheme === 'dark' ? 'bg-amber-500 text-black shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                Dark
              </button>
            </div>

            {/* Export Screenplay Button */}
            <button
              type="button"
              onClick={handleExportFormattedScript}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-gray-200 hover:text-white border border-white/10 text-xs font-semibold transition-all shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Export (.txt)</span>
            </button>
          </div>
        </div>

        {/* Formatted Screenplay Page Container */}
        {activeScene ? (
          <div className="py-4 sm:py-8 px-2 sm:px-4 w-full flex justify-center flex-1">
            <div className={`w-full max-w-3xl rounded-xl p-5 sm:p-12 min-h-[600px] transition-all ${
              scriptTheme === 'paper' ? 'screenplay-paper' : 'screenplay-dark-paper'
            }`}>
              {/* Scene Title Header */}
              <div className="mb-4 sm:mb-6 border-b pb-2 sm:pb-3 border-black/10 flex items-center justify-between">
                <input
                  type="text"
                  value={activeScene.title}
                  onChange={(e) => updateScriptScene(activeScene.id, { title: e.target.value })}
                  className="text-base sm:text-lg font-bold tracking-wider uppercase bg-transparent focus:outline-none w-full font-mono"
                />
              </div>

              {/* Screenplay Content Blocks */}
              <div className="space-y-3 font-mono text-xs sm:text-sm leading-relaxed">
                {activeScene.blocks.map((block) => {
                  return (
                    <div key={block.id} className="relative group flex flex-col sm:flex-row items-start gap-1">
                      {/* Block Type Switcher Toolbar */}
                      <div className="flex sm:absolute sm:-left-16 sm:top-1 sm:opacity-0 sm:group-hover:opacity-100 items-center gap-1 bg-[#14171F] border border-white/10 p-1 rounded-md shadow-lg z-20 text-[10px]">
                        <select
                          value={block.type}
                          onChange={(e) => handleBlockTypeChange(block.id, e.target.value as ScreenplayBlockType)}
                          className="bg-transparent text-gray-300 focus:outline-none cursor-pointer text-[10px]"
                        >
                          <option value="heading">Heading</option>
                          <option value="action">Action</option>
                          <option value="character">Character</option>
                          <option value="dialogue">Dialogue</option>
                          <option value="parenthetical">Parenthetical</option>
                          <option value="transition">Transition</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleDeleteBlock(block.id)}
                          className="p-0.5 rounded text-gray-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Screenplay Block Input */}
                      <div className="w-full">
                        {block.type === 'heading' && (
                          <input
                            type="text"
                            value={block.text}
                            onChange={(e) => handleBlockChange(block.id, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, block)}
                            placeholder="EXT. LOCATION - DAY"
                            className="font-bold tracking-wide uppercase w-full bg-transparent focus:outline-none border-b border-dashed border-amber-500/20 py-1"
                          />
                        )}

                        {block.type === 'action' && (
                          <textarea
                            rows={2}
                            value={block.text}
                            onChange={(e) => handleBlockChange(block.id, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(e, block)}
                            placeholder="Action description..."
                            className="w-full bg-transparent focus:outline-none resize-none leading-relaxed"
                          />
                        )}

                        {block.type === 'character' && (
                          <div className="text-center w-full">
                            <input
                              type="text"
                              value={block.text}
                              onChange={(e) => handleBlockChange(block.id, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, block)}
                              placeholder="CHARACTER NAME"
                              className="font-bold uppercase tracking-wider text-center bg-transparent focus:outline-none w-full sm:w-1/2 mx-auto"
                            />
                          </div>
                        )}

                        {block.type === 'parenthetical' && (
                          <div className="text-center w-full">
                            <input
                              type="text"
                              value={block.text}
                              onChange={(e) => handleBlockChange(block.id, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, block)}
                              placeholder="(whispering)"
                              className="italic text-center bg-transparent focus:outline-none w-full sm:w-1/3 mx-auto text-xs"
                            />
                          </div>
                        )}

                        {block.type === 'dialogue' && (
                          <div className="w-full sm:w-3/4 mx-auto">
                            <textarea
                              rows={2}
                              value={block.text}
                              onChange={(e) => handleBlockChange(block.id, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, block)}
                              placeholder="Character dialogue..."
                              className="w-full bg-transparent focus:outline-none resize-none text-center leading-relaxed"
                            />
                          </div>
                        )}

                        {block.type === 'transition' && (
                          <div className="text-right w-full">
                            <input
                              type="text"
                              value={block.text}
                              onChange={(e) => handleBlockChange(block.id, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(e, block)}
                              placeholder="CUT TO:"
                              className="font-bold uppercase tracking-wider text-right bg-transparent focus:outline-none w-full sm:w-1/3 ml-auto"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* 3. Right Scene References Panel */}
      {!focusMode && (
        <div className={`w-full md:w-80 bg-[#12151D] border-l border-white/5 flex-col shrink-0 overflow-y-auto ${
          mobileTab === 'references' ? 'flex' : 'hidden md:flex'
        }`}>
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setMobileTab('script')}
              className="md:hidden flex items-center gap-1 text-xs text-amber-400 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Script</span>
            </button>

            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Scene References</span>
            </h3>

            <button
              type="button"
              onClick={() => setShowRefPanel(!showRefPanel)}
              className="p-1 text-gray-500 hover:text-white hidden md:block"
            >
              {showRefPanel ? <SidebarClose className="w-4 h-4" /> : <SidebarOpen className="w-4 h-4" />}
            </button>
          </div>

          {showRefPanel && activeScene && (
            <div className="p-4 space-y-5 text-xs">
              {/* Timeline Track Selector */}
              <div className="space-y-1.5">
                <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <GitBranch className="w-3.5 h-3.5 text-amber-400" />
                  <span>Timeline Track</span>
                </p>
                <select
                  value={activeScene.timelineId || 'time-main'}
                  onChange={(e) => assignSceneTimeline(activeScene.id, e.target.value)}
                  className="w-full bg-[#181C26] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  {timelines.map((tl) => (
                    <option key={tl.id} value={tl.id}>
                      {tl.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Linked Storyboard Node */}
              <div className="space-y-1.5">
                <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Linked Storyboard Card</p>
                {activeScene.linkedCardId ? (
                  <div 
                    onClick={() => openLinkedCardInStoryboard(activeScene.linkedCardId!)}
                    className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 cursor-pointer hover:bg-amber-500/15 transition-all group"
                  >
                    <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
                      <span>Linked Card</span>
                      <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                    <p className="text-[11px] text-gray-400 line-clamp-2">Visual story node on canvas.</p>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => openLinkedCardInStoryboard('node-scene-1')}
                    className="w-full py-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 text-gray-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <LayoutGrid className="w-3.5 h-3.5 text-amber-400" />
                    <span>Open Storyboard Canvas</span>
                  </button>
                )}
              </div>

              {/* Characters Chips */}
              <div className="space-y-2">
                <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Characters in Scene</p>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {activeScene.characterChips.map((char) => (
                    <span key={char} className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-semibold flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {char}
                    </span>
                  ))}
                </div>
              </div>

              {/* Mood Image Preview */}
              {activeScene.moodImage && (
                <div className="space-y-2">
                  <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Mood Image Preview</p>
                  <div className="rounded-lg overflow-hidden border border-white/10 h-32 relative">
                    <Image src={activeScene.moodImage} alt="Mood" fill className="object-cover" unoptimized />
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[9px] text-gray-200">
                      Visual reference
                    </div>
                  </div>
                </div>
              )}

              {/* Narrative Purpose */}
              <div className="space-y-1.5">
                <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Dramatic Purpose</p>
                <p className="text-gray-300 bg-[#181C26] p-2.5 rounded-lg border border-white/5 leading-relaxed">
                  {activeScene.storyPurpose || 'Define dramatic stakes...'}
                </p>
              </div>

              {/* Shot Ideas List */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Shot Ideas & Camera Angles ({activeScene.shotIdeas.length})</span>
                  </p>
                </div>

                {/* List with Delete Button */}
                <div className="space-y-1.5">
                  {activeScene.shotIdeas.map((shot, idx) => (
                    <div 
                      key={idx} 
                      className="p-2 rounded-lg bg-[#181C26] border border-white/5 text-gray-300 flex items-center justify-between gap-2 group hover:border-cyan-500/30 transition-colors"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                        <span className="truncate">{shot}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteShotIdea(idx)}
                        className="p-1 text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors shrink-0"
                        title="Delete this camera shot angle"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Quick Presets */}
                <div className="space-y-1 pt-1">
                  <p className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">Quick Presets</p>
                  <div className="flex items-center gap-1 flex-wrap">
                    {cameraPresets.map((preset) => (
                      <button
                        type="button"
                        key={preset}
                        onClick={() => handleAddShotIdea(preset)}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-white/[0.04] hover:bg-cyan-500/10 hover:text-cyan-300 border border-white/5 hover:border-cyan-500/20 text-gray-400 transition-colors"
                      >
                        + {preset}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Input */}
                <div className="flex items-center gap-1 pt-1">
                  <input
                    type="text"
                    placeholder="Custom camera angle..."
                    value={newShotText}
                    onChange={(e) => setNewShotText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleAddShotIdea(); }}
                    className="flex-1 bg-[#181C26] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddShotIdea()}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-colors shadow"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
