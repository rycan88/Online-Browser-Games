import { useEffect, useState } from "react";
import { FaHeart, FaHeartBroken } from "react-icons/fa";

export const AnimatedBreakingHeart = ({animationDuration=1250}) => {
    const [showFullHeart, setShowFullHeart] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowFullHeart(false); 
      }, animationDuration * 0.6); 
  
      return () => clearTimeout(timer); // Cleanup timer when component unmounts
    }, []);
  
    return (
      <div className="animate-loseHeart"
        style={{
          animation: `loseHeartFrame ${animationDuration / 1000}s ease-in-out forwards`,
        }}
      >
        {showFullHeart ? <FaHeart /> : <FaHeartBroken />}
      </div>
    );
}