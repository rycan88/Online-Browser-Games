import { HanabiCard } from "../components/hanabi/HanabiCard";


export const TailwindTest = () => {
 
  
  return (
    <div>
      <HanabiCard number={2} suit={"red"} id={3} />
      <HanabiCard number={2} suit={"rainbow"} id={3} />
      <div className="rainbowText text-8xl">
        H
      </div>
    </div>

  );
};
  

