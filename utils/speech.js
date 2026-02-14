let voicesLoaded = false;

function ensureVoices() {
    if (voicesLoaded) return;
    // Trigger voice loading — some browsers load lazily
    window.speechSynthesis.getVoices();
    voicesLoaded = true;
}

function findVoice(lang) {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    // Exact match first (e.g. "id-ID")
    let voice = voices.find(v => v.lang === lang);
    if (voice) return voice;

    // Prefix match (e.g. "id-ID" matches voice with lang "id")
    const prefix = lang.split("-")[0].toLowerCase();
    voice = voices.find(v => v.lang.toLowerCase().startsWith(prefix));
    return voice || null;
}

export function speak(text, lang = "en-US") {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    ensureVoices();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.pitch = 1.1;

    const voice = findVoice(lang);
    if (voice) {
        utterance.voice = voice;
    }

    window.speechSynthesis.speak(utterance);
}
