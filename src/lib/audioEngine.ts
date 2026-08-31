let audioCtx: AudioContext | null = null;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export type SoundType = 'chuva' | 'branco' | 'vento' | 'rosa' | 'marrom' | 'agua' | 'passaros' | 'natureza' | 'lareira' | string;

export const customUrls: Record<string, string> = {
  'chuva': '/Chuva.mp3',
  'branco': '/Ruído Branco.mp3',
  'vento': '/Vento.mp3',
  'rosa': '/Ruído Rosa.mp3',
  'marrom': '/Ruído Marrom.mp3',
  'agua': '/Agua.mp3',
  'passaros': '/Passaros.mp3',
  'natureza': '/Natureza.mp3',
  'lareira': '/Lareira.mp3'
};

const audioElements: Record<string, { audio: HTMLAudioElement, source?: MediaElementAudioSourceNode }> = {};

const activeNodes: Record<string, { 
  audioElement?: HTMLAudioElement,
  source?: AudioBufferSourceNode,
  gain: GainNode, 
  bassFilter?: BiquadFilterNode, 
  midFilter?: BiquadFilterNode, 
  trebleFilter?: BiquadFilterNode, 
  extraSources?: any[], 
  baseVolume: number 
}> = {};

export async function preloadSounds() {
  // Preload audio files natively via HTML5 Audio to prevent massive memory decoding
  Object.entries(customUrls).forEach(([type, url]) => {
    if (!audioElements[type]) {
      const audio = new Audio(url);
      audio.crossOrigin = "anonymous";
      audio.loop = true;
      audio.preload = "none"; // Load efficiently to not block main thread
      audioElements[type] = { audio };
    }
  });
}

const buffers: Record<string, AudioBuffer> = {};

function generateNoiseBuffer(type: 'white' | 'pink' | 'brown', duration: number = 1) {
  const ctx = getAudioContext();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let lastOut = 0;
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;

    if (type === 'white') {
      data[i] = white;
    } else if (type === 'pink') {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    } else if (type === 'brown') {
      const brown = (lastOut + (0.02 * white)) / 1.02;
      lastOut = brown;
      data[i] = brown * 3.5;
    }
  }
  return buffer;
}

function generateBirdsBuffer(duration: number = 10) {
  const ctx = getAudioContext();
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  
  for (let i = 0; i < bufferSize; i++) {
    data[i] = 0;
  }
  
  const numChirps = duration * 2;
  for (let c = 0; c < numChirps; c++) {
    const startSample = Math.floor(Math.random() * (bufferSize - ctx.sampleRate));
    const chirpDuration = Math.random() * 0.2 + 0.1;
    const freqStart = 3000 + Math.random() * 2000;
    const freqEnd = freqStart + (Math.random() * 1000 - 500);
    
    for (let i = 0; i < chirpDuration * ctx.sampleRate; i++) {
      const t = i / ctx.sampleRate;
      const freq = freqStart + (freqEnd - freqStart) * (t / chirpDuration);
      const envelope = Math.sin(Math.PI * (t / chirpDuration));
      data[startSample + i] += Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
    }
  }
  return buffer;
}

