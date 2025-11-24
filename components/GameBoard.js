"use client";

import { useState, useEffect } from "react";
import Card from "./Card";

// Expanded card images for Hard mode (24 pairs needed)
const allCardImages = [
    { src: "🐶", matched: false }, { src: "🐱", matched: false }, { src: "🐭", matched: false }, { src: "🐹", matched: false },
    { src: "🐰", matched: false }, { src: "🦊", matched: false }, { src: "🐻", matched: false }, { src: "🐼", matched: false },
    { src: "🐨", matched: false }, { src: "🐯", matched: false }, { src: "🦁", matched: false }, { src: "🐮", matched: false },
    { src: "🐷", matched: false }, { src: "🐸", matched: false }, { src: "🐵", matched: false }, { src: "🐔", matched: false },
    { src: "🐧", matched: false }, { src: "🐦", matched: false }, { src: "🐤", matched: false }, { src: "🦆", matched: false },
    { src: "🦅", matched: false }, { src: "🦉", matched: false }, { src: "🦇", matched: false }, { src: "🐺", matched: false },
];

const DIFFICULTIES = {
    Easy: { pairs: 6, cols: 4 },
    Medium: { pairs: 12, cols: 6 },
    Hard: { pairs: 24, cols: 8 },
};

export default function GameBoard() {
    const [gameState, setGameState] = useState("setup"); // setup, playing, finished
    const [cards, setCards] = useState([]);
    const [turns, setTurns] = useState(0);
    const [choiceOne, setChoiceOne] = useState(null);
    const [choiceTwo, setChoiceTwo] = useState(null);
    const [disabled, setDisabled] = useState(false);

    // Setup State
    const [difficulty, setDifficulty] = useState("Easy");
    const [playerNames, setPlayerNames] = useState(["Player 1", "Player 2"]);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
    const [scores, setScores] = useState([0, 0]);

    // Start Game
    const startGame = () => {
        // Randomize player order
        const shuffledPlayerIndices = playerNames.map((_, i) => i).sort(() => Math.random() - 0.5);
        // For simplicity, just pick a random start, but keep array order for UI? 
        // Actually user asked to "random user turns... and loop". 
        // Let's just randomize who starts, then follow the list order.
        setCurrentPlayerIndex(Math.floor(Math.random() * playerNames.length));
        setScores(new Array(playerNames.length).fill(0));

        shuffleCards();
        setGameState("playing");
    };

    // Shuffle Cards based on difficulty
    const shuffleCards = () => {
        const numPairs = DIFFICULTIES[difficulty].pairs;
        const selectedImages = allCardImages.slice(0, numPairs);
        const shuffledCards = [...selectedImages, ...selectedImages]
            .sort(() => Math.random() - 0.5)
            .map((card) => ({ ...card, id: Math.random() }));

        setChoiceOne(null);
        setChoiceTwo(null);
        setCards(shuffledCards);
        setTurns(0);
        setDisabled(false);
    };

    // Handle a choice
    const handleChoice = (card) => {
        choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
    };

    // Compare 2 selected cards
    useEffect(() => {
        if (choiceOne && choiceTwo) {
            setDisabled(true);
            if (choiceOne.src === choiceTwo.src) {
                setCards((prevCards) => {
                    return prevCards.map((card) => {
                        if (card.src === choiceOne.src) {
                            return { ...card, matched: true };
                        } else {
                            return card;
                        }
                    });
                });

                // Update score for current player
                setScores(prev => {
                    const newScores = [...prev];
                    newScores[currentPlayerIndex] += 1;
                    return newScores;
                });

                resetTurn(true); // Match found, keep turn
            } else {
                setTimeout(() => resetTurn(false), 1000); // No match, next turn
            }
        }
    }, [choiceOne, choiceTwo]);

    // Reset choices & handle turn switching
    const resetTurn = (matched) => {
        setChoiceOne(null);
        setChoiceTwo(null);
        setTurns((prevTurns) => prevTurns + 1);
        setDisabled(false);

        if (!matched) {
            setCurrentPlayerIndex((prev) => (prev + 1) % playerNames.length);
        }
    };

    // Check for win
    useEffect(() => {
        if (cards.length > 0 && cards.every((card) => card.matched)) {
            setGameState("finished");
        }
    }, [cards]);

    // Setup Handlers
    const addPlayer = () => {
        if (playerNames.length < 4) {
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

    if (gameState === "setup") {
        return (
            <div className="flex items-center justify-center w-full h-full p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
                <div className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 space-y-8 border border-gray-100 dark:border-gray-700">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Setup Your Game
                        </h2>
                        <p className="text-gray-500 dark:text-gray-400">Choose difficulty and add players</p>
                    </div>

                    {/* Difficulty Selection */}
                    <div className="space-y-3">
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                            Difficulty Level
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                            {Object.entries(DIFFICULTIES).map(([diff, config]) => (
                                <button
                                    key={diff}
                                    onClick={() => setDifficulty(diff)}
                                    className={`relative py-4 px-4 rounded-2xl font-bold transition-all duration-200 ${difficulty === diff
                                        ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-105 ring-2 ring-blue-400 ring-offset-2"
                                        : "bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:scale-102"
                                        }`}
                                >
                                    <div className="text-lg">{diff}</div>
                                    <div className={`text-xs mt-1 ${difficulty === diff ? 'text-blue-100' : 'text-gray-400'}`}>
                                        {config.pairs} pairs
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Player Setup */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
                                Players ({playerNames.length}/4)
                            </label>
                            <button
                                onClick={addPlayer}
                                disabled={playerNames.length >= 4}
                                className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="text-lg">+</span>
                                Add Player
                            </button>
                        </div>

                        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                            {playerNames.map((name, index) => (
                                <div
                                    key={index}
                                    className="group flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-50/50 dark:from-gray-700/50 dark:to-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all"
                                >
                                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold shadow-md">
                                        {index + 1}
                                    </div>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => updatePlayerName(index, e.target.value)}
                                        className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border-2 border-transparent focus:border-blue-500 dark:focus:border-blue-400 outline-none font-medium transition-colors"
                                        placeholder={`Player ${index + 1}`}
                                    />
                                    {playerNames.length > 1 && (
                                        <button
                                            onClick={() => removePlayer(index)}
                                            className="flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Start Game Button */}
                    <button
                        onClick={startGame}
                        className="w-full py-4 bg-gradient-to-r from-blue-500 via-purple-500 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <span>Start Game</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>
        );
    }

    // Determine grid columns style
    const gridColsClass = {
        4: "grid-cols-4",
        6: "grid-cols-4 sm:grid-cols-6",
        8: "grid-cols-6 sm:grid-cols-8",
    }[DIFFICULTIES[difficulty].cols];

    return (
        <div className="flex flex-col items-center w-full h-screen max-h-screen overflow-hidden">
            {/* Compact Header */}
            <header className="w-full bg-gradient-to-r from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm shrink-0">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between gap-6">
                        {/* Left: Title and Setup */}
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Memo Dami
                            </h1>
                            <button
                                onClick={() => setGameState("setup")}
                                className="hidden sm:flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Settings
                            </button>
                        </div>

                        {/* Center: Player Scores */}
                        <div className="flex gap-3 overflow-x-auto no-scrollbar">
                            {playerNames.map((name, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 border-2 ${index === currentPlayerIndex
                                        ? "bg-gradient-to-br from-blue-500 to-purple-600 border-blue-400 shadow-lg scale-105"
                                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60"
                                        }`}
                                >
                                    <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${index === currentPlayerIndex
                                        ? "bg-white/20 text-white"
                                        : "bg-gradient-to-br from-blue-400 to-purple-500 text-white"
                                        }`}>
                                        {index + 1}
                                    </div>
                                    <div className="flex flex-col items-start min-w-[60px]">
                                        <span className={`text-xs font-medium truncate max-w-[100px] ${index === currentPlayerIndex ? "text-white" : "text-gray-600 dark:text-gray-400"
                                            }`}>
                                            {name}
                                        </span>
                                        <span className={`text-lg font-black leading-none ${index === currentPlayerIndex ? "text-white" : "text-gray-900 dark:text-white"
                                            }`}>
                                            {scores[index]}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Right: Mobile Settings */}
                        <button
                            onClick={() => setGameState("setup")}
                            className="sm:hidden flex items-center justify-center w-9 h-9 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </header >

            {/* Game Grid Container - Scrollable if needed, but trying to fit */}
            < div className="flex-1 w-full flex items-center justify-center p-4 overflow-y-auto" >
                <div className={`grid ${gridColsClass} gap-1 sm:gap-2 w-full max-w-4xl aspect-square sm:aspect-auto`}>
                    {cards.map((card) => (
                        <Card
                            key={card.id}
                            card={card}
                            handleChoice={handleChoice}
                            flipped={card === choiceOne || card === choiceTwo || card.matched}
                            disabled={disabled}
                        />
                    ))}
                </div>
            </div >

            {/* Win Screen Modal */}
            {
                gameState === "finished" && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl text-center max-w-md w-full animate-in zoom-in duration-300">
                            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                Game Over!
                            </h2>

                            <div className="space-y-4 mb-8">
                                {playerNames
                                    .map((name, i) => ({ name, score: scores[i] }))
                                    .sort((a, b) => b.score - a.score)
                                    .map((player, i) => (
                                        <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                                            <div className="flex items-center gap-3">
                                                <span className="font-bold text-gray-400">#{i + 1}</span>
                                                <span className="font-semibold">{player.name}</span>
                                            </div>
                                            <span className="font-bold text-xl">{player.score} pairs</span>
                                        </div>
                                    ))}
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => setGameState("setup")}
                                    className="flex-1 py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                    Setup New Game
                                </button>
                                <button
                                    onClick={startGame}
                                    className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
                                >
                                    Rematch
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
