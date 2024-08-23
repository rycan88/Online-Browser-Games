import '../css/Sidebar.css';
import { useState, useContext, useRef, useEffect } from "react";
import { AppContext } from "../App";

export const Sidebar = (props) => {
    

    let sidebarRef = useRef(null);

    useEffect(() => {
      let handler = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
          props.setSidebarWidth(0);
          console.log(sidebarRef.current);
        }
      };
      document.addEventListener("mousedown", handler);
  
      return () => {
        document.removeEventListener("mousedown", handler);
      }
    });
    
    console.log(props.sideBarWidth);


    return (
        <div className="sidebar" ref={sidebarRef} style={{width: props.sidebarWidth+"px"}}>
            {props.sideBarWidth !== 0 && <h1>Hello</h1>}

        </div>
    );
}