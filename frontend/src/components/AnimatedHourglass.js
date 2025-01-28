import { useEffect, useRef, useState } from "react";
import { BsHourglassBottom, BsHourglassSplit, BsHourglassTop } from "react-icons/bs";
import { FaHourglass, FaHourglassStart } from "react-icons/fa6";

export const AnimatedHourglass = ({animationDuration=2000, breakDuration=4000}) => {
    const [rotation, setRotation] = useState(0);
    const [timingIndex, setTimingIndex] = useState(0);
    console.log(timingIndex)
    const timingStates = [BsHourglassTop, BsHourglassSplit, BsHourglassBottom];

    const intervalRef = useRef(null);

    const IconComponent = timingStates[timingIndex];

    useEffect(() => {
        const interval = setInterval(() => {
            setRotation((prev) => (prev + 180));
        }, breakDuration);

        return () => clearInterval(interval);
    }, []);

    const handleEndAnimation = () => {
        console.log("yes")
        setRotation(rotation % 360);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        intervalRef.current = setInterval(() => {
            setTimingIndex((prev) => (prev + 1) % timingStates.length);
        }, (breakDuration - animationDuration) / timingStates.length);

        setTimeout(() => {
            clearInterval(intervalRef.current);
        }, breakDuration)
    }

    return (
        <div>
            <IconComponent className="animate-hourglassSpin"
                            style={{
                                transition: `transform ${animationDuration/1000}s ease-in-out`
                            }}
                            onAnimationEnd={handleEndAnimation}
             />
        </div>
    );


    /*
    const [showFullHeart, setShowFullHeart] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        setShowFullHeart(false); 
      }, animationDuration * 0.6); 
  
      return () => clearTimeout(timer); // Cleanup timer when component unmounts
    }, []);
  
    return (
      <div className="animate-hourglassSpin"
        style={{
          animation: `loseHeartFrame ${animationDuration / 1000}s ease-in-out forwards`,
        }}
      >
        {showFullHeart ? <FaHeart /> : <FaHeartBroken />}
      </div>
    );
    */
}