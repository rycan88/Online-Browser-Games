import { useState, useRef } from "react";
import Axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { getNickname } from "../utils";

export const Home = () => {
  const { data: catData , isLoading } = useQuery({
    queryKey: ["cat"],
    queryFn: () => {
      return Axios.get(`https://catfact.ninja/fact`).then((res) => res.data);
    }
  });

    if (isLoading) {
      return <h1> Loading... </h1>;
    }

    return (
      <div>
          <h1>Here is a cat fact</h1>
          
          <h2>{catData?.fact}</h2>
          <h2>Welcome {getNickname()}</h2>
          <h2 className="text-xl text-blue-700">IT CHANGED!</h2>
      </div>
    );
}