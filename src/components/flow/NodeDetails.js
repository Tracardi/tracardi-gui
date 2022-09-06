import React, {useEffect, useState} from "react";
import './NodeDetails.css';
import {BsInfoCircle} from "react-icons/bs";
import IconButton from "../elements/misc/IconButton";
import {GoSettings} from "react-icons/go";
import ConsoleView from "../elements/misc/ConsoleView";
import NodeInfo from "./NodeInfo";
import FilterTextField from "../elements/forms/inputs/FilterTextField";
import {VscJson} from "react-icons/vsc";
import "../elements/forms/JsonForm"
import {VscDebugConsole} from "react-icons/vsc";
import {MemoNodeInitForm, NodeInitJsonForm, NodeRuntimeConfigForm} from "../elements/forms/NodeInitForm";
import {VscRunErrors} from "react-icons/vsc";
import NodeMicroserviceForm from "./NodeMicroserviceForm";

export function NodeDetails({node, onConfig, onRuntimeConfig, onLabelSet, onMicroserviceChange}) {

    const [tab, setTab] = useState(3);

    useEffect(() => {

            if (tab === 3) {
                if(node.data.metadata.remote === false && !node?.data?.spec?.form) {
                    setTab(2)
                }
            }

            if (tab === 2 && !node?.data?.spec?.init) {
                setTab(0)
            }

        },
        [node, tab])

    const handleInitSubmit = (init) => {
        if (onConfig) {
            onConfig(init)
        }
    }

    return (
        <div className="NodeDetails">
            <div className="NodeDetailsIcons">
                <IconButton label="Info" onClick={() => setTab(0)} selected={tab === 0} size="large">
                    <BsInfoCircle size={22}/>
                </IconButton>
                {(node?.data?.spec?.form || node?.data?.metadata?.remote === true) && <IconButton
                    label="Configuration Editor"
                    onClick={() => setTab(3)}
                    selected={tab === 3}
                    size="large">
                    <GoSettings size={22}/>
                </IconButton>}
                {node?.data?.spec?.init && <IconButton
                    label="Advanced JSON Configuration"
                    onClick={() => setTab(2)}
                    selected={tab === 2}
                    size="large">
                    <VscJson size={22}/>
                </IconButton>}
                {node?.data?.metadata && <IconButton
                    label="Advanced Runtime Editor"
                    onClick={() => setTab(6)}
                    selected={tab === 6}
                    size="large">
                    <VscRunErrors size={22}/>
                </IconButton>}
                {(process.env.NODE_ENV && process.env.NODE_ENV === 'development') && <IconButton label="Raw" onClick={() => setTab(4)} selected={tab === 4} size="large">
                    <VscDebugConsole size={22}/>
                </IconButton>}
            </div>
            <div className="NodeDetailsContent">
                <div className="Title">
                    <FilterTextField label="Node name"
                                     initValue={node?.data?.metadata?.name}
                                     onSubmit={onLabelSet}
                    />

                </div>
                <div className="Pane">
                    {tab === 0 && <NodeInfo node={node} onLabelSet={onLabelSet}/>}

                    {tab === 2 && node?.data?.spec?.init &&
                    <NodeInitJsonForm
                        pluginId={node?.data?.spec?.id}
                        formSchema={node?.data?.spec?.form}
                        microservice={node?.data.spec?.microservice}
                        init={node?.data?.spec?.init}
                        manual={node?.data?.spec?.manual}
                        onSubmit={handleInitSubmit}
                    />}

                    {tab === 3 && node?.data?.spec?.form && node?.data?.metadata?.remote === false &&
                    <MemoNodeInitForm
                        nodeId={node?.id}
                        pluginId={node?.data?.spec?.id}
                        microservice={node?.data.spec?.microservice}
                        init={node?.data?.spec?.init}
                        formSchema={node?.data?.spec?.form}
                        onSubmit={handleInitSubmit}
                    />}

                    {tab === 3 && node?.data?.metadata?.remote === true &&
                    <NodeMicroserviceForm
                        node={node}
                        onMicroserviceChange={onMicroserviceChange}
                        onSubmit={handleInitSubmit} />}

                    {tab === 4 && (process.env.NODE_ENV && process.env.NODE_ENV === 'development') && <ConsoleView label="Action raw data" data={node}/>}

                    {tab === 6 && node?.data?.spec && <NodeRuntimeConfigForm
                        pluginId={node?.data?.spec?.id}
                        value={
                            {
                                skip: node?.data?.spec?.skip || false,
                                block_flow: node?.data?.spec?.block_flow || false,
                                on_connection_error_repeat: node?.data?.spec?.on_connection_error_repeat || "0",
                                run_in_background: node?.data?.spec?.run_in_background || false,
                                on_error_continue: node?.data?.spec?.on_error_continue || false,
                                join_input_payload: node?.data?.spec?.join_input_payload || false,
                                append_input_payload: node?.data?.spec?.append_input_payload || false,
                                run_once: node?.data?.spec?.run_once || {
                                    value: "",
                                    ttl: 0,
                                    type: "value",
                                    enabled: false
                                },
                            }
                        }
                        onChange={onRuntimeConfig}
                    />}

                </div>
            </div>
        </div>
    );
}

function areEqual(prevProps, nextProps) {
    return prevProps.node.id === nextProps.node.id;
}

export const MemoNodeDetails = React.memo(NodeDetails, areEqual);

