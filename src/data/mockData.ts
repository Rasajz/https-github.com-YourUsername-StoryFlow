import { NoteItem, ScriptScene, MediaItem, StoryTimeline } from '../types';
import { Node, Edge } from '@xyflow/react';

export interface ProjectWorkspaceData {
  projectName: string;
  notes: NoteItem[];
  nodes: Node[];
  edges: Edge[];
  scriptScenes: ScriptScene[];
  mediaItems: MediaItem[];
  timelines: StoryTimeline[];
}

// ----------------------------------------------------
// PROJECT 1: LAST BUS (Noir / Mystery Short Film)
// ----------------------------------------------------
export const LAST_BUS_DATA: ProjectWorkspaceData = {
  projectName: 'Last Bus',
  timelines: [
    { id: 'time-main', name: 'Main Storyline (A-Plot)', color: '#F59E0B', description: 'Maya at the midnight bus stop' },
    { id: 'time-subplot', name: 'The Woman Mystery (B-Plot)', color: '#8B5CF6', description: 'Backstory of the stranger' },
    { id: 'time-flashback', name: 'Flashbacks to Yesterday', color: '#06B6D4', description: 'Why Maya missed her first bus' }
  ],
  notes: [
    {
      id: 'note-1',
      title: 'Opening idea',
      content: `A lonely college student misses the last bus in the rain.\n\nHe sees a woman sitting alone beneath a broken neon sign.\n\nMaybe she has been waiting for a bus that has not existed for years.`,
      date: 'Aug 25, 2026',
      tags: ['Ideas', 'Locations'],
      linkedItems: [
        { id: 'maya-char', type: 'character', name: 'Maya' },
        { id: 'bus-stop-loc', type: 'location', name: 'Bus Stop' },
        { id: 'rain-ref', type: 'reference', name: 'Rainy neon lighting' }
      ]
    },
    {
      id: 'note-2',
      title: 'Maya character notes',
      content: `Maya (20) is quiet, observant, and carries a worn sketchbook everywhere.\n\nShe is terrified of stepping beyond her comfort zone, but her relentless curiosity often forces her forward into unpredictable situations.`,
      date: 'Aug 24, 2026',
      tags: ['Characters'],
      linkedItems: [
        { id: 'maya-char', type: 'character', name: 'Maya' }
      ]
    },
    {
      id: 'note-3',
      title: 'Rainy bus stop references',
      content: `High contrast neon blues and deep ambers reflecting off wet asphalt.\n\nPuddles reflecting flickering neon letters. Atmospheric mist creeping down deserted city streets at 2 AM.`,
      date: 'Aug 23, 2026',
      tags: ['References', 'Locations'],
      linkedItems: [
        { id: 'rain-ref', type: 'reference', name: 'Neon Lighting' }
      ]
    },
    {
      id: 'note-4',
      title: 'Dialogue fragments',
      content: `MAYA: "I thought you said the last bus was at midnight."\n\nTHE WOMAN: "It was. Yesterday."\n\nMAYA: "Are you waiting for someone?"\n\nTHE WOMAN: "Only for someone who knows how to listen."`,
      date: 'Aug 22, 2026',
      tags: ['Dialogue'],
      linkedItems: [
        { id: 'woman-char', type: 'character', name: 'The Woman' }
      ]
    }
  ],
  nodes: [
    {
      id: 'node-maya',
      type: 'characterCard',
      position: { x: 120, y: 140 },
      data: {
        nodeType: 'character',
        title: 'Maya',
        description: '20, observant, carries a sketchbook. Hesitant but curious.',
        tags: ['Protagonist', 'Lead'],
        accentColor: '#8B5CF6',
        timelineId: 'time-main'
      }
    },
    {
      id: 'node-scene-1',
      type: 'sceneCard',
      position: { x: 460, y: 110 },
      data: {
        nodeType: 'scene',
        title: 'Scene 1: EXT. BUS STOP - NIGHT',
        description: 'Maya misses the last bus in pouring rain and meets the mysterious stranger.',
        statusBadge: 'Draft',
        accentColor: '#F97316',
        linkedScriptSceneId: 'scene-1',
        timelineId: 'time-main'
      }
    },
    {
      id: 'node-image-bus',
      type: 'imageCard',
      position: { x: 460, y: 380 },
      data: {
        nodeType: 'image',
        title: 'Rainy Neon Bus Stop Lighting',
        imageUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
        description: 'Color palette: deep amber and neon blue reflections in wet pavement.',
        accentColor: '#EC4899',
        timelineId: 'time-main'
      }
    },
    {
      id: 'node-video-ref',
      type: 'videoCard',
      position: { x: 800, y: 110 },
      data: {
        nodeType: 'video',
        title: 'Cinematic Push-in Reference',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        creatorNotes: 'Slow 50mm push-in shot matching the mysterious atmosphere at 2 AM.',
        accentColor: '#06B6D4',
        timelineId: 'time-main'
      }
    }
  ],
  edges: [
    {
      id: 'e-1',
      source: 'node-maya',
      target: 'node-scene-1',
      label: 'appears in',
      type: 'customLabeled'
    },
    {
      id: 'e-2',
      source: 'node-scene-1',
      target: 'node-image-bus',
      label: 'visual style',
      type: 'customLabeled'
    },
    {
      id: 'e-3',
      source: 'node-scene-1',
      target: 'node-video-ref',
      label: 'camera angle',
      type: 'customLabeled'
    }
  ],
  scriptScenes: [
    {
      id: 'scene-1',
      number: 1,
      title: 'EXT. BUS STOP – NIGHT',
      pageEstimate: '1 Page',
      durationEstimate: '1:30',
      linkedCardId: 'node-scene-1',
      timelineId: 'time-main',
      blocks: [
        { id: 'b1', type: 'heading', text: 'EXT. BUS STOP – NIGHT' },
        { id: 'b2', type: 'action', text: 'Rain pounds the empty asphalt. MAYA, 20, grips a torn bus ticket beneath a flickering neon sign.' },
        { id: 'b3', type: 'character', text: 'MAYA' },
        { id: 'b4', type: 'dialogue', text: 'I thought you said the last bus was at midnight.' },
        { id: 'b5', type: 'action', text: 'A WOMAN steps out from the darkness.' },
        { id: 'b6', type: 'character', text: 'THE WOMAN' },
        { id: 'b7', type: 'dialogue', text: 'It was. Yesterday.' }
      ],
      characterChips: ['Maya', 'The Woman'],
      moodImage: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
      storyPurpose: 'Maya is forced to face the fear of leaving.',
      shotIdeas: [
        'Wide establishing shot of empty street',
        'Close-up of torn bus ticket in rain',
        'Slow push-in on Maya as neon flickers'
      ]
    },
    {
      id: 'scene-2',
      number: 2,
      title: 'EXT. ABANDONED DINER – CONTINUOUS',
      pageEstimate: '1 Page',
      durationEstimate: '1:10',
      timelineId: 'time-main',
      blocks: [
        { id: 'b8', type: 'heading', text: 'EXT. ABANDONED DINER – CONTINUOUS' },
        { id: 'b9', type: 'action', text: 'A glow from across the street catches Maya’s eye.' }
      ],
      characterChips: ['Maya'],
      storyPurpose: 'Discovery of the hidden refuge.',
      shotIdeas: ['Over-the-shoulder tracking shot', 'Low angle neon glow']
    }
  ],
  mediaItems: [
    {
      id: 'med-1',
      title: 'Blue Neon Rain Reflection',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=800&auto=format&fit=crop',
      tags: ['Mood', 'Lighting', 'Atmosphere'],
      connectedSceneOrBoard: 'Scene 1: Bus Stop',
      createdAt: 'Aug 25, 2026'
    },
    {
      id: 'med-2',
      title: 'Maya Character Concept Sketch',
      type: 'sketch',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800&auto=format&fit=crop',
      tags: ['Character', 'Costume'],
      connectedSceneOrBoard: 'Maya Node',
      createdAt: 'Aug 24, 2026'
    },
    {
      id: 'med-3',
      title: 'Cinematic Push-in Motion Reference',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      tags: ['Cinematography', 'Camera Work'],
      connectedSceneOrBoard: 'Scene 1: Bus Stop',
      createdAt: 'Aug 23, 2026'
    }
  ]
};

