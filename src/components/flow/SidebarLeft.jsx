import React, {useEffect, useState} from 'react';
import './SidebarLeft.css';
import FlowMenuNode from "./FlowMenuNode";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import FilterTextField from "../elements/forms/inputs/FilterTextField";
import {FlowEditorIcons} from "./FlowEditorButtons";
import ResponsiveDialog from "../elements/dialog/ResponsiveDialog";
import Button from "../elements/forms/Button";
import {BsXCircle} from "react-icons/bs";
import MdManual from "./actions/MdManual";
import {useDebounce} from "use-debounce";
import HorizontalCircularProgress from "../elements/progress/HorizontalCircularProgress";
import {useRequest} from "../../remote_api/requestClient";
import useTheme from "@mui/material/styles/useTheme";

function SidebarLeft({showAlert, onDebug, debugInProgress, flowType}) {

    const [filterActions, setFilterActions] = useState("*not-hidden");
    const [debouncedFiltering] = useDebounce(filterActions, 500)
    const [plugins, setPlugins] = useState(null);
    const [pluginsLoading, setPluginsLoading] = useState(false);
    const [manual, setManual] = useState(null);

    const {request} = useRequest()
    const theme = useTheme();

    useEffect(() => {
        let isSubscribed = true

        if(!flowType) {
            return () => isSubscribed = false
        }

        setPluginsLoading(true);
        request({
                url: `/flow/action/plugins?flow_type=${flowType}&query=${debouncedFiltering}&rnd=${Math.random()}`
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
    }, [showAlert, debouncedFiltering, flowType])

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
                <FilterTextField label="Action filter"
                                 variant="standard"
                                 onSubmit={setFilterActions}
                                 onChange={(e) => setFilterActions(e.target.value)}/>
            </div>
            <div className="TaskNodes">
                <div>
                    {pluginsLoading && <div style={{display: "flex", justifyContent: "center", marginTop: 8}}><HorizontalCircularProgress label="Searching..."/></div>}
                    {
                        !pluginsLoading && <>{
                            plugins?.total > 0 ?
                            Object.entries(plugins?.grouped).map(([category, plugs], index) => {
                                return <div key={index}>
                                    <p style={{color: theme.palette.common.black}}>{category}</p>
                                    {plugs.map((row, subIndex) => {
                                        return <FlowMenuNode key={index + "-" + subIndex}
                                                            row={row}
                                                            onDoubleClick={()=> handleDoubleClick(row)}
                                                            onDragStart={onDragStart}
                                                            draggable/>
                                    })}
                                </div>
                            })
                            :
                            <div className="PluginsNotFoundMessage">
                                No plugins match your search criteria. Please check <span style={{fontWeight: 700}}>Extensions</span> tab in <a href="/resources#pro" className="ResourcesHref">Resources</a> section.
                            </div>
                        }</>
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