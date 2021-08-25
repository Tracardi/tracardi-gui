import React, {Suspense, useEffect, useState} from "react";
import './NodeDetails.css';
import {BsInfoCircle} from "@react-icons/all-files/bs/BsInfoCircle";
import {VscDebug} from "@react-icons/all-files/vsc/VscDebug";
import IconButton from "../elements/misc/IconButton";
import {GoSettings} from "@react-icons/all-files/go/GoSettings";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import {VscBook} from "@react-icons/all-files/vsc/VscBook";
import ActionDebugBox from "./ActionDebugBox";
import {VscListTree} from "@react-icons/all-files/vsc/VscListTree";
import ConsoleView from "../elements/misc/ConsoleView";
import ConfigEditor from "./editors/ConfigEditor";
import NodeInfo from "./NodeInfo";
import FilterTextField from "../elements/forms/inputs/FilterTextField";
import {FlowProfiling} from "./FlowProfiling";
import {IoIosTimer} from "@react-icons/all-files/io/IoIosTimer";
import convertNodesToProfilingData from "./profilingConverter";

const MdManual = React.lazy(() => import('./actions/MdManual'));

export default function NodeDetails({node, nodes, onConfig, onLabelSet, onConnectionDetails}) {

    const [tab, setTab] = useState(0);

    useEffect(() => {
            if(tab === 1 && !node?.data?.debugging) {
                setTab(0)
            }

            if(tab === 4 && !node?.data?.spec?.manual) {
                setTab(0)
            }

            if(tab === 2 && !node?.data?.spec?.init) {
                setTab(0)
            }
        },
        [node, tab])

    const onConfigSave = (config) => {
        node.data.spec.init = config
        if (onConfig) {
            onConfig(config)
        }
    }

    return <aside className="NodeDetails">
        <div className="Title">
            <FilterTextField label={null}
                                 initValue={node?.data?.metadata?.name}
                                 onSubmit={onLabelSet}
                                 onChange={(event) => onLabelSet(event.target.value)}/>
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
                {node?.data?.debugging && <IconButton
                    label="Profile"
                    onClick={() => setTab(5)}
                    selected={tab === 5}>
                    <IoIosTimer size={22}/>
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
            {tab === 0 && <NodeInfo node={node} onLabelSet={onLabelSet}/>}
            {tab === 1 && <ActionDebugBox
                debugging={node?.data?.debugging}
                onConnectionDetails={onConnectionDetails}
            />}
            {tab === 2 && node?.data?.spec?.init &&
            <ConfigEditor
                config={node?.data?.spec?.init}
                manual={node?.data?.spec?.manual}
                onConfig={onConfigSave}
            />}
            {tab === 3 && <ConsoleView label="Action raw data" data={node} />}
            {tab === 5 && <FlowProfiling
                profilingData={convertNodesToProfilingData(nodes)}
                node={node}
                onCallSelect={(nodeId, edgeId) => {
                    if(onConnectionDetails) {
                        onConnectionDetails(nodeId, edgeId)
                    }
                }}
            />}
            {tab === 4 && <Suspense fallback={<CenteredCircularProgress/>}>
                <MdManual mdFile={node?.data?.spec?.manual}/>
            </Suspense>}
        </div>
    </aside>
}