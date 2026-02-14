let audioCtx = null;
let enabled = true;
let volume = 1;

function getContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === "suspended") {
        audioCtx.resume();
    }
    return audioCtx;
}

export function setSoundEnabled(value) {
    enabled = value;
}

export function setSoundVolume(value) {
    volume = Math.max(0, Math.min(1, value));
}

// Helper: create a convolver for quick reverb tail
function createReverb(ctx, duration, decay) {
    const rate = ctx.sampleRate;
    const length = rate * duration;
    const impulse = ctx.createBuffer(2, length, rate);
    for (let ch = 0; ch < 2; ch++) {
        const data = impulse.getChannelData(ch);
        for (let i = 0; i < length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
        }
    }
    const convolver = ctx.createConvolver();
    convolver.buffer = impulse;
    return convolver;
}

// Helper: play a tone with envelope through a chain
function playTone(ctx, { freq, type = "sine", start, dur, attack = 0.01, vol = 0.15, dest }) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, start);
    osc.connect(gain);
    gain.connect(dest);
    gain.gain.setValueAtTime(0.001, start);
    gain.gain.linearRampToValueAtTime(vol * volume, start + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.start(start);
    osc.stop(start + dur + 0.01);
    return osc;
}

// ─── FLIP: snappy card flip with body + paper whoosh ───
export function playFlipSound() {
    if (!enabled) return;
    const ctx = getContext();
    const t = ctx.currentTime;

    // Snappy transient click (wood-like)
    const click = ctx.createOscillator();
    const clickGain = ctx.createGain();
    click.type = "triangle";
    click.frequency.setValueAtTime(1200, t);
    click.frequency.exponentialRampToValueAtTime(400, t + 0.03);
    click.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickGain.gain.setValueAtTime(0.18 * volume, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    click.start(t);
    click.stop(t + 0.05);

    // Tonal body — gives it a "pop" feeling
    const pop = ctx.createOscillator();
    const popGain = ctx.createGain();
    pop.type = "sine";
    pop.frequency.setValueAtTime(900, t);
    pop.frequency.exponentialRampToValueAtTime(450, t + 0.08);
    pop.connect(popGain);
    popGain.connect(ctx.destination);
    popGain.gain.setValueAtTime(0.1 * volume, t);
    popGain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
    pop.start(t);
    pop.stop(t + 0.09);

    // Paper whoosh — filtered noise burst
    const len = Math.floor(ctx.sampleRate * 0.07);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
        d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    const bp = ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(4000, t);
    bp.Q.setValueAtTime(1.2, t);
    const nGain = ctx.createGain();
    nGain.gain.setValueAtTime(0.08 * volume, t);
    nGain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    noise.connect(bp);
    bp.connect(nGain);
    nGain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.07);
}

