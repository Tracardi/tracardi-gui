import React from "react";
import "./MainMenu.css";
import {MenuIcon} from "./Menu";
import {VscRadioTower} from "@react-icons/all-files/vsc/VscRadioTower";
import {MenuItem} from "@szhsin/react-menu";
import {BsFolder} from "@react-icons/all-files/bs/BsFolder";
import {VscServerProcess} from "@react-icons/all-files/vsc/VscServerProcess";
import {VscOrganization} from "@react-icons/all-files/vsc/VscOrganization";
import {useHistory} from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";
import {VscPlug} from "@react-icons/all-files/vsc/VscPlug";
import {IoGitNetworkSharp} from "@react-icons/all-files/io5/IoGitNetworkSharp";
import {BsShieldLock} from "@react-icons/all-files/bs/BsShieldLock";
import {BsPerson} from "@react-icons/all-files/bs/BsPerson";
import {BsLightning} from "@react-icons/all-files/bs/BsLightning";
import {BsGear} from "@react-icons/all-files/bs/BsGear";
import {VscJson} from "@react-icons/all-files/vsc/VscJson";
import {VscAdd} from "@react-icons/all-files/vsc/VscAdd";

export default function MainMenu() {

    const history = useHistory();
    const go = (url) => {
        return () => history.push(urlPrefix(url));
    }

    return <div className="MainMenu">
        <div>
            <MenuIcon icon={<VscRadioTower size={25}/>} label="Sources">
                <MenuItem onClick={go("/setup/sources")}>
                    <VscRadioTower size={20} style={{marginRight: 8}}/>Sources
                </MenuItem>
                <MenuItem onClick={go("/setup/credentials")}>
                    <BsShieldLock size={20} style={{marginRight: 8}}/> Sources configurations
                </MenuItem>
            </MenuIcon>
            <MenuIcon icon={<BsFolder size={25}/>} label="Data">
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
                <MenuItem onClick={go("/setup/flow-actions")}>
                    <VscPlug size={20} style={{marginRight: 8}}/> Action plugins
                </MenuItem>
            </MenuIcon>
            <MenuIcon icon={<VscOrganization size={25}/>} label="Segments">
                <MenuItem onClick={go("/setup/segments")}>
                    <VscOrganization size={20} style={{marginRight: 8}}/> Segments
                </MenuItem>
            </MenuIcon>
            <MenuIcon icon={<VscAdd size={25}/>} label="Segments">
                <MenuItem onClick={go("/setup/process")}>
                    <VscAdd size={20} style={{marginRight: 8}}/> Add process
                </MenuItem>
            </MenuIcon>
        </div>
        <div>

        </div>

    </div>
}