// ----------------------------------------------------
// PROJECT 2: NEON HORIZON 2099 (Cyberpunk Sci-Fi Pilot)
// ----------------------------------------------------
export const NEON_HORIZON_DATA: ProjectWorkspaceData = {
  projectName: 'Neon Horizon 2099',
  timelines: [
    { id: 'time-cyber-main', name: 'Main Corporate Heist (A-Plot)', color: '#06B6D4', description: 'Kaelen hacks into Sector 4 mainframe' },
    { id: 'time-cyber-lore', name: 'Sister Memory Fragment Lore', color: '#EC4899', description: 'Recovered neural memories' },
    { id: 'time-cyber-drones', name: 'Syndicate Hunt Track', color: '#EF4444', description: 'Corporate enforcers closing in' }
  ],
  notes: [
    {
      id: 'note-neon-1',
      title: 'Sector 4 Highline Lore',
      content: `Acid rain pours over holographic advertisements. Corporate drones patrol above the smog layer. The lower street levels are controlled by freelance data brokers.\n\nEnergy blackouts occur every midnight as power is redirected to the Upper Orbital Spire.`,
      date: 'Aug 26, 2026',
      tags: ['Locations', 'Ideas'],
      linkedItems: [
        { id: 'kaelen-char', type: 'character', name: 'Kaelen' }
      ]
    },
    {
      id: 'note-neon-2',
      title: 'Kaelen Protagonist Profile',
      content: `Kaelen (28) is a freelance memory code extractor. He wears an augmented optical visor with cracked lenses and is searching for an encrypted memory chip left behind by his sister.`,
      date: 'Aug 25, 2026',
      tags: ['Characters'],
      linkedItems: [
        { id: 'kaelen-char', type: 'character', name: 'Kaelen' }
      ]
    },
    {
      id: 'note-neon-3',
      title: 'The Blackout Virus Code',
      content: `A ghost algorithm that only activates during sector power outages, bypassing biometric scanners.`,
      date: 'Aug 24, 2026',
      tags: ['Ideas'],
      linkedItems: []
    }
  ],
  nodes: [
    {
      id: 'node-kaelen',
      type: 'characterCard',
      position: { x: 100, y: 120 },
      data: {
        nodeType: 'character',
        title: 'Kaelen (Memory Hacker)',
        description: 'Augmented optical visor, quiet, relentless memory code extractor.',
        tags: ['Lead', 'Cyberpunk'],
        accentColor: '#06B6D4',
        timelineId: 'time-cyber-main'
      }
    },
    {
      id: 'node-cyber-alley',
      type: 'imageCard',
      position: { x: 450, y: 100 },
      data: {
        nodeType: 'image',
        title: 'Sector 4 Cyber Alley',
        imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
        description: 'Magenta holographic signage and steam rising from subway grates.',
        accentColor: '#EC4899',
        timelineId: 'time-cyber-main'
      }
    },
    {
      id: 'node-cyber-drone',
      type: 'videoCard',
      position: { x: 450, y: 360 },
      data: {
        nodeType: 'video',
        title: 'Drone Pursuit Reference',
        videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        creatorNotes: 'High-speed camera tracking down cramped neon corridors.',
        accentColor: '#F59E0B',
        timelineId: 'time-cyber-drones'
      }
    },
    {
      id: 'node-cyber-scene',
      type: 'sceneCard',
      position: { x: 800, y: 120 },
      data: {
        nodeType: 'scene',
        title: 'Scene: EXT. SECTOR 4 ALLEYWAY - NIGHT',
        description: 'Kaelen bypasses a security checkpoint as corporate drone sweep passes overhead.',
        statusBadge: 'In Progress',
        accentColor: '#F97316',
        linkedScriptSceneId: 'sc-neon-1',
        timelineId: 'time-cyber-main'
      }
    }
  ],
  edges: [
    {
      id: 'e-neon-1',
      source: 'node-kaelen',
      target: 'node-cyber-alley',
      label: 'infiltrates',
      type: 'customLabeled'
    },
    {
      id: 'e-neon-2',
      source: 'node-cyber-alley',
      target: 'node-cyber-scene',
      label: 'leads to',
      type: 'customLabeled'
    },
    {
      id: 'e-neon-3',
      source: 'node-cyber-drone',
      target: 'node-cyber-scene',
      label: 'threat in',
      type: 'customLabeled'
    }
  ],
  scriptScenes: [
    {
      id: 'sc-neon-1',
      number: 1,
      title: 'EXT. SECTOR 4 ALLEYWAY - NIGHT',
      pageEstimate: '1 Page',
      durationEstimate: '1:20',
      linkedCardId: 'node-cyber-scene',
      timelineId: 'time-cyber-main',
      blocks: [
        { id: 'b-n1', type: 'heading', text: 'EXT. SECTOR 4 ALLEYWAY - NIGHT' },
        { id: 'b-n2', type: 'action', text: 'Acid rain hisses against steaming grates. KAELEN (28) pulls up his collar, optical visor blinking cyan.' },
        { id: 'b-n3', type: 'character', text: 'KAELEN' },
        { id: 'b-n4', type: 'dialogue', text: 'The memory frequency is jumping between nodes.' },
        { id: 'b-n5', type: 'action', text: 'A corporate drone searchlight sweeps across the wet brick wall.' }
      ],
      characterChips: ['Kaelen', 'Data Broker'],
      moodImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
      storyPurpose: 'Establish dystopian stakes and Kaelen hacking ability.',
      shotIdeas: [
        'Overhead drone POV with cyber HUD overlay',
        'Macro lens on visor reflection',
        'Low angle Dutch tilt in rain alley'
      ]
    },
    {
      id: 'sc-neon-2',
      number: 2,
      title: 'INT. MEMORY BROKER DEN - DAWN',
      pageEstimate: '1 Page',
      durationEstimate: '1:45',
      timelineId: 'time-cyber-lore',
      blocks: [
        { id: 'b-n6', type: 'heading', text: 'INT. MEMORY BROKER DEN - DAWN' },
        { id: 'b-n7', type: 'action', text: 'Cables hang like weeping willows from the concrete ceiling. Encrypted data drives hum on iron tables.' }
      ],
      characterChips: ['Kaelen', 'Vesper'],
      storyPurpose: 'Revealing the sister memory chip encryption key.',
      shotIdeas: ['Slow tracking shot through hanging cables', 'Close-up of glowing neural connector']
    }
  ],
  mediaItems: [
    {
      id: 'med-neon-1',
      title: 'Sector 4 Hologram & Neon Concept',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop',
      tags: ['Cyberpunk', 'Concept Art', 'Lighting'],
      connectedSceneOrBoard: 'Scene 1: Sector 4 Alleyway',
      createdAt: 'Aug 26, 2026'
    },
    {
      id: 'med-neon-2',
      title: 'High-Speed Drone Street Chase Camera',
      type: 'video',
      url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      tags: ['Camera Reference', 'Action'],
      connectedSceneOrBoard: 'Scene 1: Sector 4 Alleyway',
      createdAt: 'Aug 25, 2026'
    }
  ]
};

