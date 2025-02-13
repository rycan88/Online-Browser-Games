import { useState, useEffect } from "react";

const getOrientation = () => (window.innerWidth > window.innerHeight ? "landscape" : "portrait");

export const useOrientation = () => {
    const [orientation, setOrientation] = useState(getOrientation());

    useEffect(() => {
    const handleResize = () => {
        setOrientation(getOrientation());
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);
    window.addEventListener("load", handleResize);

    return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("orientationchange", handleResize);
        window.removeEventListener("load", handleResize);
    };
    }, []);

    return orientation;
};

