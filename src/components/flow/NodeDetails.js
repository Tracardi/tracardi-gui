import React, {Suspense, useState} from "react";
import './NodeDetails.css';
import {BsInfoCircle} from "@react-icons/all-files/bs/BsInfoCircle";
import {VscDebug} from "@react-icons/all-files/vsc/VscDebug";
import IconButton from "../elements/misc/IconButton";
import {GoSettings} from "@react-icons/all-files/go/GoSettings";
import {ObjectInspector} from "react-inspector";
import Properties from "../elements/details/DetailProperties";
import ConfigEditor from "./ConfigEditor";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import {VscBook} from "@react-icons/all-files/vsc/VscBook";
import ActionDebugBox from "./ActionDebugBox";
import theme from "../../themes/inspector_light_theme";
import {VscListTree} from "@react-icons/all-files/vsc/VscListTree";
import ConsoleView from "../elements/misc/ConsoleView";


const MdManual = React.lazy(() => import('./actions/MdManual'));

export default function NodeDetails({node, onConfig}) {
    console.log(node)
    const [tab, setTab] = useState(0);

    const onConfigSave = (config) => {
        node.data.spec.init = config
        if (onConfig) {
            onConfig(config)
        }
    }

    const renderInfo = () => {
        return <div>
            <div className="InfoBox">{node?.data?.metadata?.desc}</div>
            <div className="SubTitle"><span><span style={{fontWeight: 600}}>Action</span> Details</span></div>
            <table>
                <tbody>
                <tr>
                    <td>Id</td>
                    <td>{node?.id}</td>
                </tr>
                <tr>
                    <td>Start acton</td>
                    <td>{node?.data?.start ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <td>Runs only in debug mode</td>
                    <td>{node?.data?.debug ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <td>Inputs</td>
                    <td>{node?.data?.spec?.inputs?.join(',')}</td>
                </tr>
                <tr>
                    <td>Outputs</td>
                    <td>{node?.data?.spec?.outputs?.join(',')}</td>
                </tr>
                <tr>
                    <td>Component</td>
                    <td>{node?.type}</td>
                </tr>
                <tr>
                    <td>Position</td>
                    <td>X:{node?.position?.x}, Y: {node?.position?.y}</td>
                </tr>
                <tr>
                    <td>Module</td>
                    <td>{node?.data?.spec?.module}</td>
                </tr>
                <tr>
                    <td>Class</td>
                    <td>{node?.data?.spec?.className}</td>
                </tr>
                <tr>
                    <td>Config</td>
                    <td><Properties properties={node?.data?.spec?.init}/></td>
                </tr>
                </tbody>
            </table>
        </div>
    }

    return <aside className="NodeDetails">
        <div className="Title">
            <span style={{display: "flex"}} className="TitleText">{node?.data?.metadata?.name}</span>
            <span>
                <IconButton
                    label="Info"
                    onClick={() => setTab(0)}
                    selected={tab === 0}>
                        <BsInfoCircle size={22}/>
                </IconButton>
                {node?.data?.spec?.manual && <IconButton
                    label="Manual"
                    onClick={() => setTab(4)}
                    selected={tab === 4}>
                    <VscBook size={22}/>
                </IconButton>}
                {node?.data?.spec?.init && <IconButton
                    label="Config"
                    onClick={() => setTab(2)}
                    selected={tab === 2}>
                    <GoSettings size={22}/>
                </IconButton>}
                {node?.data?.debugging && <IconButton
                    label="Debug"
                    onClick={() => setTab(1)}
                    selected={tab === 1}>
                        <VscDebug size={22}/>
                </IconButton>}
                <IconButton
                    label="Raw"
                    onClick={() => setTab(3)}
                    selected={tab === 3}>
                        <VscListTree size={22}/>
                </IconButton>

                </span>
        </div>
        <div className="Pane">
            {tab === 0 && renderInfo()}
            {tab === 1 && <ActionDebugBox calls={node?.data?.debugging}/>}
            {tab === 2 && node?.data?.spec?.init &&
            <ConfigEditor config={node?.data?.spec?.init} onConfig={onConfigSave}/>}
            {tab === 3 && <ConsoleView label="Action raw data" data={node} />}
            {tab === 4 && <Suspense fallback={<CenteredCircularProgress/>}>
                <MdManual mdFile={node?.data?.spec?.manual}/>
            </Suspense>}
        </div>
    </aside>
}