export async function playSound(type: SoundType) {
  try {
    const ctx = getAudioContext();
    if (activeNodes[type]) return;

    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.001; 
    
    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.value = 250;
    bassFilter.gain.value = 0; 

    const midFilter = ctx.createBiquadFilter();
    midFilter.type = 'peaking';
    midFilter.frequency.value = 1000;
    midFilter.Q.value = 0.5;
    midFilter.gain.value = 0;
    
    const trebleFilter = ctx.createBiquadFilter();
    trebleFilter.type = 'highshelf';
    trebleFilter.frequency.value = 4000;
    trebleFilter.gain.value = 0;
    
    gainNode.connect(bassFilter);
    bassFilter.connect(midFilter);
    midFilter.connect(trebleFilter);
    trebleFilter.connect(ctx.destination);

    let targetVolume = 0.5;
    let fallbackToSynthetic = true;
    let audioElementToPlay: HTMLAudioElement | undefined = undefined;
    let syntheticSourceNode: AudioBufferSourceNode | undefined = undefined;
    const extraSources: AudioNode[] = [];

    if (customUrls[type]) {
      if (!audioElements[type]) {
        const audio = new Audio(customUrls[type]);
        audio.crossOrigin = "anonymous";
        audio.loop = true;
        audioElements[type] = { audio };
      }
      
      const entry = audioElements[type];
      
      try {
        if (!entry.source) {
          entry.source = ctx.createMediaElementSource(entry.audio);
        }
        entry.source.disconnect();
        entry.source.connect(gainNode);
        
        audioElementToPlay = entry.audio;
        targetVolume = 0.8;
        fallbackToSynthetic = false;
      } catch (e) {
        console.warn("Failed to initialize MediaElementSource", e);
        fallbackToSynthetic = true;
      }
    }

    if (fallbackToSynthetic) {
      if (type === 'branco') {
        if (!buffers.white) buffers.white = generateNoiseBuffer('white');
        syntheticSourceNode = ctx.createBufferSource();
        syntheticSourceNode.buffer = buffers.white;
        syntheticSourceNode.loop = true;
        syntheticSourceNode.connect(gainNode);
        targetVolume = 0.05;
      } else if (type === 'rosa' || type === 'chuva' || type === 'som-b' || type === 'refuge') {
        if (!buffers.pink) buffers.pink = generateNoiseBuffer('pink');
        syntheticSourceNode = ctx.createBufferSource();
        syntheticSourceNode.buffer = buffers.pink;
        syntheticSourceNode.loop = true;
        
        if (type === 'chuva') {
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 1200;
          filter.Q.value = 0.5;
          syntheticSourceNode.connect(filter);
          filter.connect(gainNode);
          targetVolume = 0.8;
          extraSources.push(filter);
        } else if (type === 'som-b' || type === 'refuge') {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const osc3 = ctx.createOscillator();
          osc1.type = 'sine'; osc2.type = 'sine'; osc3.type = 'sine';
          osc1.frequency.value = 285; osc2.frequency.value = 339; osc3.frequency.value = 427;
          const mixGain = ctx.createGain();
          mixGain.gain.value = 0.2;
          osc1.connect(mixGain); osc2.connect(mixGain); osc3.connect(mixGain);
          mixGain.connect(gainNode);
          osc1.start(); osc2.start(); osc3.start();
          const noiseFilter = ctx.createBiquadFilter();
          noiseFilter.type = 'lowpass';
          noiseFilter.frequency.value = 300;
          const noiseGain = ctx.createGain();
          noiseGain.gain.value = 0.15;
          syntheticSourceNode.connect(noiseFilter);
          noiseFilter.connect(noiseGain);
          noiseGain.connect(gainNode);
          targetVolume = 0.5;
          extraSources.push(osc1, osc2, osc3, mixGain, noiseFilter, noiseGain);
        } else {
          syntheticSourceNode.connect(gainNode);
          targetVolume = 0.3;
        }
      } else if (type === 'marrom' || type === 'vento' || type === 'som-a' || type === 'som-c') {
        if (!buffers.brown) buffers.brown = generateNoiseBuffer('brown');
        syntheticSourceNode = ctx.createBufferSource();
        syntheticSourceNode.buffer = buffers.brown;
        syntheticSourceNode.loop = true;
        
        if (type === 'vento') {
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 400;
          const lfo = ctx.createOscillator();
          lfo.type = 'sine';
          lfo.frequency.value = 0.15;
          const lfoGain = ctx.createGain();
          lfoGain.gain.value = 600;
          lfo.connect(lfoGain);
          lfoGain.connect(filter.frequency);
          lfo.start();
          syntheticSourceNode.connect(filter);
          filter.connect(gainNode);
          targetVolume = 0.8;
          extraSources.push(filter, lfo, lfoGain);
        } else if (type === 'som-a') {
          const osc1 = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          osc1.type = 'sine'; osc2.type = 'sine';
          osc1.frequency.value = 174;
          osc2.frequency.value = 177; 
          const lfo = ctx.createOscillator();
          lfo.type = 'sine';
          lfo.frequency.value = 0.05; 
          const lfoGain = ctx.createGain();
          lfoGain.gain.value = 0.2; 
          const mixGain = ctx.createGain();
          mixGain.gain.value = 0.4; 
          lfo.connect(lfoGain);
          lfoGain.connect(mixGain.gain);
          osc1.connect(mixGain);
          osc2.connect(mixGain);
          mixGain.connect(gainNode);
          osc1.start();
          osc2.start();
          lfo.start();
          syntheticSourceNode = ctx.createBufferSource();
          syntheticSourceNode.buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
          syntheticSourceNode.loop = true;
          syntheticSourceNode.connect(gainNode);
          targetVolume = 0.3;
          extraSources.push(osc1, osc2, lfo, lfoGain, mixGain);
        } else if (type === 'som-c') {
          const osc = ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.value = 85; 
          const lfo = ctx.createOscillator();
          lfo.type = 'sine';
          lfo.frequency.value = 0.1;
          const filter = ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.value = 150;
          const lfoGain = ctx.createGain();
          lfoGain.gain.value = 50; 
          lfo.connect(lfoGain);
          lfoGain.connect(filter.frequency);
          osc.connect(filter);
          filter.connect(gainNode);
          osc.start();
          lfo.start();
          syntheticSourceNode = ctx.createBufferSource();
          syntheticSourceNode.buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
          syntheticSourceNode.loop = true;
          syntheticSourceNode.connect(gainNode);
          targetVolume = 0.5;
          extraSources.push(osc, lfo, lfoGain, filter);
        } else {
          syntheticSourceNode.connect(gainNode);
          targetVolume = 0.6;
        }
      } else if (['passaros', 'natureza'].includes(type)) {
        if (!buffers.birds) buffers.birds = generateBirdsBuffer(15);
        syntheticSourceNode = ctx.createBufferSource();
        syntheticSourceNode.buffer = buffers.birds;
        syntheticSourceNode.loop = true;
        
        if (type === 'natureza') {
          const windBuffer = buffers.brown || generateNoiseBuffer('brown');
          buffers.brown = windBuffer;
          const windSource = ctx.createBufferSource();
          windSource.buffer = windBuffer;
          windSource.loop = true;
          const windFilter = ctx.createBiquadFilter();
          windFilter.type = 'lowpass';
          windFilter.frequency.value = 400;
          const lfo = ctx.createOscillator();
          lfo.type = 'sine';
          lfo.frequency.value = 0.1;
          const lfoGain = ctx.createGain();
          lfoGain.gain.value = 300;
          lfo.connect(lfoGain);
          lfoGain.connect(windFilter.frequency);
          lfo.start();
          windSource.connect(windFilter);
          windFilter.connect(gainNode);
          windSource.start();
          extraSources.push(windSource, windFilter, lfo, lfoGain);
        }
        syntheticSourceNode.connect(gainNode);
        targetVolume = type === 'natureza' ? 0.6 : 0.4;
      } else if (['agua', 'lareira'].includes(type)) {
        if (!buffers.pink) buffers.pink = generateNoiseBuffer('pink');
        syntheticSourceNode = ctx.createBufferSource();
        syntheticSourceNode.buffer = buffers.pink;
        syntheticSourceNode.loop = true;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = type === 'lareira' ? 300 : 800;
        const lfo = ctx.createOscillator();
        lfo.type = 'sine';
        lfo.frequency.value = type === 'lareira' ? 0.5 : 0.2;
        const lfoGain = ctx.createGain();
        lfoGain.gain.value = type === 'lareira' ? 50 : 200;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
        syntheticSourceNode.connect(filter);
        filter.connect(gainNode);
        targetVolume = type === 'lareira' ? 0.8 : 0.6;
        extraSources.push(filter, lfo, lfoGain);
      } else {
        return; // nothing matched
      }
    }

    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(targetVolume, ctx.currentTime + 0.05);
    
    if (audioElementToPlay) {
      audioElementToPlay.currentTime = 0;
      await audioElementToPlay.play();
    } else if (syntheticSourceNode) {
      syntheticSourceNode.start();
    }

    activeNodes[type] = { 
      audioElement: audioElementToPlay,
      source: syntheticSourceNode, 
      gain: gainNode, 
      bassFilter, midFilter, trebleFilter, 
      extraSources, baseVolume: targetVolume 
    };
  } catch (e) {
    console.error("Audio playback error:", e);
  }
}

