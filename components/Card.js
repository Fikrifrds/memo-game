"use client";

export default function Card({ card, handleChoice, flipped, disabled }) {
    const handleClick = () => {
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

    return (
        <div
            className={`relative w-full h-full min-h-0 cursor-pointer group perspective-1000 ${card.matched ? 'matched-card' : ''}`}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            tabIndex={flipped || disabled ? -1 : 0}
            role="button"
            aria-label={flipped ? `Card: ${card.src}` : "Hidden card"}
        >
            <div
                className={`relative w-full h-full duration-500 transform-style-3d transition-all ${flipped ? "rotate-y-180" : ""}`}
            >
                {/* Front of card (emoji side) */}
                <div className={`absolute w-full h-full border-2 rounded-xl sm:rounded-2xl flex items-center justify-center backface-hidden rotate-y-180 shadow-md ${card.matched
                    ? 'bg-green-50 dark:bg-green-900/30 border-green-400 dark:border-green-600 shadow-green-200/50'
                    : 'bg-amber-50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700'}`}
                >
                    <span className="text-2xl sm:text-3xl md:text-4xl select-none drop-shadow-sm">{card.src}</span>
                </div>

                {/* Back of card (hidden side) */}
                <div className="card-back absolute w-full h-full rounded-xl sm:rounded-2xl backface-hidden shadow-md flex items-center justify-center border-2 border-green-700/40 group-hover:scale-[1.03] group-hover:shadow-lg group-hover:brightness-110 group-focus:scale-[1.03] group-focus:shadow-lg group-focus:ring-2 group-focus:ring-yellow-400 transition-all duration-200">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/25 flex items-center justify-center border border-white/20">
                        <span className="text-white text-sm sm:text-lg font-bold drop-shadow-sm">?</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
