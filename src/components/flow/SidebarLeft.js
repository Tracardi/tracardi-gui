import React, {useEffect, useState} from 'react';
import './SidebarLeft.css';
import FlowMenuNode from "./FlowMenuNode";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import FilterTextField from "../elements/forms/inputs/FilterTextField";
import {FlowEditorIcons} from "./FlowEditorButtons";
import {asyncRemote} from "../../remote_api/entrypoint";
import ResponsiveDialog from "../elements/dialog/ResponsiveDialog";
import Button from "../elements/forms/Button";
import {BsXCircle} from "react-icons/bs";
import MdManual from "./actions/MdManual";

function SidebarLeft({showAlert, onDebug, debugInProgress}) {

    const [filterActions, setFilterActions] = useState("*not-hidden");
    const [plugins, setPlugins] = useState(null);
    const [pluginsLoading, setPluginsLoading] = useState(false);
    const [manual, setManual] = useState(null);

    useEffect(() => {
        let isSubscribed = true

        setPluginsLoading(true);
        asyncRemote({
                url: "/flow/action/plugins?rnd=" + Math.random() + "&query=" + filterActions
            }
        ).then(
            (response) => {
                if (response && isSubscribed) {
                    setPlugins(response.data);
                }
            }
        ).catch(
            (e) => {
                if (e && isSubscribed) {
                    if (e.length > 0) {
                        showAlert({message: e[0].msg, type: "error", hideAfter: 4000});
                    }
                }
            }
        ).finally(
            () => {
                if (isSubscribed) {
                    setPluginsLoading(false);
                }
            }
        )
        return () => isSubscribed = false
    }, [showAlert, filterActions])

    const onDragStart = (event, row) => {
        const data = row.plugin;
        event.dataTransfer.setData('application/json', JSON.stringify(data));
        event.dataTransfer.effectAllowed = 'move';
    };

    const handleDoubleClick = (row) => {
        setManual(row?.plugin?.spec?.manual);
    }

    const DocumentationDialog = () => {
        if(manual === null) {
            return ""
        }
        return <ResponsiveDialog title="Node documentation"
                                 open={manual !== null}
                                 button={<Button label="Close"
                                                 icon={<BsXCircle size={20}/>}
                                                 onClick={() => setManual(null)}/>}>
            <MdManual mdFile={manual}/>
        </ResponsiveDialog>
    }

    return (
        <div className="SidebarSection">
            <div className="TaskFilter">
                <FlowEditorIcons onDebug={onDebug}
                                 debugInProgress={debugInProgress}/>
                <FilterTextField label="Action filter" variant="standard" onSubmit={setFilterActions}/>
            </div>
            <div className="TaskNodes">
                <div>
                    {pluginsLoading && <CenteredCircularProgress/>}
                    {
                        plugins?.total > 0 && Object.entries(plugins?.grouped).map(([category, plugs], index) => {
                            return <div key={index}>
                                <p>{category}</p>
                                {plugs.map((row, subIndex) => {
                                    return <FlowMenuNode key={index + "-" + subIndex}
                                                         row={row}
                                                         onDoubleClick={()=> handleDoubleClick(row)}
                                                         onDragStart={onDragStart}
                                                         draggable/>
                                })}
                            </div>
                        })
                    }
                </div>
            </div>
            <DocumentationDialog />
        </div>
    );
};

const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert}
)(SidebarLeft)