export async function playUrlSound(id: string, url: string) {
  try {
    const ctx = getAudioContext();
    if (activeNodes[id]) return;

    if (!buffers[url]) {
       const response = await fetch(url);
       const arrayBuffer = await response.arrayBuffer();
       buffers[url] = await ctx.decodeAudioData(arrayBuffer);
    }
    
    const gainNode = ctx.createGain();
    gainNode.gain.value = 0.001;
    
    const bassFilter = ctx.createBiquadFilter();
    bassFilter.type = 'lowshelf';
    bassFilter.frequency.value = 250;
    bassFilter.gain.value = 0;
    
    const midFilter = ctx.createBiquadFilter();
    midFilter.type = 'peaking';
    midFilter.frequency.value = 1000;
    midFilter.Q.value = 0.5;
    midFilter.gain.value = 0;
    
    const trebleFilter = ctx.createBiquadFilter();
    trebleFilter.type = 'highshelf';
    trebleFilter.frequency.value = 4000;
    trebleFilter.gain.value = 0;
    
    gainNode.connect(bassFilter);
    bassFilter.connect(midFilter);
    midFilter.connect(trebleFilter);
    trebleFilter.connect(ctx.destination);

    const sourceNode = ctx.createBufferSource();
    sourceNode.buffer = buffers[url];
    sourceNode.loop = true;
    sourceNode.connect(gainNode);

    const targetVolume = 0.8;
    gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(targetVolume, ctx.currentTime + 0.05);
    sourceNode.start();

    activeNodes[id] = { source: sourceNode, gain: gainNode, bassFilter, midFilter, trebleFilter, baseVolume: targetVolume };
  } catch (e) {
    console.error("Audio playback error:", e);
  }
}

