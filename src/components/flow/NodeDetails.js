import React, {useEffect, useState} from "react";
import './NodeDetails.css';
import {BsInfoCircle, BsBook} from "react-icons/bs";
import IconButton from "../elements/misc/IconButton";
import ConsoleView from "../elements/misc/ConsoleView";
import NodeInfo from "./NodeInfo";
import FilterTextField from "../elements/forms/inputs/FilterTextField";
import {VscJson} from "react-icons/vsc";
import "../elements/forms/JsonForm"
import {VscDebugConsole, VscSettings, VscRunErrors, VscGear} from "react-icons/vsc";
import {MemoNodeInitForm, NodeInitJsonForm, NodeRuntimeConfigForm} from "../elements/forms/NodeInitForm";
import NodeMicroserviceForm from "./NodeMicroserviceForm";
import MdManual from "./actions/MdManual";
import NodeLogDetails from "../elements/details/NodeLogDetails";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../elements/tui/TuiForm";
import Drawer from "@mui/material/Drawer";
import {useTheme} from "@mui/material";

export function NodeDetails({node, onConfig, onRuntimeConfig, onLabelSet, onMicroserviceChange}) {

    const [tab, setTab] = useState(3);
    const [displayManual, setDisplayManual] = useState(false);

    const theme = useTheme()

    useEffect(() => {

            if (tab === 3) {
                if (node.data.metadata.remote === false && !node?.data?.spec?.form) {
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

    const iconColor = {color: theme.palette.mode==="dark" ? theme.palette.common.black: null}

    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            width: 640,
            height: "100%"
        }}>
            <div className="NodeDetails">
                <div className="NodeDetailsIcons" style={{width: 60, overflow: "auto"}}>
                    <div>
                        <IconButton label="Info" onClick={() => setTab(0)} selected={tab === 0} size="large">
                            <BsInfoCircle size={22} style={iconColor}/>
                        </IconButton>

                        {(node?.data?.spec?.form || node?.data?.metadata?.remote === true) && <IconButton
                            label="Configuration Editor"
                            onClick={() => setTab(3)}
                            selected={tab === 3}
                            size="large">
                            <VscSettings size={22} style={iconColor}/>
                        </IconButton>}
                        {node?.data?.spec?.init && <IconButton
                            label="Advanced JSON Configuration"
                            onClick={() => setTab(2)}
                            selected={tab === 2}
                            size="large">
                            <VscJson size={22} style={iconColor}/>
                        </IconButton>}
                        {node?.id && <IconButton
                            label="Node console log"
                            onClick={() => setTab(5)}
                            selected={tab === 5}
                            size="large">
                            <VscRunErrors size={22} style={iconColor}/>
                        </IconButton>}
                        {node?.data?.metadata && <IconButton
                            label="Advanced Runtime Editor"
                            onClick={() => setTab(6)}
                            selected={tab === 6}
                            size="large">
                            <VscGear size={22} style={iconColor}/>
                        </IconButton>}
                        {(process.env.NODE_ENV && process.env.NODE_ENV === 'development') &&
                        <IconButton label="Raw" onClick={() => setTab(4)} selected={tab === 4} size="large">
                            <VscDebugConsole size={22} style={iconColor}/>
                        </IconButton>}
                    </div>
                    {node?.data?.spec?.manual && <div>
                        <IconButton label="Documentation" onClick={() => setDisplayManual(!displayManual)}
                                    selected={displayManual} size="large">
                            <BsBook size={22} style={iconColor}/>
                        </IconButton>
                    </div>}

                </div>
                <div className="NodeDetailsContent" style={{width: 580, backgroundColor: theme.palette.common.white}}>
                    <div className="Title">
                        <FilterTextField label="Node name"
                                         initValue={node?.data?.metadata?.name}
                                         onSubmit={onLabelSet}
                        />
                    </div>
                    <div className="Pane" style={{height: "calc(100% - 70px)"}}>
                        {tab === 0 && <NodeInfo node={node} onLabelSet={onLabelSet}/>}

                        {tab === 2 && node?.data?.spec?.init &&
                        <NodeInitJsonForm
                            spec={node?.data?.spec}
                            onSubmit={handleInitSubmit}
                        />}

                        {tab === 3 && node?.data?.spec?.form && node?.data?.metadata?.remote === false &&
                        <MemoNodeInitForm
                            nodeId={node?.id}
                            spec={node?.data?.spec}
                            onSubmit={handleInitSubmit}
                        />}

                        {tab === 3 && node?.data?.metadata?.remote === true &&
                        <NodeMicroserviceForm
                            node={node}
                            onMicroserviceChange={onMicroserviceChange}
                            onSubmit={handleInitSubmit}/>}

                        {tab === 4 && (process.env.NODE_ENV && process.env.NODE_ENV === 'development') &&
                        <ConsoleView label="Action raw data" data={node}/>}

                        {tab === 5 && <TuiForm style={{height: "inherit"}}>
                            <TuiFormGroup>
                                <TuiFormGroupHeader header="Node console log" description="Node log has only information from
                                 workflow that runs in testing mode or in production.
                                 There is no information here from your debugging. See the debugger log for logs from debugging."/>
                                <TuiFormGroupContent style={{padding: 0}}>
                                    <NodeLogDetails nodeId={node?.id}/>
                                </TuiFormGroupContent>
                            </TuiFormGroup>
                        </TuiForm>}

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
                <Drawer
                    PaperProps={{
                        sx: {
                            borderRadius: "15px",
                            margin: "10px",
                            height: "calc(100% - 20px)",
                            backgroundColor: theme.palette.common.white,
                            boxShadow: "0px 0px 14px -6px rgba(66, 68, 90, 1)"
                        }
                    }}
                    hideBackdrop={true}
                    anchor="left"
                    variant="persistent"
                    open={node?.data?.spec?.manual && displayManual}
                    onClose={()=>setDisplayManual(false)}
                    >
                    {node?.data?.spec?.manual && displayManual &&

                        <div style={{width: 660}}>
                            <MdManual mdFile={node?.data?.spec?.manual} style={{padding: 20}}/>
                        </div>
                    }
                </Drawer>

            </div>
        </div>

    );
}

function areEqual(prevProps, nextProps) {
    return prevProps.node.id === nextProps.node.id;
}

export const MemoNodeDetails = React.memo(NodeDetails, areEqual);

