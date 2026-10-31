// A generative synthwave loop built from oscillators and noise: an Am-F-C-G
// progression at 96 BPM with a pad, an eighth-note bass, an arpeggio through
// a feedback delay, and a soft drum machine. Original, royalty-free, and
// about 1 KB of code instead of a multi-megabyte audio file.
const BPM = 96;
const STEP = 60 / BPM / 4; // sixteenth note
const LOOKAHEAD = 0.12;

// Chord roots (MIDI) and their triads: A minor, F major, C major, G major.
const CHORDS = [
  [57, 60, 64],
  [53, 57, 60],
  [48, 52, 55],
  [55, 59, 62],
];
const ARP = [0, 1, 2, 1, 2, 0, 2, 1];

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);

export function startSynth(ctx, out) {
  const bus = ctx.createGain();
  bus.gain.value = 0.9;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -18;
  comp.ratio.value = 4;
  bus.connect(comp).connect(out);

  // Shared feedback delay for the arpeggio and a little of the pad.
  const delay = ctx.createDelay(1);
  delay.delayTime.value = STEP * 3;
  const feedback = ctx.createGain();
  feedback.gain.value = 0.38;
  const delayTone = ctx.createBiquadFilter();
  delayTone.type = "lowpass";
  delayTone.frequency.value = 2600;
  delay.connect(delayTone).connect(feedback).connect(delay);
  delayTone.connect(bus);

  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate);
  const data = noiseBuffer.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;

  const voice = (type, freq, start, dur, gain, { cutoff = 8000, detune = 0, send = 0 } = {}) => {
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.value = freq;
    osc.detune.value = detune;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = cutoff;
    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0, start);
    amp.gain.linearRampToValueAtTime(gain, start + Math.min(0.02, dur / 4));
    amp.gain.exponentialRampToValueAtTime(0.0001, start + dur);
    osc.connect(filter).connect(amp).connect(bus);
    if (send) {
      const s = ctx.createGain();
      s.gain.value = send;
      amp.connect(s).connect(delay);
    }
    osc.start(start);
    osc.stop(start + dur + 0.05);
  };

  const pad = (chord, start, dur) => {
    chord.forEach((n) => {
      [-9, 9].forEach((d) => {
        const osc = ctx.createOscillator();
        osc.type = "sawtooth";
        osc.frequency.value = hz(n);
        osc.detune.value = d;
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(700, start);
        filter.frequency.linearRampToValueAtTime(1500, start + dur / 2);
        filter.frequency.linearRampToValueAtTime(700, start + dur);
        const amp = ctx.createGain();
        amp.gain.setValueAtTime(0, start);
        amp.gain.linearRampToValueAtTime(0.028, start + 0.6);
        amp.gain.setValueAtTime(0.028, start + dur - 0.4);
        amp.gain.linearRampToValueAtTime(0, start + dur);
        osc.connect(filter).connect(amp).connect(bus);
        osc.start(start);
        osc.stop(start + dur + 0.05);
      });
    });
  };

  const kick = (t) => {
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.frequency.setValueAtTime(140, t);
    osc.frequency.exponentialRampToValueAtTime(42, t + 0.18);
    amp.gain.setValueAtTime(0.55, t);
    amp.gain.exponentialRampToValueAtTime(0.001, t + 0.32);
    osc.connect(amp).connect(bus);
    osc.start(t);
    osc.stop(t + 0.35);
  };

  const noise = (t, dur, gain, freq, type = "highpass") => {
    const src = ctx.createBufferSource();
    src.buffer = noiseBuffer;
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    const amp = ctx.createGain();
    amp.gain.setValueAtTime(gain, t);
    amp.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(filter).connect(amp).connect(bus);
    src.start(t);
    src.stop(t + dur + 0.02);
  };

  let step = 0;
  let next = ctx.currentTime + 0.1;
  let running = true;

  const schedule = (i, t) => {
    const bar = Math.floor(i / 16) % CHORDS.length;
    const s = i % 16;
    const chord = CHORDS[bar];
    if (s === 0) pad(chord, t, STEP * 16);
    if (s % 2 === 0) voice("sawtooth", hz(chord[0] - 24), t, STEP * 1.8, 0.16, { cutoff: 420 + (s % 4 === 0 ? 200 : 0) });
    const note = chord[ARP[s % ARP.length]] + 12;
    voice("square", hz(note), t, STEP * 0.9, 0.035, { cutoff: 2400, send: 0.6 });
    if (s % 4 === 0) kick(t);
    if (s === 4 || s === 12) noise(t, 0.18, 0.22, 1800, "bandpass");
    if (s % 2 === 1) noise(t, 0.04, 0.05, 7000);
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
    label: "Leonida Nights (generative)",
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
