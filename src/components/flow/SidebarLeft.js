import React, {useEffect, useRef, useState} from 'react';
import './SidebarLeft.css';
import FlowMenuNode from "./FlowMenuNode";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import FilterTextField from "../elements/forms/inputs/FilterTextField";
import {FlowEditorIcons} from "./FlowEditorButtons";
import {asyncRemote} from "../../remote_api/entrypoint";

function SidebarLeft({showAlert, onDebug, debugInProgress}) {

    const [filterActions, setFilterActions] = useState("*not-hidden");
    const [plugins, setPlugins] = useState(null);
    const [pluginsLoading, setPluginsLoading] = useState(false);
    const [refresh, setRefresh] = useState(Math.random)

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    useEffect(() => {
        if (mounted) {
            setPluginsLoading(true);
            asyncRemote({
                    url: "/flow/action/plugins?rnd=" + refresh + "&query=" + filterActions
                }
            ).then(
                (response) => {
                    if (response) {
                        setPlugins(response.data);
                    }
                }
            ).catch(
                (e) => {
                    if (e) {
                        showAlert({message: e[0].msg, type: "error", hideAfter: 4000});
                    }
                }
            ).finally(
                () => {
                    if (mounted) {
                        setPluginsLoading(false);
                    }
                }
            )
        }
    }, [showAlert, refresh, filterActions])

    const onDragStart = (event, row) => {
        const data = row.plugin;
        event.dataTransfer.setData('application/json', JSON.stringify(data));
        event.dataTransfer.effectAllowed = 'move';
    };

    const onRegister = () => {
        setPlugins(null);
        setRefresh(Math.random);
    };

    return (
        <div className="SidebarSection">
            <div className="TaskFilter">
                <FlowEditorIcons onDebug={onDebug}
                                 onRegister={onRegister}
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
                                    return <FlowMenuNode key={index + "-" + subIndex} row={row}
                                                         onDragStart={onDragStart} draggable/>
                                })}
                            </div>
                        })
                    }
                </div>
            </div>
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