// ─── CORRECT: bright cheerful celebration chime ───
export function playCorrectSound() {
    if (!enabled) return;
    const ctx = getContext();
    const t = ctx.currentTime;

    // Reverb bus for sparkle
    const reverb = createReverb(ctx, 0.6, 3);
    const reverbGain = ctx.createGain();
    reverbGain.gain.setValueAtTime(0.15 * volume, t);
    reverb.connect(reverbGain);
    reverbGain.connect(ctx.destination);

    // Major arpeggio: C5 → E5 → G5 → C6 (bright & triumphant)
    const notes = [
        { freq: 523.25, delay: 0, dur: 0.35 },      // C5
        { freq: 659.25, delay: 0.08, dur: 0.32 },    // E5
        { freq: 783.99, delay: 0.16, dur: 0.30 },    // G5
        { freq: 1046.50, delay: 0.24, dur: 0.40 },   // C6 — high sparkle
    ];

    notes.forEach(({ freq, delay, dur }) => {
        // Main tone — direct
        playTone(ctx, { freq, type: "sine", start: t + delay, dur, vol: 0.14, dest: ctx.destination });
        // Warm harmonic — 2nd partial, softer
        playTone(ctx, { freq: freq * 2, type: "sine", start: t + delay, dur: dur * 0.6, vol: 0.035, dest: ctx.destination });
        // Reverb send — adds sparkle tail
        playTone(ctx, { freq, type: "sine", start: t + delay, dur: dur * 0.5, vol: 0.06, dest: reverb });
    });

    // Shimmer — high frequency sparkle noise
    const shimLen = Math.floor(ctx.sampleRate * 0.15);
    const shimBuf = ctx.createBuffer(1, shimLen, ctx.sampleRate);
    const shimData = shimBuf.getChannelData(0);
    for (let i = 0; i < shimLen; i++) {
        shimData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / shimLen, 2);
    }
    const shimmer = ctx.createBufferSource();
    shimmer.buffer = shimBuf;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(6000, t);
    const shimGain = ctx.createGain();
    shimGain.gain.setValueAtTime(0.03 * volume, t + 0.2);
    shimGain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    shimmer.connect(hp);
    hp.connect(shimGain);
    shimGain.connect(ctx.destination);
    shimmer.start(t + 0.2);
    shimmer.stop(t + 0.45);
}

// ─── WRONG: gentle womp-womp, not annoying ───
export function playWrongSound() {
    if (!enabled) return;
    const ctx = getContext();
    const t = ctx.currentTime;

    // First womp — descending
    const o1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    o1.type = "triangle";
    o1.frequency.setValueAtTime(380, t);
    o1.frequency.exponentialRampToValueAtTime(280, t + 0.18);
    o1.connect(g1);
    g1.connect(ctx.destination);
    g1.gain.setValueAtTime(0.001, t);
    g1.gain.linearRampToValueAtTime(0.13 * volume, t + 0.02);
    g1.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    o1.start(t);
    o1.stop(t + 0.2);

    // Second womp — lower, sadder
    const o2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    o2.type = "triangle";
    o2.frequency.setValueAtTime(300, t + 0.18);
    o2.frequency.exponentialRampToValueAtTime(200, t + 0.42);
    o2.connect(g2);
    g2.connect(ctx.destination);
    g2.gain.setValueAtTime(0.001, t + 0.18);
    g2.gain.linearRampToValueAtTime(0.11 * volume, t + 0.2);
    g2.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
    o2.start(t + 0.18);
    o2.stop(t + 0.42);

    // Subtle sub for body
    const sub = ctx.createOscillator();
    const sg = ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(120, t);
    sub.connect(sg);
    sg.connect(ctx.destination);
    sg.gain.setValueAtTime(0.06 * volume, t);
    sg.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    sub.start(t);
    sub.stop(t + 0.35);
}

// ─── STREAK: escalating excitement based on combo count ───
export function playStreakSound(streakCount) {
    if (!enabled) return;
    const ctx = getContext();
    const t = ctx.currentTime;

    const reverb = createReverb(ctx, 0.4, 4);
    const reverbGain = ctx.createGain();
    reverbGain.gain.setValueAtTime(0.12 * volume, t);
    reverb.connect(reverbGain);
    reverbGain.connect(ctx.destination);

    // Base pitch escalates with streak — starts exciting, gets euphoric
    const semitones = Math.min(streakCount - 2, 8) * 2;
    const base = 700 * Math.pow(2, semitones / 12);

    // Quick ascending two-note fanfare
    [0, 0.07].forEach((delay, i) => {
        const freq = base * (i === 0 ? 1 : 1.5); // root → fifth
        playTone(ctx, { freq, type: "sine", start: t + delay, dur: 0.2, vol: 0.12, dest: ctx.destination });
        playTone(ctx, { freq: freq * 2, type: "sine", start: t + delay, dur: 0.12, vol: 0.03, dest: ctx.destination });
        playTone(ctx, { freq, type: "sine", start: t + delay, dur: 0.15, vol: 0.05, dest: reverb });
    });

    // Sparkle burst — gets bigger with higher streaks
    const sparkleVol = Math.min(0.04 + streakCount * 0.005, 0.08);
    const sparkleLen = Math.floor(ctx.sampleRate * (0.1 + streakCount * 0.01));
    const sBuf = ctx.createBuffer(1, sparkleLen, ctx.sampleRate);
    const sData = sBuf.getChannelData(0);
    for (let i = 0; i < sparkleLen; i++) {
        sData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / sparkleLen, 1.5);
    }
    const sparkle = ctx.createBufferSource();
    sparkle.buffer = sBuf;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(5000 + streakCount * 300, t);
    const spkGain = ctx.createGain();
    spkGain.gain.setValueAtTime(sparkleVol * volume, t + 0.1);
    spkGain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
    sparkle.connect(hp);
    hp.connect(spkGain);
    spkGain.connect(ctx.destination);
    sparkle.start(t + 0.1);
    sparkle.stop(t + 0.3);
}