export function setVolume(type: string, volumeScale: number) {
  const node = activeNodes[type];
  if (node) {
    const ctx = getAudioContext();
    node.gain.gain.cancelScheduledValues(ctx.currentTime);
    const newVolume = Math.max(0.0001, node.baseVolume * volumeScale);
    node.gain.gain.linearRampToValueAtTime(newVolume, ctx.currentTime + 0.1);
  }
}

export function setEQ(type: string, band: 'bass' | 'mid' | 'treble', level: number) {
  const node = activeNodes[type];
  if (node) {
    const ctx = getAudioContext();
    const db = (level - 0.5) * 30; 
    
    if (band === 'bass' && node.bassFilter) {
      node.bassFilter.gain.linearRampToValueAtTime(db, ctx.currentTime + 0.1);
    } else if (band === 'mid' && node.midFilter) {
      node.midFilter.gain.linearRampToValueAtTime(db, ctx.currentTime + 0.1);
    } else if (band === 'treble' && node.trebleFilter) {
      node.trebleFilter.gain.linearRampToValueAtTime(db, ctx.currentTime + 0.1);
    }
  }
}

import { MOCK_RECIPES, getAllRecipes } from '../data/mockRecipes';

export function toggleRefuge(active: boolean, soundId?: string | null) {
  ['som-a', 'som-b', 'som-c', 'refuge', 'rosa', 'agua', 'marrom', 'chuva', 'branco', 'vento', 'lareira', 'passaros'].forEach(s => stopSound(s as SoundType));
  
  if (active && soundId) {
    if (soundId.startsWith('mix')) {
      const recipe = getAllRecipes().find(r => r.id === soundId);
      if (recipe) {
        const sounds = Object.keys(recipe.config.volumes);
        sounds.forEach(async (sId) => {
          await playSound(sId as SoundType);
          const config = recipe.config;
          if (config.volumes[sId] !== undefined) {
            setVolume(sId, config.volumes[sId]);
          }
          if (config.eq[sId]) {
            setEQ(sId, 'bass', config.eq[sId].bass);
            setEQ(sId, 'mid', config.eq[sId].mid);
            setEQ(sId, 'treble', config.eq[sId].treble);
          }
        });
      }
    } else {
      playSound(soundId as SoundType);
    }
  }
}

export function stopSound(type: SoundType) {
  const node = activeNodes[type];
  if (node) {
    const ctx = getAudioContext();
    node.gain.gain.cancelScheduledValues(ctx.currentTime);
    node.gain.gain.setValueAtTime(node.gain.gain.value, ctx.currentTime);
    node.gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    setTimeout(() => {
      try {
        if (node.audioElement) {
          node.audioElement.pause();
        } else if (node.source) {
          node.source.stop();
          node.source.disconnect();
        }
        
        node.gain.disconnect();
        if (node.bassFilter) node.bassFilter.disconnect();
        if (node.midFilter) node.midFilter.disconnect();
        if (node.trebleFilter) node.trebleFilter.disconnect();
        node.extraSources?.forEach(s => {
          if (s instanceof OscillatorNode) {
            try { s.stop(); } catch(e) {}
          }
          s.disconnect();
        });
      } catch (e) {}
    }, 1200);
    
    delete activeNodes[type];
  }
}
