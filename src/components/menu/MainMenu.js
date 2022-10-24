import React, {useState} from "react";
import "./MainMenu.css";
import {BsBarChartFill, BsFolder} from "react-icons/bs";
import {useHistory} from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";
import version from '../../misc/version';
import {BiChevronLeftCircle, BiChevronRightCircle} from "react-icons/bi";
import {BsPersonCircle, BsFileEarmarkArrowUp} from "react-icons/bs";
import {VscOrganization, VscPulse, VscTools} from "react-icons/vsc";
import {IoGitNetworkSharp} from "react-icons/io5";
import {GoSettings} from "react-icons/go";
import {VscLaw, VscDashboard} from "react-icons/vsc";
import {BsClipboardCheck, BsStar, BsBoxArrowInLeft, BsBoxArrowInRight} from "react-icons/bs";
import { getRoles } from "../authentication/login";
import {useConfirm} from "material-ui-confirm";
import {asyncRemote, getError} from "../../remote_api/entrypoint";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";

function MainMenu({showAlert}) {

    const [collapsed, setCollapsed] = useState(false);
    const confirm = useConfirm()
    const history = useHistory();

    const go = (url) => {
        return () => history.push(urlPrefix(url));
    }

    const MenuRow = ({label, icon, onClick, style, collapsed=false, roles=[], alwaysDisplay=false}) => {

        function intersect(a, b) {
            let setB = new Set(b);
            return [...new Set(a)].filter(x => setB.has(x));
        }

        const isAllowed = () => {
            if(intersect(getRoles(), roles).length > 0) {
                return true
            }
            return false
        }

        return (
            isAllowed() || alwaysDisplay ?
            <div className="MenuRow" onClick={onClick} style={style}><span className="Icon">{icon}</span>{!collapsed && <span className="Label">{label}</span>}</div>
            :
            null
        )
    }

    const handleVersionWindow = async () => {
        try {

            const response = await asyncRemote({
                url: '/info/version/details',
                method: "get"
            })

            const message = <>
                {`Frontend Version: ${version()}`}<br/>
                {`Backend Version: ${response?.data?.version}.${response?.data?.name}`}<br/>
                {`Backend Upgrades: ${(Array.isArray(response?.data?.upgrades) && response?.data?.upgrades.length>0) ? response?.data?.upgrades.join() : "None"}`}<br />
                {response?.data?.prev_version && `Previous Backend Version: ${response?.data?.prev_version?.version}.${response?.data?.prev_version?.name}`}<br/>
            </>

            confirm({title: "TRACARDI Version Information", description: message}).then(() => {}).catch(() => {})

        } catch(e) {
            const errors = getError(e)
            showAlert({message: errors[0].msg, type: "error", hideAfter: 4000});
        }
    }

    const Branding = ({collapsed=false}) => {
        if(collapsed === true) {
            return <div className="Branding"><div className="T">T</div></div>
        }
        return <div className="Branding" onClick={handleVersionWindow}>
                <div className="Tracardi">TRACARDI</div>
                <div className="Version">v. {version()}</div>
            </div>
    }

    return <div className={collapsed ? "MainMenu CollapsedMainMenu": "MainMenu FullMainMenu"}>
        <div>
            <Branding collapsed={collapsed}/>
            <div>
                <MenuRow icon={<VscDashboard size={20}/>} label="Dashboard" collapsed={collapsed} onClick={go("/dashboard")} roles={["admin", "developer", "marketer", "maintainer"]}/>
                <MenuRow icon={<BsStar size={20}/>} label="Resources" collapsed={collapsed} onClick={go("/resources")} roles={["admin", "developer"]}/>
                <MenuRow icon={<BsBoxArrowInRight size={20}/>} label="Inbound Traffic" collapsed={collapsed} onClick={go("/inbound")} roles={["admin", "developer"]}/>
                <MenuRow icon={<BsBoxArrowInLeft size={20}/>} label="Outbound Traffic" collapsed={collapsed} onClick={go("/outbound")} roles={["admin", "developer"]}/>
                <MenuRow icon={<BsFolder size={20}/>} label="Data" collapsed={collapsed} onClick={go("/data")} roles={["admin", "developer", "marketer"]}/>
                <MenuRow icon={<IoGitNetworkSharp size={20}/>} label="Processing" collapsed={collapsed} onClick={go("/processing")} roles={["admin", "developer", "marketer"]}/>
                <MenuRow icon={<VscOrganization size={20}/>} label="Segmentation" collapsed={collapsed} onClick={go("/segmentation")} roles={["admin", "developer", "marketer"]}/>
                <MenuRow icon={<BsBarChartFill size={20}/>} label="Reporting" collapsed={collapsed} onClick={go("/reporting")} roles={["admin", "developer", "marketer"]}/>
                <MenuRow icon={<VscLaw size={20}/>} label="Consents" collapsed={collapsed} onClick={go("/consents")} roles={["admin", "developer", "marketer"]}/>
                <MenuRow icon={<BsClipboardCheck size={20}/>} label="Test" collapsed={collapsed} onClick={go("/testing")} roles={["admin", "developer"]}/>


            </div>
        </div>
        <div>
            <MenuRow icon={<BsPersonCircle size={20}/>}
                label="My account"
                collapsed={collapsed}
                onClick={go("/my-account")}
                alwaysDisplay={true}
                />
            <MenuRow icon={<VscPulse size={20}/>}
                     label="Monitoring"
                     collapsed={collapsed}
                     onClick={go("/monitoring")}
                     roles={["admin"]}/>
            <MenuRow icon={<VscTools size={20}/>}
                     label="Maintenance"
                     collapsed={collapsed}
                     onClick={go("/maintenance")}
                     roles={["admin", "maintainer"]}/>
            <MenuRow icon={<BsFileEarmarkArrowUp size={20}/>} label="Import" collapsed={collapsed} onClick={go("/import")} roles={["admin", "developer"]}/>
            <MenuRow icon={<GoSettings size={20}/>}
                     label="Settings"
                     collapsed={collapsed}
                     onClick={go("/settings")}
                     roles={["admin", "developer"]}
                     style={{marginBottom: 20}}/>
            <MenuRow icon={collapsed ? <BiChevronRightCircle size={20}/> : <BiChevronLeftCircle size={20}/>}
                     collapsed={collapsed}
                     label="Collapse"
                     onClick={() => setCollapsed(!collapsed)}
                     alwaysDisplay={true}
            />
        </div>

    </div>
}

const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert}
)(MainMenu);