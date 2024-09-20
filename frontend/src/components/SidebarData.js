import { MdHome } from "react-icons/md";
import { FaInfoCircle } from "react-icons/fa";
import { IoLogoGameControllerB } from "react-icons/io";
import { IoIosColorPalette } from "react-icons/io";
import { GiBrain } from "react-icons/gi";
import { GiCardAceSpades } from "react-icons/gi";

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
        icon: <IoIosColorPalette />,
        link: "/odd_colour_out",
        isMain: false,
    },
    {
        title: "Telepath",
        icon: <GiBrain />,
        link: "/telepath/lobby",
        isMain: false,
    },
    {
        title: "31",
        icon: <GiCardAceSpades />,
        link: "/thirty_one",
        isMain: false,
    },
    {
        title: "31 LOBBY",
        icon: <GiCardAceSpades />,
        link: "/thirty_one/lobby",
        isMain: false,
    },
    {
        title: "About",
        icon: <FaInfoCircle/>,
        link: "/about",
        isMain: true,
    },
    {
        title: "Change Username",
        link: "/profile",
        isMain: true,
    },
]