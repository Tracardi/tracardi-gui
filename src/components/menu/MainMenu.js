import React, {useContext, useEffect, useState} from "react";
import "./MainMenu.css";
import {BsBarChartFill, BsFolder, BsHouse, BsPersonLinesFill} from "react-icons/bs";
import { useNavigate, useLocation } from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";
import version from '../../misc/version';
import {BiChevronLeftCircle, BiChevronRightCircle} from "react-icons/bi";
import {BsGear} from "react-icons/bs";
import {VscPulse, VscTools, VscOrganization} from "react-icons/vsc";
import {IoServerOutline} from "react-icons/io5";
import {BsClipboardCheck, BsBoxArrowRight, BsBoxArrowInRight} from "react-icons/bs";
import {useConfirm} from "material-ui-confirm";
import {getError} from "../../remote_api/entrypoint";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import {changeRoute} from "../../redux/reducers/appSlice"
import FlowNodeIcons from "../flow/FlowNodeIcons";
import ServerContextTag from "../context/ServerContextTag";
import {Restrict} from "../authentication/Restrict";
import {getDataContextHeader} from "../../config";
import useTheme from "@mui/material/styles/useTheme";
import {DataContext} from "../AppBox";
import {useRequest} from "../../remote_api/requestClient";
import {KeyCloakContext} from "../context/KeyCloakContext";
import {RestrictToMode} from "../context/RestrictContext";
import envs from "../../envs";

const MenuRow = ({app, label, icon, route = null, onClick, style, collapsed=false, roles=[], alwaysDisplay=false}) => {

    const authContext = useContext(KeyCloakContext)

    function intersect(a, b) {
        let setB = new Set(b);
        return [...new Set(a)].filter(x => setB.has(x));
    }

    const isAllowed = () => {
        return intersect(authContext?.state?.roles, roles).length > 0;
    }

    return (
        isAllowed() || alwaysDisplay ?
            <div className={`${collapsed ? "MenuCollapsedRow" : "MenuRow"} ${app.currentRoute === route ? "active" : ""}`} onClick={onClick} style={style}><span className="Icon">{icon}</span>{!collapsed ? <span className="Label">{label}</span> : <span className="Label">{label}</span>}</div>
            :
            null
    )
}

