import { HanabiCard } from "../components/hanabi/HanabiCard";


export const TailwindTest = () => {
 
  
  return (
    <div>
      <HanabiCard number={2} suit={"red"} id={3} />
      <HanabiCard number={2} suit={"rainbow"} id={3} />
      <div className="flex">
        <HanabiCard number={1} suit={"rainbow"} id={3} width={150}/>
        <HanabiCard number={2} suit={"rainbow"} id={3} width={150}/>
        <HanabiCard number={3} suit={"rainbow"} id={3} width={150}/>
        <HanabiCard number={4} suit={"rainbow"} id={3} width={150}/>
        <HanabiCard number={5} suit={"rainbow"} id={3} width={150}/>

      </div>

      <div className="rainbowText text-8xl">
        H
      </div>
    </div>

  );
};
  

