"use client";

/* eslint-disable @next/next/no-img-element */
export default function Card({ card, cardNumber, showCardNumbers, showNames, emojiLabel, handleChoice, flipped, disabled, onClueClick, streakCount }) {
    const handleClick = () => {
        if (flipped && card.type === "clue" && onClueClick) {
            onClueClick(card);
            return;
        }
        if (!disabled && !flipped) {
            handleChoice(card);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
        }
    };

    const cardType = card.type || "emoji";

    const renderContent = () => {
        if (cardType === "emoji") {
            return (
                <div className="flex flex-col items-center justify-center gap-0.5">
                    <span className={`select-none drop-shadow-sm ${showNames && emojiLabel ? 'text-4xl sm:text-5xl md:text-6xl' : 'text-5xl sm:text-6xl md:text-7xl'}`}>{card.src}</span>
                    {showNames && emojiLabel && (
                        <span className="text-[9px] sm:text-[11px] font-semibold text-amber-700 dark:text-amber-300 select-none leading-tight text-center truncate max-w-full px-1">{emojiLabel}</span>
                    )}
                </div>
            );
        }
        if (cardType === "clue") {
            return (
                <div className="flex flex-col items-center justify-center px-1.5 py-0.5 w-full h-full overflow-hidden gap-0.5">
                    <span className="text-[9px] sm:text-[11px] md:text-[13px] font-medium italic text-orange-700 dark:text-orange-300 select-none leading-snug text-center line-clamp-3 sm:line-clamp-4">{card.src}</span>
                    <span className="text-[9px] sm:text-[11px] text-orange-500 dark:text-orange-400 opacity-70 select-none">tap to read</span>
                </div>
            );
        }
        if (cardType === "scrambled") {
            return (
                <div className="flex flex-col items-center gap-0.5 px-1">
                    <span className="text-sm sm:text-base font-bold text-purple-500 dark:text-purple-400 tracking-widest font-mono select-none">{card.src}</span>
                    {card.lang && <span className="text-[10px] opacity-60">{card.lang === "en" ? "🇬🇧" : "🇮🇩"}</span>}
                </div>
            );
        }
        // type === "text"
        return (
            <div className="flex flex-col items-center gap-0.5 px-1">
                <span className="text-base sm:text-lg md:text-xl font-bold select-none leading-tight text-center">{card.src}</span>
                {card.lang && <span className="text-[10px] opacity-60">{card.lang === "en" ? "🇬🇧" : "🇮🇩"}</span>}
            </div>
        );
    };

    const frontBg = () => {
        if (card.matched) return 'bg-green-50 dark:bg-green-900/30 border-green-400 dark:border-green-600 shadow-green-200/50';
        if (cardType === "clue") return 'bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-700';
        if (cardType === "text") return 'bg-sky-50 dark:bg-sky-900/20 border-sky-300 dark:border-sky-700';
        if (cardType === "scrambled") return 'bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-700';
        return 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700';
    };

    // Determine glow class based on streak
    const glowClass = card.matched && streakCount >= 2
        ? streakCount >= 5
            ? 'streak-glow-epic'
            : streakCount >= 3
                ? 'streak-glow-hot'
                : 'streak-glow'
        : '';

    return (
        <div
            className={`relative w-full h-full min-h-0 cursor-pointer group perspective-1000 ${card.matched ? 'matched-card' : ''} ${glowClass}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={flipped || disabled ? -1 : 0}
            role="button"
            aria-label={flipped ? `Card: ${card.src}` : "Hidden card"}
        >
            <div
                className={`card-inner relative w-full h-full transform-style-3d transition-transform ${flipped ? "rotate-y-180" : ""}`}
            >
                {/* Front of card (content side) */}
                <div className={`absolute w-full h-full border-2 rounded-xl sm:rounded-2xl flex items-center justify-center backface-hidden rotate-y-180 shadow-md ${frontBg()}`}>
                    {renderContent()}
                </div>

                {/* Back of card (hidden side) */}
                <div className="card-back absolute w-full h-full rounded-xl sm:rounded-2xl backface-hidden shadow-md flex items-center justify-center border-2 border-blue-700/40 group-hover:scale-[1.03] group-hover:shadow-lg group-hover:brightness-110 group-focus:scale-[1.03] group-focus:shadow-lg group-focus:ring-2 group-focus:ring-blue-400 transition-all duration-200">
                    {showCardNumbers ? (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/25 flex items-center justify-center border border-white/20">
                            <span className="text-white text-sm sm:text-lg font-bold drop-shadow-sm tabular-nums">{cardNumber}</span>
                        </div>
                    ) : (
                        <img
                            src="/logo-with-background.jpeg"
                            alt="Memo Sprout"
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover shadow-sm"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
