"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Card from "./Card";
import { LEARNING_THEMES } from "@/data/learningThemes";
import { speak } from "@/utils/speech";
import { playFlipSound, playCorrectSound, playWrongSound, setSoundEnabled } from "@/utils/sounds";

const THEMES = {
    farm: {
        name: "Farm",
        icon: "🐄",
        cards: [
            { src: "🐄", matched: false }, { src: "🐓", matched: false }, { src: "🦢", matched: false }, { src: "🐑", matched: false },
            { src: "🐴", matched: false }, { src: "🐇", matched: false }, { src: "🐕", matched: false }, { src: "🐈", matched: false },
            { src: "🦆", matched: false }, { src: "🐐", matched: false }, { src: "🦃", matched: false }, { src: "🐝", matched: false },
            { src: "🐛", matched: false }, { src: "🦋", matched: false }, { src: "🐞", matched: false }, { src: "🐌", matched: false },
            { src: "🐸", matched: false }, { src: "🐢", matched: false }, { src: "🦔", matched: false }, { src: "🐿️", matched: false },
            { src: "🦉", matched: false }, { src: "🐦", matched: false }, { src: "🐤", matched: false }, { src: "🐮", matched: false },
        ]
    },
    garden: {
        name: "Garden",
        icon: "🌻",
        cards: [
            { src: "🌻", matched: false }, { src: "🌷", matched: false }, { src: "🌹", matched: false }, { src: "🌺", matched: false },
            { src: "🌸", matched: false }, { src: "🌼", matched: false }, { src: "🌿", matched: false }, { src: "🍀", matched: false },
            { src: "🌵", matched: false }, { src: "🌱", matched: false }, { src: "🍄", matched: false }, { src: "🌾", matched: false },
            { src: "🌳", matched: false }, { src: "🪴", matched: false }, { src: "🍁", matched: false }, { src: "🍂", matched: false },
            { src: "🍃", matched: false }, { src: "🪻", matched: false }, { src: "🫧", matched: false }, { src: "🪺", matched: false },
            { src: "🌲", matched: false }, { src: "🌴", matched: false }, { src: "🏵️", matched: false }, { src: "💐", matched: false },
        ]
    },
    fruits: {
        name: "Fruits",
        icon: "🍎",
        cards: [
            { src: "🍎", matched: false }, { src: "🍌", matched: false }, { src: "🍇", matched: false }, { src: "🍊", matched: false },
            { src: "🍓", matched: false }, { src: "🍉", matched: false }, { src: "🍋", matched: false }, { src: "🍑", matched: false },
            { src: "🍍", matched: false }, { src: "🥝", matched: false }, { src: "🥥", matched: false }, { src: "🍒", matched: false },
            { src: "🍈", matched: false }, { src: "🫐", matched: false }, { src: "🥭", matched: false }, { src: "🍏", matched: false },
            { src: "🥑", matched: false }, { src: "🍐", matched: false }, { src: "🌽", matched: false }, { src: "🍅", matched: false },
            { src: "🫑", matched: false }, { src: "🥕", matched: false }, { src: "🥒", matched: false }, { src: "🌶️", matched: false },
        ]
    },
    animals: {
        name: "Animals",
        icon: "🦊",
        cards: [
            { src: "🦊", matched: false }, { src: "🐻", matched: false }, { src: "🐼", matched: false }, { src: "🐨", matched: false },
            { src: "🐯", matched: false }, { src: "🦁", matched: false }, { src: "🐵", matched: false }, { src: "🐘", matched: false },
            { src: "🦒", matched: false }, { src: "🦓", matched: false }, { src: "🐊", matched: false }, { src: "🦩", matched: false },
            { src: "🦜", matched: false }, { src: "🐧", matched: false }, { src: "🐬", matched: false }, { src: "🐙", matched: false },
            { src: "🦀", matched: false }, { src: "🐠", matched: false }, { src: "🦈", matched: false }, { src: "🐋", matched: false },
            { src: "🦅", matched: false }, { src: "🐺", matched: false }, { src: "🦇", matched: false }, { src: "🐿️", matched: false },
        ]
    }
};

const DIFFICULTIES = {
    Easy: { pairs: 6, cols: 4 },
    Medium: { pairs: 12, cols: 6 },
    Hard: { pairs: 24, cols: 8 },
};

const PLAYER_COLORS = [
    { bg: "bg-red-500", text: "text-red-700", border: "border-red-300" },
    { bg: "bg-sky-500", text: "text-sky-700", border: "border-sky-300" },
    { bg: "bg-amber-500", text: "text-amber-700", border: "border-amber-300" },
    { bg: "bg-emerald-500", text: "text-emerald-700", border: "border-emerald-300" },
    { bg: "bg-violet-500", text: "text-violet-700", border: "border-violet-300" },
    { bg: "bg-pink-500", text: "text-pink-700", border: "border-pink-300" },
    { bg: "bg-teal-500", text: "text-teal-700", border: "border-teal-300" },
    { bg: "bg-orange-500", text: "text-orange-700", border: "border-orange-300" },
    { bg: "bg-indigo-500", text: "text-indigo-700", border: "border-indigo-300" },
    { bg: "bg-lime-500", text: "text-lime-700", border: "border-lime-300" },
];

