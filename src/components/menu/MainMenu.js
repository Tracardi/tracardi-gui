import React from "react";
import "./MainMenu.css";
import {MenuIcon} from "./Menu";
import {MenuItem} from "@szhsin/react-menu";
import {BsFolder} from "@react-icons/all-files/bs/BsFolder";
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
import { BsBug } from "react-icons/bs";
import {VscDebugConsole} from "@react-icons/all-files/vsc/VscDebugConsole";
import {VscPulse} from "@react-icons/all-files/vsc/VscPulse";
import {BsBoxArrowInUpRight} from "@react-icons/all-files/bs/BsBoxArrowInUpRight";
import {BsStar} from "@react-icons/all-files/bs/BsStar";
import {BsBoxArrowUpRight} from "@react-icons/all-files/bs/BsBoxArrowUpRight";

export default function MainMenu() {

    const history = useHistory();
    const go = (url) => {
        return () => history.push(urlPrefix(url));
    }

    return <div className="MainMenu">
        <div>
            <MenuIcon icon={<BsFolder size={25}/>} label="Data">
                <MenuItem onClick={go("/setup/pro")}>
                    <BsStar size={20} style={{marginRight: 8}}/>Tracardi Pro
                </MenuItem>
                <MenuItem onClick={go("/setup/event-sources")}>
                    <BsBoxArrowInUpRight size={20} style={{marginRight: 8}}/>Event sources
                </MenuItem>
                <MenuItem onClick={go("/setup/resources")}>
                    <BsBoxArrowUpRight size={20} style={{marginRight: 8}}/> External resources
                </MenuItem>
                <MenuItem onClick={go("/home/events")}>
                    <BsLightning size={20} style={{marginRight: 8}}/> Events
                </MenuItem>
                <MenuItem onClick={go("/home/profiles")}>
                    <BsPerson size={20} style={{marginRight: 8}}/> Profiles
                </MenuItem>
                <MenuItem onClick={go("/home/sessions")}>
                    <VscJson size={20} style={{marginRight: 8}}/> Sessions
                </MenuItem>
            </MenuIcon>
            <MenuIcon icon={<VscServerProcess size={25}/>} label="Processing">
                <MenuItem onClick={go("/setup/rules")}>
                    <BsGear size={20} style={{marginRight: 8}}/> Rules
                </MenuItem>
                <MenuItem onClick={go("/setup/flows")}>
                    <IoGitNetworkSharp size={20} style={{marginRight: 8}}/> Flows
                </MenuItem>
                <MenuItem onClick={go("/setup/segments")}>
                    <VscOrganization size={20} style={{marginRight: 8}}/> Segments
                </MenuItem>
                <MenuItem onClick={go("/setup/flow-actions")}>
                    <VscPlug size={20} style={{marginRight: 8}}/> Action plugins
                </MenuItem>
            </MenuIcon>
            <MenuIcon icon={<VscPulse size={25}/>} label="Settings">
                <MenuItem onClick={go("/setup/instances")}>
                    <VscVmRunning size={20} style={{marginRight: 8}}/> Running instances
                </MenuItem>
                <MenuItem onClick={go("/setup/tasks")}>
                    <AiOutlineFieldTime size={20} style={{marginRight: 8}}/> Scheduled tasks
                </MenuItem>
            </MenuIcon>
            <MenuIcon icon={<BsBug size={25}/>} label="Test & monitor">
                <MenuItem onClick={go("/editor/test")}>
                    <VscDebugConsole size={20} style={{marginRight: 8}}/>Test console
                </MenuItem>
            </MenuIcon>
        </div>
        <div>

        </div>

    </div>
}