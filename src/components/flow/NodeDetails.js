import React, {useEffect, useState} from "react";
import './NodeDetails.css';
import {BsInfoCircle} from "@react-icons/all-files/bs/BsInfoCircle";
import IconButton from "../elements/misc/IconButton";
import {GoSettings} from "@react-icons/all-files/go/GoSettings";
import ConsoleView from "../elements/misc/ConsoleView";
import NodeInfo from "./NodeInfo";
import FilterTextField from "../elements/forms/inputs/FilterTextField";
import {VscJson} from "@react-icons/all-files/vsc/VscJson";
import "../elements/forms/JsonForm"
import {VscTools} from "@react-icons/all-files/vsc/VscTools";
import {NodeInitForm, NodeInitJsonForm} from "../elements/forms/NodeInitForm";
import {TracardiProPluginForm} from "../elements/forms/TracardiProPluginForm";
import {BsStar} from "@react-icons/all-files/bs/BsStar";

export function NodeDetails({node, onConfig, onLabelSet}) {

    const [tab, setTab] = useState(3);

    useEffect(() => {

            if (tab === 1 && !node?.data?.spec?.manual) {
                setTab(0)
            }

            if (tab === 5 && node?.data?.metadata?.pro !== true) {
                setTab(3)
            }

            if (tab === 3 && !node?.data?.spec?.form) {
                if(node?.data?.metadata?.pro === true) {
                    setTab(5)
                } else {
                    setTab(2)
                }
            }

            if (tab === 2 && !node?.data?.spec?.init) {
                setTab(0)
            }

        },
        [node, tab])

    const handleSubmit = (init) => {
        if(onConfig){
            onConfig(init)
        }
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
                {node?.data?.metadata?.pro === true && <IconButton
                    label="Service Editor"
                    onClick={() => setTab(5)}
                    selected={tab === 5}>
                        <BsStar size={22}/>
                </IconButton>}
                {node?.data?.spec?.init && <IconButton
                    label="Json Config"
                    onClick={() => setTab(2)}
                    selected={tab === 2}>
                    <VscTools size={22}/>
                </IconButton>}
                <IconButton
                    label="Raw"
                    onClick={() => setTab(4)}
                    selected={tab === 4}>
                        <VscJson size={22}/>
                </IconButton>


                </span>
        </div>
        <div className="Pane">
            {tab === 0 && <NodeInfo node={node} onLabelSet={onLabelSet}/>}
            {tab === 2 && node?.data?.spec?.init &&
            <NodeInitJsonForm
                pluginId={node?.data?.spec?.id}
                formSchema={node?.data?.spec?.form}
                init={node?.data?.spec?.init}
                manual={node?.data?.spec?.manual}
                onSubmit={handleSubmit}
            />}
            {tab === 3 && node?.data?.spec?.form &&
            <NodeInitForm
                pluginId={node?.data?.spec?.id}
                init={node?.data?.spec?.init}
                formSchema={node?.data?.spec?.form}
                onSubmit={handleSubmit}
            />}

            {tab === 4 && <ConsoleView label="Action raw data" data={node}/>}

            {node?.data?.metadata?.pro === true && tab === 5 && <TracardiProPluginForm
                init={node?.data?.spec?.init}
                onSubmit={handleSubmit}
            />
            }

        </div>
    </div>
}

function areEqual(prevProps, nextProps) {
    return prevProps.node.id===nextProps.node.id;
}
export const MemoNodeDetails = React.memo(NodeDetails, areEqual);

