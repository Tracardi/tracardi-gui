import React from "react";
import {useHistory} from "react-router-dom";
import "./MainContent.css";
import MainMenu from "./menu/MainMenu";
import {IoPersonCircleOutline} from "@react-icons/all-files/io5/IoPersonCircleOutline";
import {MenuItem} from "@szhsin/react-menu";
import {MenuIcon} from "./menu/Menu";
import urlPrefix from "../misc/UrlPrefix";
import {AiOutlinePoweroff} from "@react-icons/all-files/ai/AiOutlinePoweroff";

export default function MainContent({children, style}) {
    const history = useHistory();
    const go = (url) => {
        return () => history.push(urlPrefix(url));
    }

    const Brand = () => {
        return <span className="Brand">TRACARDI
            <span className="BrandTag">Home for your Customer Data</span>
            <span className="Version"> v. 0.4.0</span>
        </span>
    }

    return <div className="MainContent" style={style}>
        <MainMenu/>
        <div className="MainPane">
            <div className="Top">
                <Brand/>
                <aside className="User">
                    <MenuIcon icon={<IoPersonCircleOutline size={30}/>} label="Profile" direction="bottom">
                        <MenuItem onClick={go("/logout")}>
                            <AiOutlinePoweroff size={20} style={{marginRight: 8}}/>Logout
                        </MenuItem>
                    </MenuIcon>
                </aside>
            </div>
            <div className="Bottom">
                {children}
            </div>
        </div>

    </div>
}