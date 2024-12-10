import { IoPerson } from "react-icons/io5";
import { FaClock } from "react-icons/fa6";

export const GamesData = [
    {
        id: "odd_colour_out",
        title: "Odd Colour Out",
        logoLink: "/odd-colour-out-logo.png",
        link: "/odd_colour_out",
        playerLimitText: <div className="gamesDataInfoContainer"><IoPerson />Single Player</div>,
        duration: <div className="gamesDataInfoContainer"><FaClock />1 min</div>,
        description: "Can you spot the odd colour out? Choose the differing colours until they blend in too much to see the difference!"
    },
    {
        id: "telepath",
        title: "Telepath",
        logoLink: "/telepath-logo.png",
        link: "/telepath/lobby",
        playerLimitText: <div className="gamesDataInfoContainer"><IoPerson />2+ players</div>,
        duration: <div className="gamesDataInfoContainer"><FaClock />5-20 min</div>,
        description: "Are you on the same wavelength as your friends? This fun word game will test your compatibility with your friends!"
    },
    {
        id: "thirty_one",
        title: "31",
        logoLink: "/thirty-one-logo.png",
        link: "/thirty_one/lobby",
        playerLimitText: <div className="gamesDataInfoContainer"><IoPerson />2-8 players</div>,
        duration: <div className="gamesDataInfoContainer"><FaClock />5-15 min</div>,
        description: "Collect cards of the same suit to reach 31!"
    },
    {
        id: "rock_paper_scissors_melee",
        title: "RPS Melee",
        logoLink: "/rps-melee-logo.png",
        link: "/rock_paper_scissors_melee/lobby",
        playerLimitText: <div className="gamesDataInfoContainer"><IoPerson />2 players</div>,
        duration: <div className="gamesDataInfoContainer"><FaClock />1 min</div>,
        description: "Predict your opponents moves in this fast paced rock paper scissors game!"
    },
]