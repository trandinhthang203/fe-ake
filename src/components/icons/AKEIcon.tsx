import React from 'react';

interface AKEIconProps {
    className?: string;
    size?: number;
}

const AKEIcon: React.FC<AKEIconProps> = ({ className = '', size = 24 }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Outer glow effect */}
            <defs>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#06B6D4', stopOpacity: 1 }} />
                </linearGradient>
            </defs>

            {/* Enhanced brain outline with gradient */}
            <path
                d="M12 2C8.13 2 5 5.13 5 9c0 2.29 1.17 4.33 3 5.6V21c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-6.4c1.83-1.27 3-3.31 3-5.6 0-3.87-3.13-7-7-7z"
                fill="url(#brainGradient)"
                opacity="0.9"
                filter="url(#glow)"
            />

            {/* Sophisticated medical cross with DNA helix elements */}
            <g transform="translate(12,12)">
                {/* Central medical cross */}
                <rect
                    x="-1.5"
                    y="-3.5"
                    width="3"
                    height="7"
                    rx="1.5"
                    fill="white"
                    stroke="currentColor"
                    strokeWidth="0.5"
                />
                <rect
                    x="-3.5"
                    y="-1.5"
                    width="7"
                    height="3"
                    rx="1.5"
                    fill="white"
                    stroke="currentColor"
                    strokeWidth="0.5"
                />

                {/* DNA helix strands */}
                <path
                    d="M-4,-2 Q-2,-1 0,0 Q2,1 4,2"
                    stroke="white"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.8"
                />
                <path
                    d="M-4,2 Q-2,1 0,0 Q2,-1 4,-2"
                    stroke="white"
                    strokeWidth="1"
                    fill="none"
                    opacity="0.8"
                />

                {/* Nucleotide bases */}
                <circle cx="-3" cy="-1.5" r="0.3" fill="#EF4444" />
                <circle cx="-1" cy="-0.5" r="0.3" fill="#10B981" />
                <circle cx="1" cy="0.5" r="0.3" fill="#F59E0B" />
                <circle cx="3" cy="1.5" r="0.3" fill="#3B82F6" />
            </g>

            {/* Advanced neural network connections */}
            <g opacity="0.7">
                {/* Connection lines */}
                <path d="M7 5.5 Q9 7 11 8.5" stroke="white" strokeWidth="1.2" fill="none" />
                <path d="M13 8.5 Q15 7 17 5.5" stroke="white" strokeWidth="1.2" fill="none" />
                <path d="M7 10.5 Q9 12 11 13.5" stroke="white" strokeWidth="1.2" fill="none" />
                <path d="M13 13.5 Q15 12 17 10.5" stroke="white" strokeWidth="1.2" fill="none" />

                {/* Neural nodes with pulsing effect */}
                <circle cx="7" cy="5.5" r="1.2" fill="#60A5FA" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.6;0.9" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="17" cy="5.5" r="1.2" fill="#60A5FA" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.6;0.9" dur="2s" repeatCount="indefinite" begin="0.5s" />
                </circle>
                <circle cx="7" cy="10.5" r="1.2" fill="#60A5FA" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.6;0.9" dur="2s" repeatCount="indefinite" begin="1s" />
                </circle>
                <circle cx="17" cy="10.5" r="1.2" fill="#60A5FA" opacity="0.9">
                    <animate attributeName="opacity" values="0.9;0.6;0.9" dur="2s" repeatCount="indefinite" begin="1.5s" />
                </circle>
            </g>

            {/* Tech circuit pattern overlay */}
            <g opacity="0.4">
                <rect x="6" y="4" width="1" height="1" fill="white" rx="0.2" />
                <rect x="17" y="4" width="1" height="1" fill="white" rx="0.2" />
                <rect x="6" y="9" width="1" height="1" fill="white" rx="0.2" />
                <rect x="17" y="9" width="1" height="1" fill="white" rx="0.2" />
                <rect x="11.5" y="6.5" width="1" height="1" fill="white" rx="0.2" />
            </g>
        </svg>
    );
};

export default AKEIcon;