// ----------------------------------------------------
// PROJECT 3: ECHOES OF SILENCE (Psychological Thriller)
// ----------------------------------------------------
export const ECHOES_OF_SILENCE_DATA: ProjectWorkspaceData = {
  projectName: 'Echoes of Silence',
  timelines: [
    { id: 'time-echo-main', name: 'Investigation Timeline (A-Plot)', color: '#F59E0B', description: 'Dr. Arthur analyzes the 1984 tape' },
    { id: 'time-echo-hallucination', name: 'Psychological Descent (B-Plot)', color: '#8B5CF6', description: 'Acoustic hallucinations and paranoia' }
  ],
  notes: [
    {
      id: 'note-echo-1',
      title: 'The 1984 Magnetic Tape',
      content: `A forgotten quarter-inch magnetic reel recovered from the basement archive of the St. Jude Audio Institute.\n\nBeneath the white noise is an anomaly: a human whisper that only repeats at 432 Hz frequency.`,
      date: 'Aug 24, 2026',
      tags: ['Ideas', 'Dialogue'],
      linkedItems: []
    },
    {
      id: 'note-echo-2',
      title: 'Dr. Arthur Bell Profile',
      content: `Dr. Arthur (54) is an eccentric audio restoration specialist with tinnitus. He works solely in darkness to enhance his auditory sensitivity.`,
      date: 'Aug 23, 2026',
      tags: ['Characters'],
      linkedItems: []
    }
  ],
  nodes: [
    {
      id: 'node-arthur',
      type: 'characterCard',
      position: { x: 120, y: 140 },
      data: {
        nodeType: 'character',
        title: 'Dr. Arthur Bell',
        description: '54, audio restoration specialist. Obsessive, isolated.',
        tags: ['Protagonist'],
        accentColor: '#8B5CF6',
        timelineId: 'time-echo-main'
      }
    },
    {
      id: 'node-tape-reel',
      type: 'noteCard',
      position: { x: 450, y: 120 },
      data: {
        nodeType: 'note',
        title: 'The 1984 Tape Reel',
        description: 'Contains hidden voice pattern repeating precisely every 7 minutes.',
        tags: ['Key Object'],
        accentColor: '#F59E0B',
        timelineId: 'time-echo-main'
      }
    },
    {
      id: 'node-sound-scene',
      type: 'sceneCard',
      position: { x: 780, y: 120 },
      data: {
        nodeType: 'scene',
        title: 'Scene: INT. SOUND ARCHIVE - MIDNIGHT',
        description: 'Arthur isolates the anomalous frequency on the analog oscilloscope.',
        statusBadge: 'Draft',
        accentColor: '#F97316',
        linkedScriptSceneId: 'sc-echo-1',
        timelineId: 'time-echo-main'
      }
    }
  ],
  edges: [
    {
      id: 'e-echo-1',
      source: 'node-arthur',
      target: 'node-tape-reel',
      label: 'discovers',
      type: 'customLabeled'
    },
    {
      id: 'e-echo-2',
      source: 'node-tape-reel',
      target: 'node-sound-scene',
      label: 'analyzed in',
      type: 'customLabeled'
    }
  ],
  scriptScenes: [
    {
      id: 'sc-echo-1',
      number: 1,
      title: 'INT. SOUND ARCHIVE - MIDNIGHT',
      pageEstimate: '1 Page',
      durationEstimate: '1:15',
      linkedCardId: 'node-sound-scene',
      timelineId: 'time-echo-main',
      blocks: [
        { id: 'b-e1', type: 'heading', text: 'INT. SOUND ARCHIVE - MIDNIGHT' },
        { id: 'b-e2', type: 'action', text: 'The analog reel spins slowly. Amber VU meters twitch violently into the red zone.' },
        { id: 'b-e3', type: 'character', text: 'ARTHUR' },
        { id: 'b-e4', type: 'dialogue', text: 'It is not background hiss. It is breathing.' }
      ],
      characterChips: ['Arthur'],
      storyPurpose: 'Inciting incident: The anomalous audio voice is heard.',
      shotIdeas: [
        'Extreme macro of spinning magnetic tape head',
        'Close-up of twitching needle in red zone',
        'Slow zoom on Arthur face in amber backlight'
      ]
    }
  ],
  mediaItems: [
    {
      id: 'med-echo-1',
      title: 'Vintage Analog Audio Console & Reel',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=800&auto=format&fit=crop',
      tags: ['Vintage', 'Sound Design', 'Mood'],
      connectedSceneOrBoard: 'Scene 1: Sound Archive',
      createdAt: 'Aug 24, 2026'
    }
  ]
};

