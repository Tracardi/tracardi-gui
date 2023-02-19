import React, {useContext, useEffect, useState} from "react";
import "./MainMenu.css";
import {BsBarChartFill, BsFolder, BsGear} from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";
import version from '../../misc/version';
import {BiChevronLeftCircle, BiChevronRightCircle} from "react-icons/bi";
import {BsPersonCircle, BsFileEarmarkArrowUp} from "react-icons/bs";
import {VscOrganization, VscPulse, VscTools} from "react-icons/vsc";
import {IoGitNetworkSharp, IoServerOutline} from "react-icons/io5";
import {VscDashboard} from "react-icons/vsc";
import {BsClipboardCheck, BsBoxArrowRight, BsBoxArrowInRight} from "react-icons/bs";
import { getRoles } from "../authentication/login";
import {useConfirm} from "material-ui-confirm";
import {asyncRemote, getError} from "../../remote_api/entrypoint";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import {changeRoute} from "../../redux/reducers/appSlice"
import FlowNodeIcons from "../flow/FlowNodeIcons";
import ServerContext from "../context/ServerContext";
import {Restrict} from "../authentication/Restrict";
import {DataContext} from "../AppBox";
import {getDataContextHeader} from "../../config";
import useTheme from "@mui/material/styles/useTheme";