const ALL_THEMES = { ...THEMES, ...LEARNING_THEMES };

const MAX_PLAYERS = 10;

function Confetti() {
    const particles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        size: 6 + Math.random() * 8,
        color: ['#ef4444', '#f59e0b', '#22c55e', '#06b6d4', '#f97316', '#eab308'][Math.floor(Math.random() * 6)],
    }));

    return (
        <div className="fixed inset-0 pointer-events-none z-[60] overflow-hidden">
            {particles.map((p) => (
                <div
                    key={p.id}
                    className="absolute animate-confetti"
                    style={{
                        left: `${p.left}%`,
                        top: '-10px',
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`,
                    }}
                />
            ))}
        </div>
    );
}

const SAVE_KEY = 'memo-game-state';

function loadSavedGame() {
    try {
        const saved = localStorage.getItem(SAVE_KEY);
        if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return null;
}

function clearSavedGame() {
    try { localStorage.removeItem(SAVE_KEY); } catch { /* ignore */ }
}

export default function GameBoard() {
    const [gameState, setGameState] = useState("setup");
    const [cards, setCards] = useState([]);
    const [turns, setTurns] = useState(0);
    const [choiceOne, setChoiceOne] = useState(null);
    const [choiceTwo, setChoiceTwo] = useState(null);
    const [disabled, setDisabled] = useState(false);

    const [elapsedTime, setElapsedTime] = useState(0);
    const timerRef = useRef(null);
    const startTimeRef = useRef(null);

    const [difficulty, setDifficulty] = useState("Easy");
    const [playerNames, setPlayerNames] = useState(["Player 1", "Player 2"]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [scores, setScores] = useState([0, 0]);
    const [theme, setTheme] = useState("farm");
    const [turnTimerEnabled, setTurnTimerEnabled] = useState(false);
    const [turnTimerSeconds, setTurnTimerSeconds] = useState(30);
    const [soundEnabled, setSoundEnabledState] = useState(true);
    const [turnTimeLeft, setTurnTimeLeft] = useState(null);
    const turnTimerRef = useRef(null);

    const [bestScore, setBestScore] = useState(null);

    // On mount: load best scores + sound setting + restore saved game if exists
    useEffect(() => {
        try {
            const savedSound = localStorage.getItem('flipmatch-sound-enabled');
            if (savedSound !== null) {
                const val = savedSound === 'true';
                setSoundEnabledState(val);
                setSoundEnabled(val);
            }
        } catch { /* ignore */ }

        try {
            const saved = localStorage.getItem('memo-best-scores');
            if (saved) setBestScore(JSON.parse(saved));
        } catch { /* ignore */ }

        const sg = loadSavedGame();
        if (sg?.gameState === "playing") {
            // Restore all game state
            setGameState("playing");
            setCards(sg.cards);
            setTurns(sg.turns);
            setDifficulty(sg.difficulty);
            setTheme(sg.theme);
            setPlayerNames(sg.playerNames);
            setCurrentPlayerIndex(sg.currentPlayerIndex);
            setScores(sg.scores);
            setElapsedTime(sg.elapsedTime || 0);
            setTurnTimerEnabled(sg.turnTimerEnabled || false);
            setTurnTimerSeconds(sg.turnTimerSeconds || 30);

            // Resume elapsed timer from saved offset
            const resumeOffset = sg.elapsedTime || 0;
            const now = Date.now();
            startTimeRef.current = now - resumeOffset;
            timerRef.current = setInterval(() => {
                setElapsedTime(Date.now() - (now - resumeOffset));
            }, 100);

            // Resume turn timer
            if (sg.turnTimerEnabled) {
                setTurnTimeLeft(sg.turnTimerSeconds);
                const startedAt = Date.now();
                turnTimerRef.current = setInterval(() => {
                    const elapsed = Math.floor((Date.now() - startedAt) / 1000);
                    const remaining = sg.turnTimerSeconds - elapsed;
                    if (remaining <= 0) {
                        clearInterval(turnTimerRef.current);
                        turnTimerRef.current = null;
                        setTurnTimeLeft(0);
                    } else {
                        setTurnTimeLeft(remaining);
                    }
                }, 250);
            }
        }
    }, []);

    const saveBestScore = useCallback((time, moves, diff) => {
        const key = `${theme}-${diff}-${playerNames.length}p`;
        const newBest = { ...bestScore };
        const current = newBest[key];
        if (!current || moves < current.moves || (moves === current.moves && time < current.time)) {
            newBest[key] = { moves, time, date: Date.now() };
            setBestScore(newBest);
            try { localStorage.setItem('memo-best-scores', JSON.stringify(newBest)); } catch { /* ignore */ }
            return true;
        }
        return false;
    }, [bestScore, playerNames.length]);

    const startTimer = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        const now = Date.now();
        startTimeRef.current = now;
        setElapsedTime(0);
        timerRef.current = setInterval(() => {
            setElapsedTime(Date.now() - now);
        }, 100);
    }, []);

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => stopTimer();
    }, [stopTimer]);

    const startTurnTimer = useCallback(() => {
        if (!turnTimerEnabled) return;
        if (turnTimerRef.current) clearInterval(turnTimerRef.current);
        setTurnTimeLeft(turnTimerSeconds);
        const startedAt = Date.now();
        turnTimerRef.current = setInterval(() => {
            const elapsed = Math.floor((Date.now() - startedAt) / 1000);
            const remaining = turnTimerSeconds - elapsed;
            if (remaining <= 0) {
                clearInterval(turnTimerRef.current);
                turnTimerRef.current = null;
                setTurnTimeLeft(0);
            } else {
                setTurnTimeLeft(remaining);
            }
        }, 250);
    }, [turnTimerEnabled, turnTimerSeconds]);

    const stopTurnTimer = useCallback(() => {
        if (turnTimerRef.current) {
            clearInterval(turnTimerRef.current);
            turnTimerRef.current = null;
        }
        setTurnTimeLeft(null);
    }, []);

    // Auto-skip turn when turn timer reaches 0
    useEffect(() => {
        if (turnTimeLeft === 0 && gameState === "playing" && !disabled) {
            // Close clue drawer if open
            setClueDrawer(null);
            // If one card is flipped, flip it back
            if (choiceOne && !choiceTwo) {
                setChoiceOne(null);
            }
            setCurrentPlayerIndex((prev) => (prev + 1) % playerNames.length);
            setTurns((prev) => prev + 1);
            startTurnTimer();
        }
    }, [turnTimeLeft]);

    const isLearningTheme = ALL_THEMES[theme]?.mode === "learning";

    const shuffleCards = useCallback(() => {
        const numPairs = DIFFICULTIES[difficulty].pairs;
        const themeData = ALL_THEMES[theme];
        let allCards;

        if (themeData.mode === "learning") {
            // Learning themes: flatten cardA/cardB pairs
            const selectedPairs = themeData.pairs.slice(0, numPairs);
            allCards = selectedPairs.flatMap((pair) => [
                { ...pair.cardA, pairId: pair.pairId, matched: false },
                { ...pair.cardB, pairId: pair.pairId, matched: false },
            ]);
        } else {
            // Classic themes: duplicate each card
            const selectedImages = themeData.cards.slice(0, numPairs);
            allCards = [...selectedImages, ...selectedImages];
        }

        const shuffledCards = allCards
            .sort(() => Math.random() - 0.5)
            .map((card) => ({ ...card, id: Math.random() }));

        setChoiceOne(null);
        setChoiceTwo(null);
        setCards(shuffledCards);
        setTurns(0);
        setDisabled(false);
    }, [difficulty, theme]);

    // Auto-save game state to localStorage when playing
    useEffect(() => {
        if (gameState !== "playing") return;
        try {
            localStorage.setItem(SAVE_KEY, JSON.stringify({
                gameState, cards, turns, difficulty, theme,
                playerNames, currentPlayerIndex, scores,
                elapsedTime, turnTimerEnabled, turnTimerSeconds,
            }));
        } catch { /* ignore */ }
    }, [gameState, cards, turns, currentPlayerIndex, scores, elapsedTime]);

    const startGame = () => {
        const trimmedNames = playerNames.map((n, i) => n.trim() || `Player ${i + 1}`);
        setPlayerNames(trimmedNames);
        setCurrentPlayerIndex(Math.floor(Math.random() * trimmedNames.length));
        setScores(new Array(trimmedNames.length).fill(0));
        shuffleCards();
        setGameState("playing");
        startTimer();
        startTurnTimer();
    };

    const restartGame = () => {
        stopTimer();
        stopTurnTimer();
        setScores(new Array(playerNames.length).fill(0));
        setCurrentPlayerIndex(Math.floor(Math.random() * playerNames.length));
        shuffleCards();
        setGameState("playing");
        startTimer();
    };

    const goToSetup = () => {
        stopTimer();
        stopTurnTimer();
        clearSavedGame();
        setGameState("setup");
    };

    const handleChoice = (card) => {
        if (choiceOne && choiceOne.id === card.id) return;
        playFlipSound();
        choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    };

    const [matchFeedback, setMatchFeedback] = useState(null);
    const [clueDrawer, setClueDrawer] = useState(null);

    useEffect(() => {
        if (choiceOne && choiceTwo) {
            setDisabled(true);
            // Use pairId for learning themes, src for classic themes
            const isMatch = choiceOne.pairId
                ? choiceOne.pairId === choiceTwo.pairId
                : choiceOne.src === choiceTwo.src;

            if (isMatch) {
                playCorrectSound();
                const matchKey = choiceOne.pairId || choiceOne.src;
                setCards((prevCards) =>
                    prevCards.map((card) => {
                        const cardKey = card.pairId || card.src;
                        return cardKey === matchKey ? { ...card, matched: true } : card;
                    })
                );
                setScores(prev => {
                    const newScores = [...prev];
                    newScores[currentPlayerIndex] += 1;
                    return newScores;
                });

                // Learning mode: TTS + feedback toast
                if (isLearningTheme && choiceOne.pairId) {
                    const themeData = ALL_THEMES[theme];
                    const pair = themeData.pairs.find(p => p.pairId === choiceOne.pairId);
                    if (pair) {
                        // Show feedback toast
                        setMatchFeedback({
                            pairId: pair.pairId,
                            cardA: pair.cardA,
                            cardB: pair.cardB,
                        });
                        setTimeout(() => setMatchFeedback(null), 2500);

                        // Speak the word(s)
                        if (pair.cardA.lang === "en" && pair.cardB.lang === "id") {
                            // EN-ID: speak English, then Indonesian after a delay
                            speak(pair.cardA.src, "en-US");
                            setTimeout(() => speak(pair.cardB.src, "id-ID"), 1200);
                        } else {
                            // Word-Picture / Spelling: speak the English word
                            const textCard = pair.cardA.type === "text" ? pair.cardA : pair.cardB.type === "text" ? pair.cardB : null;
                            speak(textCard ? textCard.src : pair.pairId);
                        }
                    }
                }

                resetTurn(true);
            } else {
                playWrongSound();
                setTimeout(() => resetTurn(false), 1000);
            }
        }
    }, [choiceOne, choiceTwo]);

    const resetTurn = (matched) => {
        setChoiceOne(null);
        setChoiceTwo(null);
        setTurns((prevTurns) => prevTurns + 1);
        setDisabled(false);
        if (!matched) {
            setCurrentPlayerIndex((prev) => (prev + 1) % playerNames.length);
        }
        startTurnTimer();
    };

    const [isNewBest, setIsNewBest] = useState(false);
    useEffect(() => {
        if (cards.length > 0 && cards.every((card) => card.matched)) {
            stopTimer();
            stopTurnTimer();
            clearSavedGame();
            const newBest = saveBestScore(elapsedTime, turns, difficulty);
            setIsNewBest(newBest);
            setGameState("finished");
        }
    }, [cards]);

    const addPlayer = () => {
        if (playerNames.length < MAX_PLAYERS) {
            setPlayerNames([...playerNames, `Player ${playerNames.length + 1}`]);
        }
    };

    const removePlayer = (index) => {
        if (playerNames.length > 1) {
            setPlayerNames(playerNames.filter((_, i) => i !== index));
        }
    };

    const updatePlayerName = (index, name) => {
        const newNames = [...playerNames];
        newNames[index] = name;
        setPlayerNames(newNames);
    };

    const formatTime = (ms) => {
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // ─── SETUP SCREEN ───
    if (gameState === "setup") {
        return (
            <div className="flex items-center justify-center w-full min-h-screen p-4 bg-gradient-to-b from-sky-200 via-green-100 to-yellow-100 dark:from-gray-900 dark:via-gray-850 dark:to-gray-800">
                {/* Decorative elements */}
                <div className="fixed top-6 left-8 text-4xl opacity-50 animate-wiggle hidden sm:block">🌻</div>
                <div className="fixed top-20 right-12 text-3xl opacity-40 hidden sm:block">🐝</div>
                <div className="fixed bottom-16 left-16 text-3xl opacity-40 hidden sm:block">🌿</div>
                <div className="fixed bottom-10 right-20 text-4xl opacity-50 hidden sm:block">🐞</div>

                <div className="w-full max-w-lg bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-3xl shadow-2xl shadow-amber-900/10 p-8 sm:p-10 space-y-7 border-2 border-amber-200/60 dark:border-amber-800/30">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="text-5xl mb-2">🌻</div>
                        <h2 className="text-4xl font-extrabold text-amber-800 dark:text-amber-200">
                            FlipMatch
                        </h2>
                        <p className="text-amber-600/70 dark:text-amber-400/70 text-sm font-medium">Match the pairs and have fun!</p>
                    </div>

                    {/* Difficulty Selection */}
                    <div className="space-y-2.5">
                        <label className="block text-xs font-bold text-amber-700/60 dark:text-amber-400/60 uppercase tracking-wider">
                            Difficulty
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.entries(DIFFICULTIES).map(([diff, config]) => (
                                <button
                                    key={diff}
                                    onClick={() => setDifficulty(diff)}
                                    className={`relative py-3 px-3 rounded-xl font-bold transition-all duration-200 ${difficulty === diff
                                        ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/25 scale-105 ring-2 ring-green-400/50 ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                                        : "bg-amber-50 dark:bg-gray-700/50 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-gray-700 border border-amber-200 dark:border-gray-600"
                                        }`}
                                >
                                    <div className="text-sm">{diff}</div>
                                    <div className={`text-xs mt-0.5 ${difficulty === diff ? 'text-green-100' : 'text-amber-500 dark:text-amber-400'}`}>
                                        {config.pairs} pairs
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Turn Timer Setting */}
                    <div className="space-y-2.5">
                        <label className="block text-xs font-bold text-amber-700/60 dark:text-amber-400/60 uppercase tracking-wider">
                            Turn Timer
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-amber-50/50 dark:bg-gray-700/40 rounded-xl border border-amber-200/50 dark:border-gray-600/30">
                            <button
                                onClick={() => setTurnTimerEnabled(!turnTimerEnabled)}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${turnTimerEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${turnTimerEnabled ? 'translate-x-5' : ''}`} />
                            </button>
                            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                {turnTimerEnabled ? 'On' : 'Off'}
                            </span>
                            {turnTimerEnabled && (
                                <div className="flex items-center gap-2 ml-auto">
                                    <button
                                        onClick={() => setTurnTimerSeconds(Math.max(5, turnTimerSeconds - 5))}
                                        className="w-8 h-8 rounded-lg bg-amber-200 dark:bg-gray-600 text-amber-800 dark:text-amber-200 font-bold text-lg flex items-center justify-center hover:bg-amber-300 dark:hover:bg-gray-500 transition-colors"
                                    >
                                        -
                                    </button>
                                    <div className="flex items-center gap-1 min-w-[60px] justify-center">
                                        <span className="text-lg font-bold text-amber-800 dark:text-amber-200 tabular-nums">{turnTimerSeconds}</span>
                                        <span className="text-xs text-amber-600 dark:text-amber-400">sec</span>
                                    </div>
                                    <button
                                        onClick={() => setTurnTimerSeconds(Math.min(120, turnTimerSeconds + 5))}
                                        className="w-8 h-8 rounded-lg bg-amber-200 dark:bg-gray-600 text-amber-800 dark:text-amber-200 font-bold text-lg flex items-center justify-center hover:bg-amber-300 dark:hover:bg-gray-500 transition-colors"
                                    >
                                        +
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sound Setting */}
                    <div className="space-y-2.5">
                        <label className="block text-xs font-bold text-amber-700/60 dark:text-amber-400/60 uppercase tracking-wider">
                            Sound Effects
                        </label>
                        <div className="flex items-center gap-3 p-3 bg-amber-50/50 dark:bg-gray-700/40 rounded-xl border border-amber-200/50 dark:border-gray-600/30">
                            <button
                                onClick={() => {
                                    const newVal = !soundEnabled;
                                    setSoundEnabledState(newVal);
                                    setSoundEnabled(newVal);
                                    try { localStorage.setItem('flipmatch-sound-enabled', String(newVal)); } catch { /* ignore */ }
                                    if (newVal) playFlipSound();
                                }}
                                className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${soundEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                            >
                                <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${soundEnabled ? 'translate-x-5' : ''}`} />
                            </button>
                            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
                                {soundEnabled ? 'On' : 'Off'}
                            </span>
                            <span className="ml-auto text-lg">{soundEnabled ? '🔊' : '🔇'}</span>
                        </div>
                    </div>

                    {/* Theme Selection */}
                    <div className="space-y-2.5">
                        <label className="block text-xs font-bold text-amber-700/60 dark:text-amber-400/60 uppercase tracking-wider">
                            Classic Themes
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {Object.entries(THEMES).map(([key, themeData]) => (
                                <button
                                    key={key}
                                    onClick={() => setTheme(key)}
                                    className={`relative py-3 px-2 rounded-xl font-bold transition-all duration-200 ${theme === key
                                        ? "bg-gradient-to-br from-orange-400 to-amber-500 text-white shadow-lg shadow-orange-400/25 scale-105 ring-2 ring-orange-300/50 ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                                        : "bg-amber-50 dark:bg-gray-700/50 text-amber-800 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-gray-700 border border-amber-200 dark:border-gray-600"
                                        }`}
                                >
                                    <div className="text-2xl mb-0.5">{themeData.icon}</div>
                                    <div className={`text-xs ${theme === key ? 'text-orange-100' : 'text-amber-500 dark:text-amber-400'}`}>
                                        {themeData.name}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <label className="block text-xs font-bold text-sky-700/60 dark:text-sky-400/60 uppercase tracking-wider mt-4">
                            Learn English
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {Object.entries(LEARNING_THEMES).map(([key, themeData]) => (
                                <button
                                    key={key}
                                    onClick={() => setTheme(key)}
                                    className={`relative py-3 px-2 rounded-xl font-bold transition-all duration-200 ${theme === key
                                        ? "bg-gradient-to-br from-sky-400 to-blue-500 text-white shadow-lg shadow-sky-400/25 scale-105 ring-2 ring-sky-300/50 ring-offset-2 ring-offset-white dark:ring-offset-gray-800"
                                        : "bg-sky-50 dark:bg-gray-700/50 text-sky-800 dark:text-sky-200 hover:bg-sky-100 dark:hover:bg-gray-700 border border-sky-200 dark:border-gray-600"
                                        }`}
                                >
                                    <div className="text-2xl mb-0.5">{themeData.icon}</div>
                                    <div className={`text-xs ${theme === key ? 'text-sky-100' : 'text-sky-500 dark:text-sky-400'}`}>
                                        {themeData.name}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Player Setup */}
                    <div className="space-y-2.5">
                        <div className="flex justify-between items-center">
                            <label className="block text-xs font-bold text-amber-700/60 dark:text-amber-400/60 uppercase tracking-wider">
                                Players ({playerNames.length}/{MAX_PLAYERS})
                            </label>
                            <button
                                onClick={addPlayer}
                                disabled={playerNames.length >= MAX_PLAYERS}
                                className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                                </svg>
                                Add
                            </button>
                        </div>

                        <div className="space-y-2 max-h-56 overflow-y-auto">
                            {playerNames.map((name, index) => (
                                <div
                                    key={index}
                                    className="group flex items-center gap-2.5 p-3 bg-amber-50/50 dark:bg-gray-700/40 rounded-xl border border-amber-200/50 dark:border-gray-600/30 hover:border-green-300 dark:hover:border-green-500/30 transition-colors"
                                >
                                    <div className={`flex-shrink-0 w-8 h-8 rounded-full ${PLAYER_COLORS[index % PLAYER_COLORS.length].bg} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                                        {index + 1}
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => updatePlayerName(index, e.target.value)}
                                        className="flex-1 px-3 py-1.5 rounded-lg bg-white dark:bg-gray-800 border border-amber-200 dark:border-gray-600 focus:border-green-500 dark:focus:border-green-400 outline-none text-sm font-medium transition-colors text-amber-900 dark:text-amber-100"
                                        placeholder={`Player ${index + 1}`}
                                        maxLength={20}
                                    />
                                    {playerNames.length > 1 && (
                                        <button
                                            onClick={() => removePlayer(index)}
                                            className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Best Score Display */}
                    {bestScore && bestScore[`${theme}-${difficulty}-${playerNames.length}p`] && (
                        <div className="flex items-center gap-2 px-4 py-2.5 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-300/50 dark:border-yellow-800/30 rounded-xl">
                            <span className="text-sm">⭐</span>
                            <span className="text-amber-700 dark:text-amber-300 text-sm font-medium">
                                Best: {bestScore[`${theme}-${difficulty}-${playerNames.length}p`].moves} moves in {formatTime(bestScore[`${theme}-${difficulty}-${playerNames.length}p`].time)}
                            </span>
                        </div>
                    )}

                    {/* Start Game Button */}
                    <button
                        onClick={startGame}
                        className="w-full py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-2xl font-bold text-lg shadow-xl shadow-green-600/25 hover:shadow-2xl hover:shadow-green-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 border border-green-400/30"
                    >
                        <span>Let&apos;s Play!</span>
                        <span className="text-xl">🎮</span>
                    </button>
                </div>
            </div>
        );
    }

    // Grid columns and rows for fitting to screen
    const cols = DIFFICULTIES[difficulty].cols;
    const totalCards = DIFFICULTIES[difficulty].pairs * 2;
    const rows = Math.ceil(totalCards / cols);
    const gridColsClass = {
        4: "grid-cols-3 sm:grid-cols-4",
        6: "grid-cols-4 sm:grid-cols-6",
        8: "grid-cols-4 sm:grid-cols-6 md:grid-cols-8",
    }[cols];

    const matchedCount = cards.filter(c => c.matched).length / 2;
    const totalPairs = DIFFICULTIES[difficulty].pairs;
    const progress = totalPairs > 0 ? (matchedCount / totalPairs) * 100 : 0;

    // ─── PLAYING SCREEN ───
    return (
        <div className="flex flex-col items-center w-full h-screen max-h-screen overflow-hidden bg-gradient-to-b from-sky-100 via-green-50 to-yellow-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            {/* Header */}
            <header className="w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b-2 border-amber-200/50 dark:border-gray-700/50 shrink-0 z-10">
                {/* Progress bar */}
                <div className="h-1.5 bg-amber-100 dark:bg-gray-800">
                    <div
                        className="h-full bg-gradient-to-r from-green-400 via-emerald-500 to-teal-500 transition-all duration-500 ease-out rounded-r-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5">
                    <div className="flex items-center justify-between gap-3">
                        {/* Left: Title + Stats */}
                        <div className="flex items-center gap-3 min-w-0">
                            <h1 className="text-lg sm:text-xl font-extrabold text-amber-800 dark:text-amber-200 whitespace-nowrap">
                                FlipMatch
                            </h1>

                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 dark:bg-amber-900/20 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
                                    <span className="text-xs">⏱️</span>
                                    <span className="text-xs font-bold text-amber-800 dark:text-amber-200 tabular-nums">{formatTime(elapsedTime)}</span>
                                </div>
                                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 dark:bg-green-900/20 rounded-lg border border-green-200/50 dark:border-green-800/30">
                                    <span className="text-xs font-bold text-green-700 dark:text-green-300 tabular-nums">{matchedCount}/{totalPairs}</span>
                                </div>
                                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-orange-100 dark:bg-orange-900/20 rounded-lg border border-orange-200/50 dark:border-orange-800/30">
                                    <span className="text-xs font-bold text-orange-700 dark:text-orange-300 tabular-nums">{turns} moves</span>
                                </div>
                                {turnTimerEnabled && turnTimeLeft !== null && (
                                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors ${turnTimeLeft <= 5
                                        ? 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-800/50 animate-pulse'
                                        : turnTimeLeft <= 10
                                            ? 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800/30'
                                            : 'bg-blue-100 dark:bg-blue-900/20 border-blue-200/50 dark:border-blue-800/30'
                                    }`}>
                                        <span className="text-xs">⏳</span>
                                        <span className={`text-xs font-bold tabular-nums ${turnTimeLeft <= 5
                                            ? 'text-red-700 dark:text-red-300'
                                            : turnTimeLeft <= 10
                                                ? 'text-yellow-700 dark:text-yellow-300'
                                                : 'text-blue-700 dark:text-blue-300'
                                        }`}>{turnTimeLeft}s</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Controls */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={restartGame}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-green-700 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all"
                                title="Restart game"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                                <span className="hidden sm:inline">Restart</span>
                            </button>
                            <button
                                onClick={goToSetup}
                                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 hover:text-orange-700 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-all"
                                title="Back to setup"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span className="hidden sm:inline">Settings</span>
                            </button>
                        </div>
                    </div>

                    {/* Player Scoreboard */}
                    {playerNames.length > 1 && (
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                            {playerNames.map((name, index) => {
                                const color = PLAYER_COLORS[index % PLAYER_COLORS.length];
                                const isActive = index === currentPlayerIndex;
                                return (
                                    <div
                                        key={index}
                                        className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition-all duration-300 border ${isActive
                                            ? `${color.bg} border-white/30 shadow-md text-white`
                                            : `bg-white/80 dark:bg-gray-800 ${color.border} dark:border-gray-700 opacity-50`
                                            }`}
                                    >
                                        <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive
                                            ? "bg-white/25 text-white"
                                            : `${color.bg} text-white`
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <span className={`text-xs font-medium truncate max-w-[60px] ${isActive ? "text-white" : `${color.text} dark:text-gray-300`}`}>
                                            {name}
                                        </span>
                                        <span className={`text-xs font-black ${isActive ? "text-white" : "text-gray-800 dark:text-white"}`}>
                                            {scores[index]}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </header>

            {/* Game Grid */}
            <div className="flex-1 w-full flex items-center justify-center p-2 sm:p-4 overflow-hidden">
                <div
                    className={`grid ${gridColsClass} gap-1 sm:gap-2 w-full h-full max-w-5xl`}
                    style={{ gridTemplateRows: `repeat(${rows}, 1fr)` }}
                >
                    {cards.map((card, index) => {
                        const row = Math.floor(index / cols);
                        const col = index % cols;
                        const label = `${String.fromCharCode(65 + row)}${col + 1}`;
                        return (
                        <Card
                            key={card.id}
                            card={card}
                            cardNumber={label}
                            handleChoice={handleChoice}
                            flipped={card === choiceOne || card === choiceTwo || card.matched}
                            disabled={disabled}
                            onClueClick={(c) => setClueDrawer(c.src)}
                        />
                        );
                    })}
                </div>
            </div>

            {/* Match Feedback Toast */}
            {matchFeedback && (
                <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-toastIn">
                    <div className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-green-300 dark:border-green-700">
                        <span className="text-2xl">{matchFeedback.cardA.type === "emoji" ? matchFeedback.cardA.src : matchFeedback.cardB.type === "emoji" ? matchFeedback.cardB.src : "✅"}</span>
                        <div className="text-sm font-bold text-green-700 dark:text-green-300">
                            {matchFeedback.cardA.src} = {matchFeedback.cardB.src}
                        </div>
                        <span className="text-lg">🔊</span>
                    </div>
                </div>
            )}

            {/* Floating Turn Timer (visible above drawer) */}
            {clueDrawer && turnTimerEnabled && turnTimeLeft !== null && (
                <div className="fixed top-4 right-4 z-[60] animate-fadeIn">
                    <div className={`flex items-center gap-2 px-5 py-3 rounded-2xl border-2 shadow-2xl transition-colors ${turnTimeLeft <= 5
                        ? 'bg-red-100 dark:bg-red-900/90 border-red-400 dark:border-red-600 animate-pulse'
                        : turnTimeLeft <= 10
                            ? 'bg-yellow-100 dark:bg-yellow-900/90 border-yellow-400 dark:border-yellow-600'
                            : 'bg-blue-100 dark:bg-blue-900/90 border-blue-300 dark:border-blue-600'
                    }`}>
                        <span className="text-2xl">⏳</span>
                        <span className={`text-2xl font-extrabold tabular-nums ${turnTimeLeft <= 5
                            ? 'text-red-700 dark:text-red-300'
                            : turnTimeLeft <= 10
                                ? 'text-yellow-700 dark:text-yellow-300'
                                : 'text-blue-700 dark:text-blue-300'
                        }`}>{turnTimeLeft}s</span>
                    </div>
                </div>
            )}

            {/* Clue Drawer */}
            {clueDrawer && (
                <div
                    className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setClueDrawer(null)}
                >
                    <div
                        className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-t-3xl shadow-2xl border-t-2 border-orange-300 dark:border-orange-700 animate-drawerUp"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full" />
                        </div>
                        <div className="px-6 pb-8 pt-2">
                            <p className="text-base sm:text-lg md:text-xl leading-relaxed text-orange-800 dark:text-orange-200 font-medium italic text-center">
                                {clueDrawer}
                            </p>
                            <button
                                onClick={() => setClueDrawer(null)}
                                className="mt-5 w-full py-3 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-xl font-bold text-sm hover:bg-orange-200 dark:hover:bg-orange-900/50 transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Win Screen Modal */}
            {gameState === "finished" && (
                <>
                    <Confetti />
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4 animate-fadeIn">
                        <div className="bg-gradient-to-b from-white to-amber-50 dark:from-gray-800 dark:to-gray-800 p-8 rounded-3xl shadow-2xl text-center max-w-md w-full animate-scaleIn border-2 border-amber-200 dark:border-amber-800/30">
                            <div className="text-6xl mb-3">
                                {playerNames.length > 1 ? '🏆' : '🎉'}
                            </div>
                            <h2 className="text-3xl font-extrabold mb-1 text-amber-800 dark:text-amber-200">
                                {playerNames.length > 1 ? 'Game Over!' : 'Well Done!'}
                            </h2>

                            {isNewBest && (
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-bold mt-1 mb-3 animate-bounce border border-yellow-300 dark:border-yellow-700">
                                    ⭐ New Best Score!
                                </div>
                            )}

                            {/* Game Stats */}
                            <div className="flex justify-center gap-3 my-5">
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-100 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/30">
                                    <span className="text-sm">⏱️</span>
                                    <span className="text-sm font-bold text-amber-800 dark:text-amber-200">{formatTime(elapsedTime)}</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2.5 bg-green-100 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800/30">
                                    <span className="text-sm font-bold text-green-700 dark:text-green-300">{turns} moves</span>
                                </div>
                            </div>

                            {/* Player Rankings */}
                            <div className="space-y-1.5 mb-6 max-h-60 overflow-y-auto">
                                {playerNames
                                    .map((name, i) => ({ name, score: scores[i], originalIndex: i }))
                                    .sort((a, b) => b.score - a.score)
                                    .map((player, i) => (
                                        <div key={i} className={`flex justify-between items-center p-3 rounded-xl transition-all ${i === 0
                                            ? 'bg-gradient-to-r from-yellow-100 to-amber-100 dark:from-yellow-900/20 dark:to-amber-900/10 ring-2 ring-yellow-400/50 dark:ring-yellow-600/50'
                                            : 'bg-amber-50/50 dark:bg-gray-700/30 border border-amber-100 dark:border-gray-700'}`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                {i === 0 && <span className="text-xl">👑</span>}
                                                <div className={`w-5 h-5 rounded-full ${PLAYER_COLORS[player.originalIndex % PLAYER_COLORS.length].bg} flex items-center justify-center`}>
                                                    <span className="text-[10px] font-bold text-white">{player.originalIndex + 1}</span>
                                                </div>
                                                <span className={`text-sm font-semibold ${i === 0 ? 'text-amber-900 dark:text-amber-100' : 'text-amber-700 dark:text-gray-300'}`}>{player.name}</span>
                                            </div>
                                            <span className={`text-sm font-bold ${i === 0 ? 'text-amber-700 dark:text-amber-300' : 'text-amber-500 dark:text-gray-400'}`}>{player.score} pairs</span>
                                        </div>
                                    ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={goToSetup}
                                    className="flex-1 py-3 px-6 bg-amber-100 dark:bg-gray-700 text-amber-800 dark:text-amber-200 rounded-xl font-bold text-sm hover:bg-amber-200 dark:hover:bg-gray-600 transition-colors border border-amber-200 dark:border-gray-600"
                                >
                                    New Setup
                                </button>
                                <button
                                    onClick={restartGame}
                                    className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold text-sm hover:scale-[1.03] active:scale-[0.97] transition-all shadow-lg shadow-green-600/25 border border-green-400/30"
                                >
                                    Play Again 🎮
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
