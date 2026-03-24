import { useRef, useLayoutEffect } from "react";

export const useFlipAnimation = (deps, isEnabled) => {
  const elements = useRef(new Map());
  const positions = useRef(new Map());

  const register = (id) => (el) => {
    if (el) elements.current.set(id, el);
    else elements.current.delete(id);
  };

  useLayoutEffect(() => {
    const newPositions = new Map();

    elements.current.forEach((el, id) => {
      newPositions.set(id, el.getBoundingClientRect());
    });

    if (!isEnabled) {
        positions.current = newPositions;
        return;
    }

    elements.current.forEach((el, id) => {
      const oldPos = positions.current.get(id);
      const newPos = newPositions.get(id);

      if (!oldPos || !newPos) return;

      const dx = oldPos.left - newPos.left;
      const dy = oldPos.top - newPos.top;

      if (!dx && !dy) return;

      el.style.transform = `translate(${dx}px, ${dy}px)`;
      el.style.transition = "transform 0s";

      requestAnimationFrame(() => {
        el.style.transform = "";
        el.style.transition = `transform 250ms ease ${Math.random()*80}ms`;
      });
    });

    positions.current = newPositions;
  }, deps);

  return register;
};