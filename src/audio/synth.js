// "Leonida Drive": an original, generative West Coast groove built from
// oscillators and noise, in the laid-back spirit of the open-road radio of
// the series (no melody, sample or recording from any Rockstar soundtrack).
// 92 BPM with swing: a Cm7 - Abmaj7 - Fm7 - G7 loop on an electric-piano
// voice, a round sub bass with slides, a sine "whistle" lead with vibrato
// and portamento, and a boom-bap kit. Royalty-free and a few KB of code.
const BPM = 92;
const STEP = 60 / BPM / 4; // sixteenth note
const SWING = 0.17; // fraction of a sixteenth that the off-beats lag
const LOOKAHEAD = 0.12;

// Four bars, one chord each: voicings around middle C, plus the bass root.
const BARS = [
  { chord: [55, 58, 60, 63], root: 36 }, // Cm7
  { chord: [56, 60, 63, 67], root: 32 }, // Abmaj7
  { chord: [56, 60, 63, 65], root: 29 }, // Fm7
  { chord: [55, 59, 62, 65], root: 31 }, // G7
];

// Bass line per bar: [step, semitones above the root, length in steps].
const BASS = [
  [0, 0, 3],
  [3, 12, 1],
  [6, 0, 2],
  [10, 7, 2],
  [14, 10, 2],
];

// The whistle lead: an original two-bar phrase over C minor pentatonic,
// answered by a second phrase. [bar-in-phrase, step, midi, length].
const LEAD = [
  [
    [0, 2, 79, 3],
    [0, 6, 77, 2],
    [0, 8, 75, 4],
    [0, 14, 72, 2],
    [1, 0, 75, 6],
    [1, 8, 70, 4],
  ],
  [
    [0, 2, 79, 2],
    [0, 4, 82, 3],
    [0, 8, 79, 2],
    [0, 10, 77, 4],
    [1, 0, 75, 3],
    [1, 4, 77, 2],
    [1, 6, 74, 6],
  ],
];

// Drums per bar: kick, snare and hat steps.
const KICK = [0, 7, 10];
const SNARE = [4, 12];
const HAT = [0, 2, 4, 6, 8, 10, 12];
const OPEN_HAT = 14;

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

