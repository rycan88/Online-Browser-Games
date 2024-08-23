import '../css/Sidebar.css';
import { useRef, useEffect } from "react";

export const Sidebar = (props) => {
    let sidebarRef = useRef(null);

    const closeSidebar = () => {
        props.setSidebarWidth(-400);
    }

    useEffect(() => {
      let handler = (e) => {
        if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
          closeSidebar();
        }
      };
      document.addEventListener("mousedown", handler);
  
      return () => {
        document.removeEventListener("mousedown", handler);
      }
    });

    return (
        <div className="sidebar" ref={sidebarRef} style={{left: props.sidebarWidth+"px"}}>
            <div className="flex flex-col">
                <div className="flex place-content-center items-center w-full h-[50px]">
                    <h1 className="text-2xl">Cool Games Online</h1>
                    <button className="absolute right-[10px] w-[50px] h-[50px] text-2xl"
                            onClick={closeSidebar}>X</button>
                </div>
                <div className="w-full h-[50px] bg-red-700">
                </div>


            </div>
        </div>
    );
}
