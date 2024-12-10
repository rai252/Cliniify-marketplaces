import React from "react";
import { FiStar } from "react-icons/fi";

interface StarRatingProps {
  average_rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ average_rating }) => {
  const fullStars = Math.floor(average_rating);
  const hasHalfStar = average_rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  const renderStars = (count: number, fillColor: string) => {
    return [...Array(count)].map((_, i) => (
      <FiStar
        key={i}
        style={{
          fill: fillColor,
          stroke: "none",
          fontSize: "25px",
          marginRight: "5px",
        }}
      />
    ));
  };

  return (
    <div className="flex">
      {renderStars(fullStars, "#FDCC0D")}
      {hasHalfStar && renderStars(1, "#FDCC0D")}
      {renderStars(emptyStars, "#D3D3D3")}
    </div>
  );
};

export default StarRating;