export function startSynth(ctx, out) {
  const bus = ctx.createGain();
  bus.gain.value = 0.85;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16;
  comp.ratio.value = 3.5;
  comp.attack.value = 0.01;
  bus.connect(comp).connect(out);

  // A short room for the keys and the lead.
  const delay = ctx.createDelay(1);
  delay.delayTime.value = STEP * 3;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.28;
  const delayTone = ctx.createBiquadFilter();
  delayTone.type = "lowpass";
  delayTone.frequency.value = 2200;
  delay.connect(delayTone).connect(feedback).connect(delay);
  delayTone.connect(bus);
  const send = (node, amount) => {
    const g = ctx.createGain();
    g.gain.value = amount;
    node.connect(g).connect(delay);
  };

  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  // Electric piano: a sine and a soft triangle an octave up, with tremolo.
  const keys = (chord, start, dur, gain) => {
    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0, start);
    amp.gain.linearRampToValueAtTime(gain, start + 0.012);
    amp.gain.exponentialRampToValueAtTime(gain * 0.35, start + dur * 0.5);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    const trem = ctx.createGain();
    trem.gain.value = 0.85;
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 5.2;
    const depth = ctx.createGain();
    depth.gain.value = 0.15;
    lfo.connect(depth).connect(trem.gain);
    const tone = ctx.createBiquadFilter();
    tone.type = "lowpass";
    tone.frequency.value = 2400;
    amp.connect(trem).connect(tone).connect(bus);
    send(tone, 0.25);
    chord.forEach((n) => {
      [
        ["sine", 1, 1],
        ["triangle", 2, 0.25],
      ].forEach(([type, mult, level]) => {
        const osc = ctx.createOscillator();
        osc.type = type;
        osc.frequency.value = hz(n) * mult;
        const g = ctx.createGain();
        g.gain.value = level / chord.length;
        osc.connect(g).connect(amp);
        osc.start(start);
        osc.stop(start + dur + 0.05);
      });
    });
    lfo.start(start);
    lfo.stop(start + dur + 0.05);
  };

  // Sub bass: a sine with a touch of drive, sliding into each note.
  const shaper = ctx.createWaveShaper();
  const curve = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    const x = (i / 255) * 2 - 1;
    curve[i] = Math.tanh(x * 1.8);
  }
  shaper.curve = curve;
  const bassTone = ctx.createBiquadFilter();
  bassTone.type = "lowpass";
  bassTone.frequency.value = 520;
  shaper.connect(bassTone).connect(bus);
  let lastBass = null;
  const bass = (midi, start, dur) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    const f = hz(midi);
    osc.frequency.setValueAtTime(lastBass ?? f, start);
    osc.frequency.exponentialRampToValueAtTime(f, start + 0.06);
    lastBass = f;
    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0, start);
    amp.gain.linearRampToValueAtTime(0.42, start + 0.015);
    amp.gain.setValueAtTime(0.42, start + dur * 0.7);
    amp.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(amp).connect(shaper);
    osc.start(start);
    osc.stop(start + dur + 0.05);
  };

  // The whistle: a sine with delayed vibrato and portamento between notes.
  let lastLead = null;
  const lead = (midi, start, dur) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    const f = hz(midi);
    osc.frequency.setValueAtTime(lastLead ?? f, start);
    osc.frequency.exponentialRampToValueAtTime(f, start + 0.09);
    lastLead = f;
    const vib = ctx.createOscillator();
    vib.frequency.value = 5.6;
    const vibDepth = ctx.createGain();
    vibDepth.gain.setValueAtTime(0, start);
    vibDepth.gain.linearRampToValueAtTime(f * 0.012, start + Math.min(dur, 0.35));
    vib.connect(vibDepth).connect(osc.frequency);
    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0, start);
    amp.gain.linearRampToValueAtTime(0.07, start + 0.05);
    amp.gain.setValueAtTime(0.07, start + dur * 0.8);
    amp.gain.linearRampToValueAtTime(0, start + dur);
    osc.connect(amp).connect(bus);
    send(amp, 0.5);
    osc.start(start);
    vib.start(start);
    osc.stop(start + dur + 0.05);
    vib.stop(start + dur + 0.05);
  };

  const kick = (t) => {
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(40, t + 0.22);
    amp.gain.setValueAtTime(0.7, t);
    amp.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    osc.connect(amp).connect(bus);
    osc.start(t);
    osc.stop(t + 0.42);
  };

  const noise = (t, dur, gain, freq, type = "highpass", q = 1) => {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    filter.Q.value = q;
    const amp = ctx.createGain();
    amp.gain.setValueAtTime(gain, t);
    amp.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filter).connect(amp).connect(bus);
    src.start(t);
    src.stop(t + dur + 0.02);
  };

  // A snare from a pitched body plus a band of noise and a short clap.
  const snare = (t) => {
    const osc = ctx.createOscillator();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, t);
    osc.frequency.exponentialRampToValueAtTime(150, t + 0.08);
    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0.22, t);
    amp.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    osc.connect(amp).connect(bus);
    osc.start(t);
    osc.stop(t + 0.14);
    noise(t, 0.2, 0.28, 1900, "bandpass", 0.8);
    noise(t + 0.012, 0.09, 0.12, 1200, "bandpass", 1.4);
  };

  let step = 0;
  let next = ctx.currentTime + 0.1;
  let running = true;

  const schedule = (i, t) => {
    const s = i % 16;
    const barIndex = Math.floor(i / 16);
    const bar = BARS[barIndex % BARS.length];
    // Off-beat sixteenths lag a little: that lag is the swing.
    const at = t + (s % 2 === 1 ? STEP * SWING : 0);

    if (s === 0) keys(bar.chord, at, STEP * 5, 0.2);
    if (s === 6) keys(bar.chord, at, STEP * 3, 0.13);
    if (s === 11) keys(bar.chord, at, STEP * 4, 0.1);

    for (const [st, interval, len] of BASS) if (st === s) bass(bar.root + interval, at, STEP * len);

    // The lead plays every other 8-bar cycle, alternating its two phrases,
    // so the loop breathes between them.
    const cycle = Math.floor(barIndex / 8);
    if (cycle % 2 === 1) {
      const phrase = LEAD[Math.floor(cycle / 2) % LEAD.length];
      const inPhrase = barIndex % 2;
      for (const [b, st, midi, len] of phrase) if (b === inPhrase && st === s) lead(midi, at, STEP * len);
    }

    if (KICK.includes(s)) kick(at);
    if (SNARE.includes(s)) snare(at);
    if (HAT.includes(s)) noise(at, 0.035, s % 4 === 0 ? 0.06 : 0.04, 8000);
    if (s === OPEN_HAT) noise(at, 0.18, 0.045, 7000);
  };

  const timer = setInterval(() => {
    if (!running) return;
    while (next < ctx.currentTime + LOOKAHEAD) {
      schedule(step, next);
      step += 1;
      next += STEP;
    }
  }, 25);

  return {
    label: "Leonida Drive (generative)",
    pause: () => {
      running = false;
    },
    resume: () => {
      if (running) return;
      running = true;
      next = ctx.currentTime + 0.05;
    },
    stop: () => {
      running = false;
      clearInterval(timer);
      bus.disconnect();
    },
  };
}
