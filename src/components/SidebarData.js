import { MdHome } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import { IoLogoGameControllerB } from "react-icons/io";

export const SidebarData = [
    {
        title: "Home",
        icon: <MdHome/>,
        link: "/",
        isMain: true,
    },
    {
        title: "Games",
        icon: <IoLogoGameControllerB/>,
        link: "/games",
        isMain: true,
    },
    {
        title: "Odd Colour Out",
        link: "/odd_colour_out",
        isMain: false,
    },
    {
        title: "Telepath",
        link: "/telepath",
        isMain: false,
    },
    {
        title: "Telepath Lobby",
        link: "/telepath/lobby",
        isMain: false,
    },
    {
        title: "About",
        icon: <FaInfoCircle/>,
        link: "/about",
        isMain: true,
    },
    {
        title: "Sign Up",
        link: "/singup",
        isMain: true,
    },
]