// Initial Project Registry Map
export const INITIAL_PROJECT_WORKSPACES: Record<string, ProjectWorkspaceData> = {
  'proj-1': LAST_BUS_DATA,
  'proj-2': NEON_HORIZON_DATA,
  'proj-3': ECHOES_OF_SILENCE_DATA
};

export const INITIAL_NOTES = LAST_BUS_DATA.notes;
export const INITIAL_SCRIPT_SCENES = LAST_BUS_DATA.scriptScenes;
export const INITIAL_STORYBOARD_NODES = LAST_BUS_DATA.nodes;
export const INITIAL_STORYBOARD_EDGES = LAST_BUS_DATA.edges;
export const INITIAL_MEDIA_ITEMS = LAST_BUS_DATA.mediaItems;

export const SUBBOARD_MAP: Record<string, { nodes: Node[]; edges: Edge[] }> = {
  'subboard-bus-stop': {
    nodes: [
      {
        id: 'sub-1',
        type: 'timelineCard',
        position: { x: 100, y: 100 },
        data: {
          nodeType: 'timeline',
          sequenceNumber: 1,
          title: 'Shot 1: Wide establishing shot',
          description: 'Rainy street, flickering sign',
          accentColor: '#3B82F6'
        }
      },
      {
        id: 'sub-2',
        type: 'noteCard',
        position: { x: 450, y: 100 },
        data: {
          nodeType: 'note',
          title: 'Sound Design Beat',
          description: 'Heavy rainfall, low bass rumble, distant train horn echo',
          tags: ['Audio'],
          accentColor: '#F59E0B'
        }
      }
    ],
    edges: [
      {
        id: 'sub-edge-1',
        source: 'sub-1',
        target: 'sub-2',
        label: 'leads to',
        type: 'customLabeled'
      }
    ]
  }
};
