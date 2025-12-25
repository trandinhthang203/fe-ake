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
            {/* Brain outline representing AI */}
            <path
                d="M12 2C8.13 2 5 5.13 5 9c0 2.29 1.17 4.33 3 5.6V21c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-6.4c1.83-1.27 3-3.31 3-5.6 0-3.87-3.13-7-7-7z"
                fill="currentColor"
                opacity="0.8"
            />

            {/* Medical cross in the center */}
            <rect
                x="10.5"
                y="8.5"
                width="3"
                height="7"
                rx="1.5"
                fill="currentColor"
            />
            <rect
                x="8.5"
                y="10.5"
                width="7"
                height="3"
                rx="1.5"
                fill="currentColor"
            />

            {/* Tech circuit lines */}
            <path
                d="M7 6h2M15 6h2M7 12h2M15 12h2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                opacity="0.6"
            />

            {/* Neural network dots */}
            <circle cx="9" cy="7" r="1" fill="currentColor" opacity="0.7" />
            <circle cx="15" cy="7" r="1" fill="currentColor" opacity="0.7" />
            <circle cx="9" cy="11" r="1" fill="currentColor" opacity="0.7" />
            <circle cx="15" cy="11" r="1" fill="currentColor" opacity="0.7" />
        </svg>
    );
};

export default AKEIcon;
