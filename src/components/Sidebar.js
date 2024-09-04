import '../css/Sidebar.css';

import { IoMdClose } from "react-icons/io";

import { useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarData } from './SidebarData';

// setSidebarWidth: React function
// props.sidebarWidth: Int

export const Sidebar = (props) => {
    let sidebarRef = useRef(null);
    const navigate = useNavigate();
    
    const closeSidebar = () => {
        props.setSidebarWidth(-300);
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
                    <h1 className="text-lg">Cool Games Online</h1>
                    <IoMdClose className="closeButton hover:redGradientButton"
                            onClick={closeSidebar}/>
                </div>
                <ul>
                  {(SidebarData.map((val, key) => {
                    const extraFormatting = val.isMain ? "pl-[30px] border-t-[0.1px]" : "pl-[80px]"
                    return (
                      <li key={key}>
                        <div className={`sidebarItem ${extraFormatting}`} 
                             id = {window.location.pathname === val.link ? "active" : ""}
                             onClick={() => { 
                                closeSidebar();
                                navigate(val.link);
                              }}
                        >
                          {val.icon && <div className="pr-2">{val.icon}</div>}
                          <h2>{val.title}</h2>
                        </div>

                      </li>
                    );
                  }))}
                </ul>

            </div>
        </div>
    );
}
