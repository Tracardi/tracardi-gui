import React, {Suspense, useState} from "react";
import './NodeDetails.css';
import {BsInfoCircle} from "@react-icons/all-files/bs/BsInfoCircle";
import {VscDebug} from "@react-icons/all-files/vsc/VscDebug";
import IconButton from "../elements/misc/IconButton";
import {GoSettings} from "@react-icons/all-files/go/GoSettings";
import {ObjectInspector} from "react-inspector";
import {CgListTree} from "@react-icons/all-files/cg/CgListTree";
import Properties from "../elements/details/DetailProperties";
import ConfigEditor from "./ConfigEditor";
import NodeDebugConsole from "./NodeDebugConsole";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import {VscBook} from "@react-icons/all-files/vsc/VscBook";
const MdManual = React.lazy(() => import('./actions/MdManual'));

export default function NodeDetails({node, onConfig}) {

    const [tab, setTab] = useState(0);

    const onConfigSave= (config) => {
        node.data.spec.init = config
        if(onConfig) {
            onConfig(config)
        }
    }

    const renderInfo = () => {
        return <div>
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
            <div className="SubTitle"><span><span style={{fontWeight: 600}}>Action</span> Manual</span></div>
            <div className="InfoBox">{node?.data?.metadata?.desc}</div>
        </div>
    }

    return <aside className="TaskDetails" style={{display: "flex"}}>

        <div className="Pane">
            <div className="Title">
                <span style={{display: "flex"}} className="TitleText">{node?.data?.metadata?.name} {node?.id}</span>
                <span>
                    <IconButton
                        label="Info"
                        onClick={() => setTab(0)}
                        selected={tab===0}>
                        <BsInfoCircle size={20}/>
                    </IconButton>
                    {node?.data?.spec?.manual && <IconButton
                        label="Manual"
                        onClick={() => setTab(4)}
                        selected={tab===4}>
                        <VscBook size={20}/>
                    </IconButton>}
                    <IconButton
                        label="Config"
                        onClick={() => setTab(2)}
                        selected={tab===2}>
                        <GoSettings size={20}/>
                    </IconButton>
                    <IconButton
                        label="Debug"
                        onClick={() => setTab(1)}
                        selected={tab===1}>
                        <VscDebug size={20}/>
                    </IconButton>
                    <IconButton
                        label="Raw"
                        onClick={() => setTab(3)}
                        selected={tab === 3}>
                        <CgListTree size={20}/>
                    </IconButton>

                </span>
            </div>
            <div className="Content">
                {tab === 0 && renderInfo()}
                {tab === 1 && <NodeDebugConsole nodes={node?.data?.debugging}/>}
                {tab === 2 && <ConfigEditor config={node?.data?.spec?.init} onConfig={onConfigSave}/> }
                {tab === 3 && <div style={{margin: 10}}><ObjectInspector data={node}/></div> }
                {tab === 4 && <Suspense fallback={<CenteredCircularProgress/>}>
                    <MdManual mdFile={node?.data?.spec?.manual}/>
                </Suspense> }
            </div>
        </div>
    </aside>
}