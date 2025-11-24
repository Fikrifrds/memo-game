"use client";

export default function Card({ card, handleChoice, flipped, disabled }) {
    const handleClick = () => {
        if (!disabled) {
            handleChoice(card);
        }
    };

    return (
        <div className="relative w-24 h-32 cursor-pointer group perspective-1000" onClick={handleClick}>
            <div
                className={`relative w-full h-full duration-500 transform-style-3d transition-all ${flipped ? "rotate-y-180" : ""
                    }`}
            >
                {/* Front of card (hidden when not flipped) */}
                <div className="absolute w-full h-full bg-white border-2 border-blue-300 rounded-xl flex items-center justify-center text-4xl backface-hidden rotate-y-180 shadow-lg">
                    {card.src}
                </div>

                {/* Back of card (visible when not flipped) */}
                <div className="absolute w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl backface-hidden shadow-lg flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">?</span>
                </div>
            </div>
        </div>
    );
}
