import React from "react";
import "./MainMenu.css";
import {MenuIcon} from "./Menu";
import {MenuItem} from "@szhsin/react-menu";
import {BsFolder} from "react-icons/bs";
import {VscServerProcess} from "@react-icons/all-files/vsc/VscServerProcess";
import {VscOrganization} from "@react-icons/all-files/vsc/VscOrganization";
import {useHistory} from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";
import {VscPlug} from "@react-icons/all-files/vsc/VscPlug";
import {IoGitNetworkSharp} from "@react-icons/all-files/io5/IoGitNetworkSharp";
import {BsPerson} from "@react-icons/all-files/bs/BsPerson";
import {BsLightning} from "@react-icons/all-files/bs/BsLightning";
import {BsGear} from "@react-icons/all-files/bs/BsGear";
import {VscJson} from "@react-icons/all-files/vsc/VscJson";
import {AiOutlineFieldTime} from "@react-icons/all-files/ai/AiOutlineFieldTime";
import {VscVmRunning} from "@react-icons/all-files/vsc/VscVmRunning";
import {BsBug} from "react-icons/bs";
import {VscDebugConsole} from "@react-icons/all-files/vsc/VscDebugConsole";
import {VscPulse} from "react-icons/vsc";
import {BsBoxArrowInUpRight} from "react-icons/bs";
import {BsStar} from "react-icons/bs";
import {BsBoxArrowUpRight} from "@react-icons/all-files/bs/BsBoxArrowUpRight";
import version from '../../misc/version';

export default function MainMenu() {

    const history = useHistory();
    const go = (url) => {
        return () => history.push(urlPrefix(url));
    }

    const MenuRow = ({label, icon}) => {
        return <div className="MenuRow"><span>{icon}</span><span>{label}</span></div>
    }

    return <div className="MainMenu">
        <div style={{margin: 20}}>
            <div className="Tracardi">TRACARDI</div>
            <div className="Version">v. {version()}</div>
        </div>

        <MenuRow icon={<BsStar style={45}/>} label="Tracardi Pro"/>
        <MenuRow icon={<BsBoxArrowInUpRight style={25}/>} label="Traffic"/>
        <MenuRow icon={<BsFolder style={25}/>} label="Data"/>
        <MenuRow icon={<VscPulse size={25}/>} label="Monitoring"/>
        <MenuRow icon={<BsBug size={25}/>} label="Test"/>
    </div>
}