// ─── WIN: triumphant victory fanfare ───
export function playWinSound() {
    if (!enabled) return;
    const ctx = getContext();
    const t = ctx.currentTime;

    // Reverb for grand tail
    const reverb = createReverb(ctx, 1.2, 2.5);
    const reverbGain = ctx.createGain();
    reverbGain.gain.setValueAtTime(0.18 * volume, t);
    reverb.connect(reverbGain);
    reverbGain.connect(ctx.destination);

    // Victory fanfare — ascending major chord arpeggio
    const notes = [
        { freq: 523.25, delay: 0, dur: 0.5 },       // C5
        { freq: 659.25, delay: 0.12, dur: 0.45 },    // E5
        { freq: 783.99, delay: 0.24, dur: 0.42 },    // G5
        { freq: 1046.50, delay: 0.36, dur: 0.55 },   // C6
        { freq: 1318.51, delay: 0.50, dur: 0.65 },   // E6 — triumphant peak
    ];

    notes.forEach(({ freq, delay, dur }) => {
        playTone(ctx, { freq, type: "sine", start: t + delay, dur, vol: 0.13, dest: ctx.destination });
        playTone(ctx, { freq: freq * 2, type: "sine", start: t + delay, dur: dur * 0.5, vol: 0.03, dest: ctx.destination });
        playTone(ctx, { freq, type: "sine", start: t + delay, dur: dur * 0.6, vol: 0.07, dest: reverb });
    });

    // Final chord — all notes ring together for a big finish
    const chordStart = t + 0.65;
    const chordFreqs = [523.25, 659.25, 783.99, 1046.50];
    chordFreqs.forEach((freq) => {
        playTone(ctx, { freq, type: "sine", start: chordStart, dur: 0.9, attack: 0.02, vol: 0.1, dest: ctx.destination });
        playTone(ctx, { freq, type: "sine", start: chordStart, dur: 0.7, vol: 0.05, dest: reverb });
    });

    // Shimmer burst at the peak
    const shimLen = Math.floor(ctx.sampleRate * 0.4);
    const shimBuf = ctx.createBuffer(1, shimLen, ctx.sampleRate);
    const shimData = shimBuf.getChannelData(0);
    for (let i = 0; i < shimLen; i++) {
        shimData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / shimLen, 2);
    }
    const shimmer = ctx.createBufferSource();
    shimmer.buffer = shimBuf;
    const hp = ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.setValueAtTime(5000, t);
    const shimGain = ctx.createGain();
    shimGain.gain.setValueAtTime(0.001, t);
    shimGain.gain.linearRampToValueAtTime(0.05 * volume, chordStart);
    shimGain.gain.exponentialRampToValueAtTime(0.001, chordStart + 0.8);
    shimmer.connect(hp);
    hp.connect(shimGain);
    shimGain.connect(ctx.destination);
    shimmer.start(t + 0.5);
    shimmer.stop(chordStart + 0.8);
}
