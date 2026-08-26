'use client';

import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Link from '@tiptap/extension-link';
import { 
  Search, 
  Plus, 
  Tag, 
  Calendar, 
  Link2, 
  Send, 
  Trash2, 
  Bold, 
  Italic, 
  List, 
  CheckSquare, 
  Highlighter, 
  Heading1, 
  Heading2, 
  Sparkles,
  ExternalLink,
  ChevronRight,
  SidebarClose,
  SidebarOpen,
  FileText,
  ArrowLeft
} from 'lucide-react';
import { useStory } from '../../context/StoryContext';
import { NoteTag } from '../../types';

export const NotesWorkspace: React.FC = () => {
  const { 
    notes, 
    activeNoteId, 
    setActiveNoteId, 
    addNote, 
    updateNote, 
    deleteNote, 
    sendNoteToStoryboard,
    openScriptScene,
    openLinkedCardInStoryboard
  } = useStory();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<NoteTag>('All');
  const [showRightPanel, setShowRightPanel] = useState(true);
  const [selectedText, setSelectedText] = useState('');
  const [popoverPos, setPopoverPos] = useState<{ top: number; left: number } | null>(null);
  
  // Mobile active tab view ('list' | 'editor' | 'context')
  const [mobileView, setMobileView] = useState<'list' | 'editor' | 'context'>('editor');

  const activeNote = notes.find((n) => n.id === activeNoteId) || notes[0];

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      TaskList,
      TaskItem,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({
        placeholder: 'Write your story ideas, dialogue, character beats, or visual concepts...'
      })
    ],
    content: activeNote ? activeNote.content : '',
    onUpdate: ({ editor }) => {
      if (activeNote) {
        updateNote(activeNote.id, { content: editor.getText() });
      }
    },
    onSelectionUpdate: ({ editor }) => {
      const { from, to } = editor.state.selection;
      if (from !== to) {
        const text = editor.state.doc.textBetween(from, to, ' ');
        if (text.trim().length > 0) {
          setSelectedText(text);
          const selection = window.getSelection();
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            setPopoverPos({
              top: rect.top - 50,
              left: rect.left + rect.width / 2 - 80
            });
          }
          return;
        }
      }
      setSelectedText('');
      setPopoverPos(null);
    }
  });

  useEffect(() => {
    if (editor && activeNote) {
      if (editor.getText() !== activeNote.content) {
        editor.commands.setContent(activeNote.content);
      }
    }
  }, [activeNoteId, activeNote, editor]);

  const tagsList: NoteTag[] = ['All', 'Ideas', 'Characters', 'Dialogue', 'References', 'Locations'];

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleSendSelectionToBoard = () => {
    if (selectedText.trim() && activeNote) {
      sendNoteToStoryboard(selectedText.trim(), activeNote.title);
      setSelectedText('');
      setPopoverPos(null);
    }
  };

  const handleSendEntireNoteToBoard = () => {
    if (activeNote) {
      sendNoteToStoryboard(activeNote.content, activeNote.title);
    }
  };

  const handleCreateNewNote = () => {
    addNote({ title: 'New Story Idea', content: '' });
    setMobileView('editor');
  };

  const handleSelectNoteMobile = (id: string) => {
    setActiveNoteId(id);
    setMobileView('editor');
  };

  return (
    <div className="flex-1 h-full flex bg-[#0B0D11] overflow-hidden relative pb-16 md:pb-0">
      {/* 1. Left Note List */}
      <div className={`w-full md:w-72 bg-[#12151D] border-r border-white/5 flex flex-col shrink-0 ${
        mobileView === 'list' ? 'flex' : 'hidden md:flex'
      }`}>
        {/* Top Controls */}
        <div className="p-3 space-y-2 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Notes List ({filteredNotes.length})</span>
            </h2>
            <button
              type="button"
              onClick={handleCreateNewNote}
              className="p-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-all flex items-center gap-1 text-xs px-2 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-500" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#181C26] border border-white/5 rounded-lg pl-8 pr-3 py-1.5 text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-amber-500/50 transition-all"
            />
          </div>

          {/* Tag Filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
            {tagsList.map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-medium whitespace-nowrap transition-all ${
                  selectedTag === tag
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-white/[0.03] text-gray-400 hover:bg-white/[0.06]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Note List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredNotes.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-xs">
              <p>No notes found.</p>
            </div>
          ) : (
            filteredNotes.map((note) => {
              const isActive = note.id === activeNoteId;
              return (
                <div
                  key={note.id}
                  onClick={() => handleSelectNoteMobile(note.id)}
                  className={`p-3 rounded-xl cursor-pointer transition-all duration-150 border ${
                    isActive
                      ? 'bg-amber-500/10 border-amber-500/30 text-white shadow-sm'
                      : 'bg-white/[0.02] hover:bg-white/[0.05] border-transparent text-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-semibold text-xs truncate ${isActive ? 'text-amber-400' : 'text-gray-200'}`}>
                      {note.title || 'Untitled Note'}
                    </h3>
                    <span className="text-[10px] text-gray-500 whitespace-nowrap">{note.date}</span>
                  </div>
                  <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 font-normal leading-relaxed">
                    {note.content || 'Empty note...'}
                  </p>
                  {note.tags.length > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      {note.tags.slice(0, 2).map((t) => (
                        <span key={t} className="px-1.5 py-0.5 rounded text-[9px] bg-white/[0.06] text-gray-400">
                          {t}
                        </span>
                      ))}
                      {note.linkedItems.length > 0 && (
                        <span className="text-[9px] text-amber-400/80 flex items-center gap-0.5 ml-auto">
                          <Link2 className="w-2.5 h-2.5" />
                          {note.linkedItems.length}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Main Note Editor (Center) */}
      <div className={`flex-1 flex-col bg-[#0B0D11] overflow-y-auto relative ${
        mobileView === 'editor' ? 'flex' : 'hidden md:flex'
      }`}>
        {/* Mobile Top Navigation Subheader */}
        <div className="md:hidden flex items-center justify-between p-3 border-b border-white/5 bg-[#14171F]">
          <button
            type="button"
            onClick={() => setMobileView('list')}
            className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold px-2 py-1 rounded bg-amber-500/10"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Notes List</span>
          </button>
          
          <button
            type="button"
            onClick={() => setMobileView('context')}
            className="flex items-center gap-1 text-xs text-gray-300 font-medium px-2 py-1 rounded bg-white/5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Links ({activeNote?.linkedItems.length || 0})</span>
          </button>
        </div>

        {activeNote ? (
          <div className="max-w-3xl w-full mx-auto p-4 sm:p-8 space-y-5 sm:space-y-6 flex-1 flex flex-col">
            {/* Metadata Header */}
            <div className="space-y-3 sm:space-y-4 border-b border-white/5 pb-4">
              <div className="flex items-center justify-between gap-2">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                  placeholder="Note Title..."
                  className="text-xl sm:text-2xl font-bold bg-transparent text-white focus:outline-none placeholder-gray-600 w-full"
                />
                <button
                  type="button"
                  onClick={() => deleteNote(activeNote.id)}
                  className="p-1.5 rounded text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 text-xs text-gray-400 flex-wrap">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{activeNote.date}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  <Tag className="w-3.5 h-3.5 text-gray-500" />
                  {activeNote.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-white/[0.05] text-amber-300 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Rich Text Toolbar */}
            {editor && (
              <div className="flex items-center gap-1 p-1 bg-[#14171F] border border-white/5 rounded-lg overflow-x-auto scrollbar-none shrink-0">
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    editor.isActive('bold') ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    editor.isActive('italic') ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    editor.isActive('heading', { level: 1 }) ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Heading 1"
                >
                  <Heading1 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    editor.isActive('heading', { level: 2 }) ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Heading 2"
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    editor.isActive('bulletList') ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Bullet List"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleTaskList().run()}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    editor.isActive('taskList') ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Task Checklist"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor.chain().focus().toggleHighlight().run()}
                  className={`p-1.5 rounded text-xs transition-colors ${
                    editor.isActive('highlight') ? 'bg-amber-500/20 text-amber-400' : 'text-gray-400 hover:text-white'
                  }`}
                  title="Highlight"
                >
                  <Highlighter className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Note Editor Area */}
            <div className="flex-1 prose prose-invert max-w-none focus:outline-none min-h-[300px]">
              <EditorContent editor={editor} className="min-h-[300px] text-gray-200 leading-relaxed text-sm" />
            </div>

            {/* Floating Selection Action Popover */}
            {popoverPos && selectedText && (
              <div
                className="fixed z-50 bg-[#181D28] border border-amber-500/40 rounded-xl shadow-2xl p-1.5 flex items-center gap-1.5 animate-in fade-in zoom-in-95 duration-150"
                style={{ top: `${popoverPos.top}px`, left: `${popoverPos.left}px` }}
              >
                <button
                  type="button"
                  onClick={handleSendSelectionToBoard}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold text-xs shadow-md hover:from-amber-400 hover:to-orange-400 transition-all"
                >
                  <Send className="w-3 h-3" />
                  <span>Send to Storyboard</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 text-sm">
            <FileText className="w-12 h-12 mb-3 stroke-1 text-gray-600" />
            <p>Select a note from the left or create a new one.</p>
          </div>
        )}
      </div>

      {/* 3. Right Context & Links Panel */}
      <div className={`w-full md:w-72 bg-[#12151D] border-l border-white/5 flex flex-col shrink-0 ${
        mobileView === 'context' ? 'flex' : 'hidden md:flex'
      }`}>
        <div className="p-4 border-b border-white/5 flex items-center justify-between">
          {/* Mobile back button */}
          <button
            type="button"
            onClick={() => setMobileView('editor')}
            className="md:hidden flex items-center gap-1 text-xs text-amber-400 font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Editor</span>
          </button>

          <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Context & Links</span>
          </h3>

          <button
            type="button"
            onClick={() => setShowRightPanel(!showRightPanel)}
            className="p-1 text-gray-500 hover:text-white hidden md:block"
          >
            {showRightPanel ? <SidebarClose className="w-4 h-4" /> : <SidebarOpen className="w-4 h-4" />}
          </button>
        </div>

        {showRightPanel && activeNote && (
          <div className="p-4 space-y-6 flex-1 overflow-y-auto text-xs">
            {/* Storyboard Linked Cards */}
            <div className="space-y-2">
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                Linked Storyboard Cards
              </span>
              <div 
                onClick={() => openLinkedCardInStoryboard('node-maya')}
                className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 cursor-pointer hover:bg-amber-500/15 transition-all group"
              >
                <div className="flex items-center justify-between text-amber-400 font-bold mb-1">
                  <span>{activeNote.title}</span>
                  <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
                <p className="text-[11px] text-gray-400 line-clamp-2">Visual story card linked on the canvas.</p>
              </div>
            </div>

            {/* Linked Screenplay Scene */}
            <div className="space-y-2">
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                Linked Screenplay Scenes
              </span>
              <div 
                onClick={() => openScriptScene('scene-1')}
                className="p-3 rounded-lg bg-[#181C26] border border-white/5 cursor-pointer hover:border-orange-500/30 transition-all flex items-center justify-between group"
              >
                <div>
                  <h4 className="font-bold text-gray-200 group-hover:text-orange-400 transition-colors">
                    Scene 1: EXT. BUS STOP
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">1 Page &bull; Estimated 1:30</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-500 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Connected Story Assets Tags */}
            <div className="space-y-2">
              <span className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">
                Connected Story Assets
              </span>
              <div className="flex flex-wrap gap-1.5">
                {activeNote.linkedItems.map((item) => (
                  <span
                    key={item.id}
                    className="px-2.5 py-1 rounded-lg bg-white/[0.04] border border-white/5 text-gray-300 text-[11px] flex items-center gap-1.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span>{item.name}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Action: Send Entire Note to Storyboard */}
            <div className="pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={handleSendEntireNoteToBoard}
                className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Entire Note to Storyboard</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
