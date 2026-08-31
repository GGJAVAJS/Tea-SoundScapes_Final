import React from 'react';
import { Activity, Baby, Moon, Bus, BookOpen, Shield, Brain, Grid3x3, Wind, Droplets, Trees, Heart } from 'lucide-react';
import * as Icons from 'lucide-react';

export interface MixRecipe {
  id: string;
  title: string;
  creator: string;
  category: string;
  likes: number;
  color: string;
  icon: any;
  config: {
    volumes: Record<string, number>;
    eq: Record<string, { bass: number, mid: number, treble: number }>;
  };
  tags: Array<{
    icon: string;
    name: string;
    pct: number;
  }>;
}

export const MOCK_RECIPES: MixRecipe[] = [
  {
    id: 'mix1',
    title: 'Calma no Recreio',
    creator: 'Marina S.',
    category: 'infantil',
    likes: 124,
    color: '#ec4899', // pink
    icon: Baby,
    config: {
      volumes: { rosa: 0.7, agua: 0.3 },
      eq: { rosa: { bass: 0.5, mid: 0.5, treble: 0.4 }, agua: { bass: 0.5, mid: 0.5, treble: 0.5 } }
    },
    tags: [
      { icon: '🌸', name: 'Ruído Rosa', pct: 70 },
      { icon: '💧', name: 'Água', pct: 30 }
    ]
  },
  {
    id: 'mix2',
    title: 'Dormir sem Medo',
    creator: 'João M.',
    category: 'sono',
    likes: 342,
    color: '#6366f1', // indigo
    icon: Moon,
    config: {
      volumes: { marrom: 0.8, chuva: 0.2 },
      eq: { marrom: { bass: 0.6, mid: 0.4, treble: 0.3 }, chuva: { bass: 0.5, mid: 0.5, treble: 0.4 } }
    },
    tags: [
      { icon: '🤎', name: 'Ruído Marrom', pct: 80 },
      { icon: '🌧', name: 'Chuva', pct: 20 }
    ]
  },
  {
    id: 'mix3',
    title: 'Foco no Ônibus',
    creator: 'Alex T.',
    category: 'transporte',
    likes: 89,
    color: '#14b8a6', // teal
    icon: Bus,
    config: {
      volumes: { branco: 0.6, vento: 0.4 },
      eq: { branco: { bass: 0.5, mid: 0.5, treble: 0.5 }, vento: { bass: 0.5, mid: 0.5, treble: 0.5 } }
    },
    tags: [
      { icon: '🤍', name: 'Ruído Branco', pct: 60 },
      { icon: '💨', name: 'Vento', pct: 40 }
    ]
  },
  {
    id: 'mix4',
    title: 'Leitura Silenciosa',
    creator: 'Bia K.',
    category: 'foco',
    likes: 210,
    color: '#f59e0b', // amber
    icon: BookOpen,
    config: {
      volumes: { lareira: 0.7, passaros: 0.1, marrom: 0.2 },
      eq: { lareira: { bass: 0.5, mid: 0.5, treble: 0.5 }, passaros: { bass: 0.5, mid: 0.5, treble: 0.5 }, marrom: { bass: 0.5, mid: 0.5, treble: 0.5 } }
    },
    tags: [
      { icon: '🔥', name: 'Lareira', pct: 70 },
      { icon: '🤎', name: 'Ruído Marrom', pct: 20 },
      { icon: '🐦', name: 'Pássaros', pct: 10 }
    ]
  },
  {
    id: 'mix5',
    title: 'Refúgio Profundo',
    creator: 'Equipe TEA',
    category: 'destaques',
    likes: 950,
    color: '#38bdf8', // sky
    icon: Shield,
    config: {
      volumes: { marrom: 0.5, rosa: 0.5 },
      eq: { marrom: { bass: 0.8, mid: 0.5, treble: 0.2 }, rosa: { bass: 0.4, mid: 0.4, treble: 0.2 } }
    },
    tags: [
      { icon: '🤎', name: 'Ruído Marrom', pct: 50 },
      { icon: '🌸', name: 'Ruído Rosa', pct: 50 }
    ]
  }
];

export function getAllRecipes(): MixRecipe[] {
  let userMixes: MixRecipe[] = [];
  if (typeof localStorage !== 'undefined') {
    try {
      const existing = localStorage.getItem('user_published_mixes');
      if (existing) {
        userMixes = JSON.parse(existing).map((p: any) => ({ ...p, icon: (Icons as any)[p.iconName || 'Activity'] || Activity }));
      }
    } catch (e) {}
  }
  return [...userMixes, ...MOCK_RECIPES];
}
