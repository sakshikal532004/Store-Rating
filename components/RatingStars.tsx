
import React, { useState } from 'react';

interface RatingStarsProps {
    count: number;
    rating: number;
    onRatingChange?: (newRating: number) => void;
    size?: number;
    readonly?: boolean;
}

const StarIcon = ({ filled, half, color = 'text-yellow-400' }: { filled: boolean; half?: boolean; color?: string }) => (
    <svg className={`w-full h-full ${color}`} fill={filled ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);


const RatingStars: React.FC<RatingStarsProps> = ({ count, rating, onRatingChange, size = 6, readonly = false }) => {
    const [hoverRating, setHoverRating] = useState(0);

    const stars = Array.from({ length: count }, (_, i) => {
        const ratingValue = i + 1;
        const isFilled = ratingValue <= (hoverRating || rating);

        return (
            <div
                key={i}
                className={`cursor-${readonly ? 'default' : 'pointer'} transition-transform duration-200 ease-in-out ${!readonly ? 'hover:scale-125' : ''}`}
                style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
                onClick={() => !readonly && onRatingChange?.(ratingValue)}
                onMouseEnter={() => !readonly && setHoverRating(ratingValue)}
                onMouseLeave={() => !readonly && setHoverRating(0)}
            >
                <StarIcon filled={isFilled} />
            </div>
        );
    });

    return <div className="flex items-center space-x-1">{stars}</div>;
};

export default RatingStars;
