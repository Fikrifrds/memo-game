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

// Soft "card flip" — layered click with a gentle whoosh
export function playFlipSound() {
    if (!enabled) return;
    const ctx = getContext();
    const t = ctx.currentTime;

    // Soft click body (short sine pop)
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.connect(oscGain);
    oscGain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(500, t + 0.06);
    oscGain.gain.setValueAtTime(0.12 * volume, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);
    osc.start(t);
    osc.stop(t + 0.07);

    // Subtle noise whoosh for paper/card texture
    const bufferSize = ctx.sampleRate * 0.06;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.3;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    // Bandpass filter to shape the noise
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(3000, t);
    filter.Q.setValueAtTime(0.8, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.06 * volume, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.05);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);
    noise.start(t);
    noise.stop(t + 0.06);
}

// Warm correct match chime — two-note arpeggio with harmonics
export function playCorrectSound() {
    if (!enabled) return;
    const ctx = getContext();
    const t = ctx.currentTime;

    const notes = [
        { freq: 523.25, delay: 0, dur: 0.25 },     // C5
        { freq: 659.25, delay: 0.1, dur: 0.3 },     // E5
        { freq: 783.99, delay: 0.2, dur: 0.35 },     // G5
    ];

    notes.forEach(({ freq, delay, dur }) => {
        // Fundamental
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, t + delay);
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.15 * volume, t + delay + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t + delay + dur);
        osc.start(t + delay);
        osc.stop(t + delay + dur);

        // Soft overtone (octave above, quieter) for warmth
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(freq * 2, t + delay);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        gain2.gain.setValueAtTime(0.001, t);
        gain2.gain.linearRampToValueAtTime(0.04 * volume, t + delay + 0.02);
        gain2.gain.exponentialRampToValueAtTime(0.001, t + delay + dur * 0.7);
        osc2.start(t + delay);
        osc2.stop(t + delay + dur);
    });
}

// Gentle wrong buzz — soft low tone, not harsh
export function playWrongSound() {
    if (!enabled) return;
    const ctx = getContext();
    const t = ctx.currentTime;

    // Two dissonant notes (minor second) for a soft "nope"
    const freqs = [294, 277]; // D4 and C#4
    freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, t);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.85, t + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.1 * volume, t);
        gain.gain.linearRampToValueAtTime(0.12 * volume, t + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.3);
    });
}

// Streak combo sound — ascending pitch based on streak count
export function playStreakSound(streakCount) {
    if (!enabled) return;
    const ctx = getContext();
    const t = ctx.currentTime;

    // Base pitch rises with streak
    const basePitch = 600 + (streakCount - 2) * 80;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(basePitch, t);
    osc.frequency.exponentialRampToValueAtTime(basePitch * 1.5, t + 0.15);
    osc.connect(gain);
    gain.connect(ctx.destination);
    gain.gain.setValueAtTime(0.1 * volume, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    osc.start(t);
    osc.stop(t + 0.2);

    // Sparkle overtone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(basePitch * 2, t + 0.05);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    gain2.gain.setValueAtTime(0.001, t);
    gain2.gain.linearRampToValueAtTime(0.06 * volume, t + 0.07);
    gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
    osc2.start(t + 0.05);
    osc2.stop(t + 0.25);
}
