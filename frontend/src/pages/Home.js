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
      <div className="pt-6">
          <h2 className="text-4xl">Welcome {getNickname()}</h2>
          <br/>

          <h1>Random Cat Fact</h1>
          <h2>{catData?.fact}</h2>
          <br/>
          <h2>(Home page in progress)</h2>
          <h2>FOR OPTIMAL GAMEPLAY, PLEASE PLAY ON DESKTOP</h2>
      </div>
    );
}