function MainMenu({app, showAlert, changeRoute, onContextChange}) {

    const theme = useTheme()

    const [collapsed, setCollapsed] = useState(false);
    const confirm = useConfirm()
    const location = useLocation();
    const pathname = location.pathname
    const navigate = useNavigate();

    const context = useContext(DataContext)

    const {request} = useRequest()

    useEffect(() => {
        changeRoute({route: pathname})
    }, [changeRoute, pathname])

    const go = (url) => {
        return () => navigate(urlPrefix(url));
    }



    const handleVersionWindow = async () => {
        try {

            const response = await request({
                url: '/info/version/details',
                method: "get"
            })

            const message = <>

                <b>Frontend Version:</b> {version()}<br/>
                <b>Backend Version: </b> {response?.data?.version}.{response?.data?.name}<br/>
                <b>DB Version: </b> {response?.data?.db_version}<br/>
                <b>API context: </b> {response?.data?.production ? "public": "private"}<br/>
                <b>API instance ID: </b> {response?.data?.instance}<br/>
                <b>DATA context: </b> {getDataContextHeader("unknown")} <br/>
                <b>GUI: </b> mode: {envs.withDeployment}, updates on production: {envs.allowUpdatesOnProduction ? "yes" : "no"}<br/><br />

                <b>Owner: </b> {response?.data?.owner}<br/>
                <b>Licenses: </b>{response?.data?.licenses.join(", ")}<br/>
                <b>Expires: </b>{response?.data?.expires}<br/><br />
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
                <div className="Version">v. {version()}
                    <RestrictToMode mode="with-deployment">
                        <Restrict roles={['admin']}>
                            <Restrict roles={['maintainer']}>
                            <span className="Context" style={{marginLeft: 5}}><ServerContextTag context={context}
                                                                                                onContextChange={onContextChange}/></span>
                            </Restrict>
                        </Restrict>
                    </RestrictToMode>
                </div>
            </div>
    }

    const style = {backgroundColor: theme.palette.primary.main, color: "#fff"}

    return <div style={style} className={collapsed ? "MainMenu CollapsedMainMenu": "MainMenu FullMainMenu"}>
        <div>
            <Branding collapsed={collapsed}/>
            <div>
                <MenuRow app={app} icon={<BsHouse size={20}/>} label="Dashboard" collapsed={collapsed} onClick={go("/dashboard")} route="/dashboard" roles={["admin", "developer", "marketer", "maintainer"]} style={{marginBottom: 20}}/>

                {!window?.CONFIG?.menu?.inbound?.disable && <MenuRow app={app} icon={<BsBoxArrowInRight size={20}/>} label="Inbound Traffic" collapsed={collapsed} onClick={go("/inbound")} route="/inbound" roles={["admin", "developer"]}/>}
                {!window?.CONFIG?.menu?.transformations?.disable && <MenuRow app={app} icon={<FlowNodeIcons icon="map-properties"  size={20}/>} label="Mapping" collapsed={collapsed} onClick={go("/transformations")} route="/transformations" roles={["admin", "developer"]}/>}

                {!window?.CONFIG?.menu?.identification?.disable && <MenuRow app={app} icon={<FlowNodeIcons icon="identity"  size={20}/>} label="Identification" collapsed={collapsed} onClick={go("/identification")} route="/identification" roles={["admin", "developer"]}/>}
                {!window?.CONFIG?.menu?.data?.disable && <MenuRow app={app} icon={<BsFolder size={20}/>} label="Data" collapsed={collapsed} onClick={go("/data")} route="/data" roles={["admin", "developer", "marketer"]}/>}
                {!window?.CONFIG?.menu?.outbound?.disable && <MenuRow app={app} icon={<BsBoxArrowRight size={20}/>} label="Outbound Traffic" collapsed={collapsed} onClick={go("/outbound")} route="/outbound" roles={["admin", "developer"]}/>}

                {!window?.CONFIG?.menu?.audience?.disable && <MenuRow app={app} icon={<VscOrganization size={20}/>} label="Audience" collapsed={collapsed} onClick={go("/audience")} route="/audience" roles={["admin", "developer", "marketer"]} style={{marginTop: 20}}/>}
                {!window?.CONFIG?.menu?.integration?.disable && <MenuRow app={app} icon={<BsGear size={20}/>} label="Automation" collapsed={collapsed} onClick={go("/processing")} route="/processing" roles={["admin", "developer"]}/>}
                {/*{!window?.CONFIG?.menu?.triggers?.disable && <MenuRow app={app} icon={<BsPlayCircle size={20}/>} label="Triggers" collapsed={collapsed} onClick={go("/triggers")} route="/triggers" roles={["admin", "developer"]} />}*/}
                {/*{!window?.CONFIG?.menu?.segmentation?.disable && <MenuRow app={app} icon={<VscOrganization size={20}/>} label="Segmentation" collapsed={collapsed} onClick={go("/segmentation")} route="/segmentation" roles={["admin", "developer", "marketer"]} />}*/}

                {/*{!window?.CONFIG?.menu?.routing?.disable && <MenuRow app={app} icon={<FaUncharted size={20}/>} label="Routing" collapsed={collapsed} onClick={go("/routing")} route="/routing" roles={["admin", "developer"]} style={{marginTop: 20}}/>}*/}
                {/*{!window?.CONFIG?.menu?.metrics?.disable && <MenuRow app={app} icon={<VscDashboard size={20}/>} label="Metrics" collapsed={collapsed} onClick={go("/metrics")} route="/metrics" roles={["admin", "developer"]} />}*/}
                {!window?.CONFIG?.menu?.reporting?.disable && <MenuRow app={app} icon={<BsBarChartFill size={20}/>} label="Reporting" collapsed={collapsed} onClick={go("/reporting")} route="/reporting" roles={["admin", "developer", "marketer"]} style={{marginTop: 20}}/>}
                {!window?.CONFIG?.menu?.subscription?.disable && <MenuRow app={app} icon={<BsPersonLinesFill size={20}/>} label="Subscriptions" collapsed={collapsed} onClick={go("/subscription")} route="/subscription" roles={["admin", "developer", "marketer"]} />}

                {!window?.CONFIG?.menu?.resources?.disable && <MenuRow app={app} icon={<IoServerOutline size={20}/>} label="Resources" collapsed={collapsed} onClick={go("/resources")} route="/resources" roles={["admin", "developer"]} />}

                {!window?.CONFIG?.menu?.test?.disable && <MenuRow app={app} icon={<BsClipboardCheck size={20}/>} label="Tests" collapsed={collapsed} onClick={go("/test/form")} route="/test/form" roles={["admin", "developer"]} style={{marginTop: 20}}/>}


            </div>
        </div>
        <div>
            {!window?.CONFIG?.menu?.monitoring?.disable && <MenuRow app={app} icon={<VscPulse size={20}/>}
                                                                    label="Monitoring"
                                                                    collapsed={collapsed}
                                                                    onClick={go("/monitoring")}
                                                                    route="/monitoring"
                                                                    roles={["admin"]}/>}
            {!window?.CONFIG?.menu?.maintenance?.disable && <MenuRow app={app} icon={<VscTools size={20}/>}
                                                                     label="Maintenance"
                                                                     collapsed={collapsed}
                                                                     onClick={go("/maintenance")}
                                                                     route="/maintenance"
                                                                     roles={["admin", "maintainer"]}
                                                                     style={{marginBottom: 20}}
            />}
            {/*{!window?.CONFIG?.menu?.import?.disable && <MenuRow app={app} icon={<BsFileEarmarkArrowUp size={20}/>}*/}
            {/*                                                    label="Import"*/}
            {/*                                                    collapsed={collapsed}*/}
            {/*                                                    onClick={go("/import")}*/}
            {/*                                                    route="/import"*/}
            {/*                                                    roles={["admin", "developer"]}*/}
            {/*                                                    style={{marginBottom: 20}}*/}
            {/*/>}*/}

            <MenuRow app={app}
                     icon={collapsed ? <BiChevronRightCircle size={20}/> : <BiChevronLeftCircle size={20}/>}
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