function MainMenu({app, showAlert, changeRoute, onContextChange}) {

    const production = useContext(DataContext)
    const theme = useTheme()

    const [collapsed, setCollapsed] = useState(false);
    const confirm = useConfirm()
    const location = useLocation();
    const pathname = location.pathname
    const navigate = useNavigate();

    useEffect(() => {
        changeRoute({route: pathname})
    }, [changeRoute, pathname])

    const go = (url) => {
        return () => navigate(urlPrefix(url));
    }

    const MenuRow = ({label, icon, route = null, onClick, style, collapsed=false, roles=[], alwaysDisplay=false}) => {

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
            <div className={`MenuRow ${app.currentRoute === route ? "active" : ""}`} onClick={onClick} style={style}><span className="Icon">{icon}</span>{!collapsed && <span className="Label">{label}</span>}</div>
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
                <b>Frontend Version:</b> {version()}<br/>
                <b>Backend Version: </b> {response?.data?.version}.{response?.data?.name}<br/>
                <b>API context: </b> {response?.data?.production ? "production": "staging"}<br/>
                <b>GUI context: </b> {getDataContextHeader("unknown")}<br/><br />
                <b>Owner: </b> {response?.data?.owner}<br/>
                <b>Licenses: </b>{response?.data?.licenses.join(", ")}<br/>
                <b>Expires: </b>{response?.data?.expires}<br/><br />
                <b>Backend Upgrades: </b>{(Array.isArray(response?.data?.upgrades) && response?.data?.upgrades.length>0) ? response?.data?.upgrades.join() : "None"}<br />
                <b>Previous Backend Version: </b>{response?.data?.prev_version ? `${response?.data?.prev_version?.version}.${response?.data?.prev_version?.name}` : "None"}<br/>
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
        return <div className="Branding">
                <div className="Tracardi" onClick={handleVersionWindow}>TRACARDI</div>
                <div className="Version">v. {version()} <Restrict roles={['admin']}>
                    <ServerContext style={{marginLeft: 5}} onContextChange={onContextChange}/>
                </Restrict>
                </div>
            </div>
    }

    const style = {backgroundColor: theme.palette.primary.main, color: theme.palette.common.white}

    return <div style={style} className={collapsed ? "MainMenu CollapsedMainMenu": "MainMenu FullMainMenu"}>
        <div>
            <Branding collapsed={collapsed}/>
            <div>
                <MenuRow icon={<VscDashboard size={20}/>} label="Dashboard" collapsed={collapsed} onClick={go("/dashboard")} route="/dashboard" roles={["admin", "developer", "marketer", "maintainer"]} style={{marginBottom: 20}}/>

                {!window?.CONFIG?.menu?.inbound?.disable && <MenuRow icon={<BsBoxArrowInRight size={20}/>} label="Inbound Traffic" collapsed={collapsed} onClick={go("/inbound")} route="/inbound" roles={["admin", "developer"]}/>}
                {!window?.CONFIG?.menu?.triggers?.disable && <MenuRow icon={<BsGear size={20}/>} label="Triggers" collapsed={collapsed} onClick={go("/triggers")} route="/triggers" roles={["admin", "developer"]}/>}
                {!window?.CONFIG?.menu?.transformations?.disable && <MenuRow icon={<FlowNodeIcons icon="map-properties"  size={20}/>} label="Collection" collapsed={collapsed} onClick={go("/transformations")} route="/transformations" roles={["admin", "developer"]}/>}
                {!window?.CONFIG?.menu?.identification?.disable && <MenuRow icon={<FlowNodeIcons icon="identity"  size={20}/>} label="Identification" collapsed={collapsed} onClick={go("/identification")} route="/identification" roles={["admin", "developer"]}/>}

                {!window?.CONFIG?.menu?.data?.disable && <MenuRow icon={<BsFolder size={20}/>} label="Data" collapsed={collapsed} onClick={go("/data")} route="/data" roles={["admin", "developer", "marketer"]}/>}
                {!window?.CONFIG?.menu?.integration?.disable && <MenuRow icon={<IoGitNetworkSharp size={20}/>} label="Processing" collapsed={collapsed} onClick={go("/processing")} route="/processing" roles={["admin", "developer"]}/>}
                {!window?.CONFIG?.menu?.segmentation?.disable && <MenuRow icon={<VscOrganization size={20}/>} label="Segmentation" collapsed={collapsed} onClick={go("/segmentation")} route="/segmentation" roles={["admin", "developer", "marketer"]}/>}

                {!window?.CONFIG?.menu?.reporting?.disable && <MenuRow icon={<BsBarChartFill size={20}/>} label="Reporting" collapsed={collapsed} onClick={go("/reporting")} route="/reporting" roles={["admin", "developer", "marketer"]}/>}
                {!window?.CONFIG?.menu?.outbound?.disable && <MenuRow icon={<BsBoxArrowRight size={20}/>} label="Outbound Traffic" collapsed={collapsed} onClick={go("/outbound")} route="/outbound" roles={["admin", "developer"]}/>}

                {!window?.CONFIG?.menu?.resources?.disable && <MenuRow icon={<IoServerOutline size={20}/>} label="Resources" collapsed={collapsed} onClick={go("/resources")} route="/resources" roles={["admin", "developer"]} style={{marginTop: 20}}/>}

                {!window?.CONFIG?.menu?.test?.disable && <MenuRow icon={<BsClipboardCheck size={20}/>} label="Test" collapsed={collapsed} onClick={go("/test/form")} route="/test/form" roles={["admin", "developer"]} style={{marginTop: 20}}/>}


            </div>
        </div>
        <div>
            <MenuRow icon={<BsPersonCircle size={20}/>}
                label="My account"
                collapsed={collapsed}
                onClick={go("/my-account")}
                route="/my-account"
                alwaysDisplay={true}
                />
            {!window?.CONFIG?.menu?.monitoring?.disable && <MenuRow icon={<VscPulse size={20}/>}
                     label="Monitoring"
                     collapsed={collapsed}
                     onClick={go("/monitoring")}
                     route="/monitoring"
                     roles={["admin"]}/>}
            {!window?.CONFIG?.menu?.maintenance?.disable && <MenuRow icon={<VscTools size={20}/>}
                     label="Maintenance"
                     collapsed={collapsed}
                     onClick={go("/maintenance")}
                     route="/maintenance"
                     roles={["admin", "maintainer"]}/>}
            {!window?.CONFIG?.menu?.import?.disable && <MenuRow icon={<BsFileEarmarkArrowUp size={20}/>}
                                                                label="Import"
                                                                collapsed={collapsed}
                                                                onClick={go("/import")}
                                                                route="/import"
                                                                roles={["admin", "developer"]}
                                                                style={{marginBottom: 20}}
            />}

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
        app: state.appReducer,
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert, changeRoute}
)(MainMenu);