import React, {Suspense, useEffect, useState} from "react";
import './NodeDetails.css';
import {BsInfoCircle} from "@react-icons/all-files/bs/BsInfoCircle";
import IconButton from "../elements/misc/IconButton";
import {GoSettings} from "@react-icons/all-files/go/GoSettings";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import {VscBook} from "@react-icons/all-files/vsc/VscBook";
import {VscListTree} from "@react-icons/all-files/vsc/VscListTree";
import ConsoleView from "../elements/misc/ConsoleView";
import ConfigEditor from "./editors/ConfigEditor";
import NodeInfo from "./NodeInfo";
import FilterTextField from "../elements/forms/inputs/FilterTextField";
import {VscJson} from "@react-icons/all-files/vsc/VscJson";
import MemoJsonForm from "../elements/forms/JsonForm";

const MdManual = React.lazy(() => import('./actions/MdManual'));

function NodeDetails({node, onConfig, onLabelSet}) {

    const [tab, setTab] = useState(0);

    useEffect(() => {

            if (tab === 1 && !node?.data?.spec?.manual) {
                setTab(0)
            }

            if (tab === 3 && !node?.data?.spec?.form) {
                setTab(2)
            }

            if (tab === 2 && !node?.data?.spec?.init) {
                setTab(0)
            }
        },
        [node, tab])

    const handleFormSubmit = (config) => {
        node.data.spec.init = config
        if (onConfig) {
            onConfig(config)
        }
        console.log("Config submit", config)
    }


    return <div className="NodeDetails">
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
                {node?.data?.spec?.form && <IconButton
                    label="Config Editor"
                    onClick={() => setTab(3)}
                    selected={tab === 3}>
                    <GoSettings size={22}/>
                </IconButton>}
                {node?.data?.spec?.init && <IconButton
                    label="Json Config"
                    onClick={() => setTab(2)}
                    selected={tab === 2}>
                    <VscJson size={22}/>
                </IconButton>}
                {node?.data?.spec?.manual && <IconButton
                    label="Manual"
                    onClick={() => setTab(1)}
                    selected={tab === 1}>
                    <VscBook size={22}/>
                </IconButton>}
                <IconButton
                    label="Raw"
                    onClick={() => setTab(4)}
                    selected={tab === 4}>
                        <VscListTree size={22}/>
                </IconButton>

                </span>
        </div>
        <div className="Pane">
            {tab === 0 && <NodeInfo node={node} onLabelSet={onLabelSet}/>}
            {tab === 1 && <Suspense fallback={<CenteredCircularProgress/>}>
                <MdManual mdFile={node?.data?.spec?.manual}/>
            </Suspense>}
            {tab === 2 && node?.data?.spec?.init &&
            <ConfigEditor
                config={node?.data?.spec?.init}
                manual={node?.data?.spec?.manual}
                onConfig={handleFormSubmit}
            />}
            {tab === 3 && node?.data?.spec?.form &&
            <MemoJsonForm
                pluginId={node?.data?.spec?.id}
                value={node?.data?.spec?.init}
                schema={node?.data?.spec?.form}
                onSubmit={handleFormSubmit}
            />}

            {tab === 4 && <ConsoleView label="Action raw data" data={node}/>}

        </div>
    </div>
}

function areEqual(prevProps, nextProps) {
    return prevProps.node.id===nextProps.node.id;
}
const MemoNodeDetails = React.memo(NodeDetails, areEqual);

export default MemoNodeDetails;