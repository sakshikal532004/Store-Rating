
import React from 'react';

interface StarRatingProps {
    count: number;
    value: number;
    size?: number;
}

const StarIcon = ({ filled, color = 'text-yellow-400' }: { filled: boolean; color?: string }) => (
    <svg className={`w-full h-full ${color}`} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

const StarRating: React.FC<StarRatingProps> = ({ count, value, size = 6 }) => {
    const stars = Array.from({ length: count }, (_, i) => {
        const ratingValue = i + 1;
        const isFilled = ratingValue <= value;

        return (
            <div
                key={i}
                className={`cursor-default`}
                style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
            >
                <StarIcon filled={isFilled} />
            </div>
        );
    });

    return <div className="flex items-center justify-center space-x-1">{stars}</div>;
};

export default StarRating;
