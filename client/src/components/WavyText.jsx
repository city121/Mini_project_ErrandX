// WavyText.jsx
import React from 'react';

export default function WavyText({ text, className = "", delay = 0.05 }) {
    return (
        <span className={`wavy-text ${className}`}>
            {text.split("").map((char, index) => (
                <span
                    key={index}
                    // Apply the CSS variable for staggering delay
                    style={{ '--i': index }}
                    className="wavy-char inline-block relative transform"
                >
                    {char === ' ' ? '\u00A0' : char} {/* Use non-breaking space for actual spaces */}
                </span>
            ))}
        </span>
    );
}