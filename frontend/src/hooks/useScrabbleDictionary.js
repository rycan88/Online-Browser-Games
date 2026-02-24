import { useEffect, useState } from "react";

export default function useScrabbleDictionary() {
    const [dictionary, setDictionary] = useState(null);

    useEffect(() => {
        fetch("/scrabble-words.txt")
        .then(res => res.text())
        .then(text => {
            const words = text.split("\n").map(w => w.trim().toLowerCase());
            setDictionary(new Set(words)); // O(1) lookup
        });
    }, []);

  return dictionary;
}