/**
 * Web Audio API Ambient Synthesizer for Mindmate
 * Generates peaceful, gentle ambient soundscapes directly in-browser:
 * - Alpha Waves (10 Hz binaural tone + warm pad)
 * - Theta Waves (6 Hz deep relaxation tone + soft chord)
 * - Ocean Tide (gentle filtered pink noise sweep)
 * - Serene Chimes (occasional gentle bell chimes)
 * Includes smooth fade-in, volume control, and audio ducking.
 */

let audioCtx = null;
let activeSourceNodes = [];
let masterGain = null;
let currentTrack = null;
let chimeInterval = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopAmbientSoundscape() {
  if (chimeInterval) {
    clearInterval(chimeInterval);
    chimeInterval = null;
  }
  activeSourceNodes.forEach(node => {
    try {
      if (node.stop) node.stop();
      if (node.disconnect) node.disconnect();
    } catch {
      // ignore cleanup errors
    }
  });
  activeSourceNodes = [];
  currentTrack = null;
}

export function setAmbientVolume(volume) {
  // volume is 0.0 to 1.0
  if (masterGain && audioCtx) {
    const safeVol = Math.max(0, Math.min(1, volume)) * 0.25; // keep soothing and gentle
    masterGain.gain.setTargetAtTime(safeVol, audioCtx.currentTime, 0.1);
  }
}

export function duckAmbientVolume(duck = true, baseVolume = 0.5) {
  if (masterGain && audioCtx) {
    const target = duck ? (baseVolume * 0.05) : (baseVolume * 0.25);
    masterGain.gain.setTargetAtTime(target, audioCtx.currentTime, 0.3);
  }
}

export function startAmbientSoundscape(trackType = 'alpha', volume = 0.5) {
  stopAmbientSoundscape();
  const ctx = getAudioContext();
  if (!ctx) return;

  masterGain = ctx.createGain();
  const safeVol = Math.max(0, Math.min(1, volume)) * 0.25;
  masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
  masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, safeVol), ctx.currentTime + 1.5);
  masterGain.connect(ctx.destination);

  currentTrack = trackType;

  if (trackType === 'alpha') {
    // 10 Hz Binaural Beat with 200 Hz carrier and 210 Hz right
    createBinauralPad(ctx, masterGain, 200, 210);
  } else if (trackType === 'theta') {
    // 6 Hz Binaural Beat with 140 Hz carrier and 146 Hz right
    createBinauralPad(ctx, masterGain, 140, 146);
  } else if (trackType === 'ocean') {
    // Gentle pink noise filter sweep simulating soothing waves
    createOceanWaves(ctx, masterGain);
  } else if (trackType === 'chimes') {
    // Soft harmonic ambient pad with gentle chime bells
    createChimeAmbiance(ctx, masterGain);
  }
}

function createBinauralPad(ctx, outputNode, leftFreq, rightFreq) {
  // Left ear
  const oscL = ctx.createOscillator();
  oscL.type = 'sine';
  oscL.frequency.setValueAtTime(leftFreq, ctx.currentTime);
  const pannerL = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  if (pannerL) pannerL.pan.value = -0.8;

  // Right ear
  const oscR = ctx.createOscillator();
  oscR.type = 'sine';
  oscR.frequency.setValueAtTime(rightFreq, ctx.currentTime);
  const pannerR = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  if (pannerR) pannerR.pan.value = 0.8;

  // Gentle low-pass filter
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 350;

  // Soft warmth sub-harmonic
  const oscSub = ctx.createOscillator();
  oscSub.type = 'triangle';
  oscSub.frequency.setValueAtTime(leftFreq / 2, ctx.currentTime);
  const subGain = ctx.createGain();
  subGain.gain.value = 0.15;

  if (pannerL && pannerR) {
    oscL.connect(pannerL);
    pannerL.connect(filter);
    oscR.connect(pannerR);
    pannerR.connect(filter);
  } else {
    oscL.connect(filter);
    oscR.connect(filter);
  }

  oscSub.connect(subGain);
  subGain.connect(filter);
  filter.connect(outputNode);

  oscL.start();
  oscR.start();
  oscSub.start();

  activeSourceNodes.push(oscL, oscR, oscSub, filter);
}

function createOceanWaves(ctx, outputNode) {
  // White/Pink noise buffer
  const bufferSize = ctx.sampleRate * 3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
    b6 = white * 0.115926;
  }

  const noiseNode = ctx.createBufferSource();
  noiseNode.buffer = buffer;
  noiseNode.loop = true;

  // Bandpass filter with gentle LFO modulation for waves in and out
  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(300, ctx.currentTime);

  const lfo = ctx.createOscillator();
  lfo.frequency.setValueAtTime(0.1, ctx.currentTime); // 10 second wave cycle
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(250, ctx.currentTime);

  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);

  noiseNode.connect(filter);
  filter.connect(outputNode);

  noiseNode.start();
  lfo.start();

  activeSourceNodes.push(noiseNode, lfo, filter, lfoGain);
}

function createChimeAmbiance(ctx, outputNode) {
  // Continuous warm fundamental pad
  const pad = ctx.createOscillator();
  pad.type = 'sine';
  pad.frequency.setValueAtTime(220, ctx.currentTime);
  const padGain = ctx.createGain();
  padGain.gain.setValueAtTime(0.2, ctx.currentTime);
  pad.connect(padGain);
  padGain.connect(outputNode);
  pad.start();
  activeSourceNodes.push(pad, padGain);

  const chimeFrequencies = [528, 660, 792, 1056, 1320]; // Solfeggio / pentatonic pleasant chimes
  const playOneChime = () => {
    if (!audioCtx || currentTrack !== 'chimes') return;
    try {
      const freq = chimeFrequencies[Math.floor(Math.random() * chimeFrequencies.length)];
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.0001, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.15, audioCtx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.0);
      osc.connect(gain);
      gain.connect(outputNode);
      osc.start();
      osc.stop(audioCtx.currentTime + 3.1);
    } catch {
      // ignore
    }
  };

  playOneChime();
  chimeInterval = setInterval(playOneChime, 4500);
}
