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
  FileText
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
          // Calculate selection coordinates
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

  // Sync editor content when activeNote changes
  useEffect(() => {
    if (editor && activeNote) {
      if (editor.getText() !== activeNote.content) {
        editor.commands.setContent(activeNote.content);
      }
    }
  }, [activeNoteId, editor, activeNote]);

  const tagsList: NoteTag[] = ['All', 'Ideas', 'Characters', 'Dialogue', 'References', 'Locations'];

  const filteredNotes = notes.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === 'All' || n.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const handleSendSelectedToStoryboard = () => {
    if (selectedText && activeNote) {
      sendNoteToStoryboard(selectedText, activeNote.title);
      setSelectedText('');
      setPopoverPos(null);
    }
  };

  return (
    <div className="flex-1 h-[calc(100vh-3.5rem)] flex bg-[#0B0D11] overflow-hidden">
      {/* Left Note List Panel (~280px) */}
      <div className="w-72 bg-[#12151D] border-r border-white/5 flex flex-col shrink-0">
        {/* Top Controls */}
        <div className="p-3 space-y-2 border-b border-white/5">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>Notes List</span>
            </h2>
            <button
              onClick={() => addNote({ title: 'New Story Idea', content: '' })}
              className="p-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-all flex items-center gap-1 text-xs px-2 font-medium"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New</span>
            </button>
          </div>

          {/* Search Box */}
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
                  onClick={() => setActiveNoteId(note.id)}
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

      {/* Main Note Editor (Center) */}
      <div className="flex-1 flex flex-col bg-[#0B0D11] overflow-y-auto relative">
        {activeNote ? (
          <div className="max-w-3xl w-full mx-auto p-8 space-y-6 flex-1 flex flex-col">
            {/* Metadata Header */}
            <div className="space-y-4 border-b border-white/5 pb-4">
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={activeNote.title}
                  onChange={(e) => updateNote(activeNote.id, { title: e.target.value })}
                  placeholder="Note Title..."
                  className="text-2xl font-bold bg-transparent text-white focus:outline-none placeholder-gray-600 w-full"
                />
                <button
                  onClick={() => deleteNote(activeNote.id)}
                  className="p-1.5 rounded text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors ml-4"
                  title="Delete Note"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs text-gray-400 flex-wrap">
                <div className="flex items-center gap-1.5 text-gray-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{activeNote.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Tag className="w-3.5 h-3.5 text-amber-500" />
                  <div className="flex items-center gap-1">
                    {activeNote.tags.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-medium border border-amber-500/20">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Editor Toolbar */}
            {editor && (
              <div className="flex items-center gap-1 p-1 rounded-lg bg-[#14171F] border border-white/5 shrink-0 overflow-x-auto">
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={`p-1.5 rounded hover:bg-white/10 text-gray-300 transition-colors ${editor.isActive('bold') ? 'bg-amber-500/20 text-amber-400' : ''}`}
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={`p-1.5 rounded hover:bg-white/10 text-gray-300 transition-colors ${editor.isActive('italic') ? 'bg-amber-500/20 text-amber-400' : ''}`}
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className={`p-1.5 rounded hover:bg-white/10 text-gray-300 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-amber-500/20 text-amber-400' : ''}`}
                >
                  <Heading1 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className={`p-1.5 rounded hover:bg-white/10 text-gray-300 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-amber-500/20 text-amber-400' : ''}`}
                >
                  <Heading2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className={`p-1.5 rounded hover:bg-white/10 text-gray-300 transition-colors ${editor.isActive('bulletList') ? 'bg-amber-500/20 text-amber-400' : ''}`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleTaskList().run()}
                  className={`p-1.5 rounded hover:bg-white/10 text-gray-300 transition-colors ${editor.isActive('taskList') ? 'bg-amber-500/20 text-amber-400' : ''}`}
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHighlight().run()}
                  className={`p-1.5 rounded hover:bg-white/10 text-gray-300 transition-colors ${editor.isActive('highlight') ? 'bg-amber-500/20 text-amber-400' : ''}`}
                >
                  <Highlighter className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Rich Text Editor */}
            <div className="flex-1 text-gray-200 text-sm leading-relaxed prose prose-invert max-w-none">
              <EditorContent editor={editor} />
            </div>

            {/* Linked Chips Section */}
            {activeNote.linkedItems.length > 0 && (
              <div className="pt-4 border-t border-white/5 space-y-2">
                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">Connected Story Assets</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {activeNote.linkedItems.map((item) => (
                    <div
                      key={item.id}
                      className="px-2.5 py-1 rounded-lg bg-[#181C26] border border-white/10 text-xs text-gray-300 flex items-center gap-1.5 hover:border-amber-500/40 transition-colors cursor-pointer"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span className="capitalize text-gray-400">{item.type}:</span>
                      <span className="font-medium text-amber-300">{item.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 stroke-1 text-gray-600 mb-3" />
            <h3 className="text-base font-semibold text-gray-300">Every great story starts as a small idea</h3>
            <p className="text-xs text-gray-500 mt-1">Create or select a note to start writing linear beats.</p>
            <button
              onClick={() => addNote({ title: 'New Story Idea', content: '' })}
              className="mt-4 px-4 py-2 rounded-lg bg-amber-500 text-black text-xs font-semibold hover:bg-amber-400 transition-colors"
            >
              Write your first note
            </button>
          </div>
        )}

        {/* Floating Contextual Button for Text Selection */}
        {popoverPos && selectedText && (
          <div
            style={{
              position: 'fixed',
              top: `${popoverPos.top}px`,
              left: `${popoverPos.left}px`,
              zIndex: 50
            }}
            className="animate-in fade-in zoom-in-95 duration-150"
          >
            <button
              onClick={handleSendSelectedToStoryboard}
              className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold text-xs shadow-xl flex items-center gap-1.5 hover:from-amber-400 hover:to-orange-400 transition-all border border-amber-300/30 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send to Storyboard</span>
            </button>
          </div>
        )}
      </div>

      {/* Right Context Panel (Collapsible) */}
      <div className={`${showRightPanel ? 'w-64' : 'w-10'} bg-[#12151D] border-l border-white/5 flex flex-col transition-all duration-200 shrink-0`}>
        <div className="p-3 border-b border-white/5 flex items-center justify-between">
          {showRightPanel && (
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Context & Links</span>
            </span>
          )}
          <button
            onClick={() => setShowRightPanel(!showRightPanel)}
            className="p-1 rounded text-gray-400 hover:text-white hover:bg-white/10 transition-colors ml-auto"
          >
            {showRightPanel ? <SidebarClose className="w-4 h-4" /> : <SidebarOpen className="w-4 h-4" />}
          </button>
        </div>

        {showRightPanel && activeNote && (
          <div className="p-3 space-y-4 text-xs overflow-y-auto">
            {/* Storyboard Linked Cards */}
            <div className="space-y-2">
              <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Linked Storyboard Cards</p>
              <div
                onClick={() => openLinkedCardInStoryboard('node-story-1')}
                className="p-2.5 rounded-lg bg-[#181C26] border border-white/5 hover:border-amber-500/40 cursor-pointer transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-amber-400 group-hover:underline">Maya misses the last bus</span>
                  <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-amber-400" />
                </div>
                <p className="text-[11px] text-gray-400 line-clamp-2">Card created from opening note beat.</p>
              </div>
            </div>

            {/* Linked Script Scene */}
            <div className="space-y-2">
              <p className="font-semibold text-gray-400 uppercase tracking-wider text-[10px]">Linked Screenplay Scenes</p>
              <div
                onClick={() => openScriptScene('scene-1')}
                className="p-2.5 rounded-lg bg-[#181C26] border border-white/5 hover:border-orange-500/40 cursor-pointer transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-orange-400 group-hover:underline">Scene 1: EXT. BUS STOP</span>
                  <ChevronRight className="w-3 h-3 text-gray-500 group-hover:text-orange-400" />
                </div>
                <p className="text-[11px] text-gray-400">1 Page • Estimated 1:30</p>
              </div>
            </div>

            {/* Quick Action */}
            <div className="pt-2 border-t border-white/5">
              <button
                onClick={() => sendNoteToStoryboard(activeNote.content, activeNote.title)}
                className="w-full py-2 px-3 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-semibold border border-amber-500/30 flex items-center justify-center gap-1.5 transition-all text-xs"
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
