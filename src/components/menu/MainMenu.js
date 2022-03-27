import React, {useState} from "react";
import "./MainMenu.css";
import {BsFolder} from "react-icons/bs";
import {useHistory} from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";
import version from '../../misc/version';
import {BiChevronLeftCircle, BiChevronRightCircle} from "react-icons/bi";
import {BsPersonCircle} from "react-icons/bs";
import {VscPulse} from "react-icons/vsc";
import {IoGitNetworkSharp} from "react-icons/io5";
import {GoSettings} from "react-icons/go";
import {VscLaw} from "react-icons/vsc";
import {BsFolderCheck, BsClipboardCheck, BsStar} from "react-icons/bs";
import {commercial} from "../../config";
import {RiArrowLeftRightFill} from "react-icons/ri";

export default function MainMenu() {

    const [collapsed, setCollapsed] = useState(false);

    const history = useHistory();
    const go = (url) => {
        return () => history.push(urlPrefix(url));
    }

    const MenuRow = ({label, icon, onClick, style, collapsed=false}) => {
        return <div className="MenuRow" onClick={onClick} style={style}><span className="Icon">{icon}</span>{!collapsed && <span className="Label">{label}</span>}</div>
    }

    const Branding = ({collapsed=false}) => {
        if(collapsed === true) {
            return <div className="Branding"><div className="T">T</div></div>
        }
        return <div className="Branding">
                <div className="Tracardi">TRACARDI</div>
                <div className="Version">v. {version()}</div>
            </div>
    }

    return <div className={collapsed ? "MainMenu CollapsedMainMenu": "MainMenu FullMainMenu"}>
        <div>
            <Branding collapsed={collapsed}/>
            <div>
                {commercial && <MenuRow icon={<BsStar size={20}/>} label="Tracardi Pro" collapsed={collapsed} onClick={go("/pro")}/>}
                <MenuRow icon={<RiArrowLeftRightFill size={20}/>} label="Traffic" collapsed={collapsed} onClick={go("/traffic")}/>
                <MenuRow icon={<VscLaw size={20}/>} label="Consents" collapsed={collapsed} onClick={go("/consents")}/>
                <MenuRow icon={<BsFolderCheck size={20}/>} label="Validation" collapsed={collapsed} onClick={go("/validation")}/>
                <MenuRow icon={<BsFolder size={20}/>} label="Data" collapsed={collapsed} onClick={go("/data")}/>
                <MenuRow icon={<IoGitNetworkSharp size={20}/>} label="Processing" collapsed={collapsed} onClick={go("/processing")}/>
                <MenuRow icon={<VscPulse size={20}/>} label="Monitoring" collapsed={collapsed} onClick={go("/monitoring")}/>
                <MenuRow icon={<BsClipboardCheck size={20}/>} label="Test" collapsed={collapsed} onClick={go("/testing")}/>
                <MenuRow icon={<GoSettings size={20}/>}
                         label="Settings"
                         collapsed={collapsed}
                         onClick={go("/settings")}/>
            </div>
        </div>
        <div>
            <MenuRow icon={<BsPersonCircle size={20}/>}
                label="My account"
                collapsed={collapsed}
                style={{marginBottom: 20}}
                onClick={go("/my-account")}
                />

            <MenuRow icon={collapsed ? <BiChevronRightCircle size={20}/> : <BiChevronLeftCircle size={20}/>}
                     collapsed={collapsed}
                     label="Collapse"
                     onClick={() => setCollapsed(!collapsed)}
            />
        </div>

    </div>
}