import React, {useEffect, useState} from 'react';
import './Sidebar.css';
import FlowMenuNode from "./FlowMenuNode";
import {BsPlusCircle} from "@react-icons/all-files/bs/BsPlusCircle";
import IconButton from "../elements/misc/IconButton";
import Popover from "@material-ui/core/Popover";
import ModuleRegisterForm from "./ModuleRegisterForm";
import {request} from "../../remote_api/uql_api_endpoint";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import FilterTextField from "../elements/forms/inputs/FilterTextField";
import {FlowEditorIcons} from "./FlowEditorButtons";

function Sidebar({showAlert, onEdit, onDebug}) {

    const [filterActions, setFilterActions] = useState("*not-hidden");
    const [showResisterPopOver, setShowResisterPopOver] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [plugins, setPlugins] = useState(null);
    const [pluginsLoading, setPluginsLoading] = useState(false);
    const [refresh, setRefresh] = useState(Math.random)

    useEffect(() => {
        setPluginsLoading(true);
        request({
                url: "/flow/action/plugins?rnd=" + refresh + "&query=" + filterActions
            },
            setPluginsLoading,
            (e) => {
                if (e) {
                    showAlert({message: e[0].msg, type: "error", hideAfter: 4000});
                }
            },
            (response) => {
                if (response) {
                    setPlugins(response.data);
                }
            })
    }, [showAlert, refresh, filterActions])

    const onDragStart = (event, data) => {
        event.dataTransfer.setData('application/json', JSON.stringify(data));
        event.dataTransfer.effectAllowed = 'move';
    };

    // const onRegisterClick = (event) => {
    //     setAnchorEl(event.currentTarget);
    //     setShowResisterPopOver(true);
    // }

    const onRegister = () => {
        setPlugins(null);
        setRefresh(Math.random);
    };

    return (
        <div className="SidebarSection">
            <div className="TaskFilter">
                <FlowEditorIcons onEdit={onEdit} onDebug={onDebug} onRegister={onRegister}/>
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
                                    return <FlowMenuNode key={index + "-" + subIndex} data={row.plugin}
                                                         onDragStart={onDragStart} draggable/>
                                })}
                            </div>
                        })
                    }
                </div>
                {/*<div style={{textAlign: "right"}}>*/}
                {/*    <IconButton onClick={onRegisterClick} label="Register action">*/}
                {/*        <BsPlusCircle size={20}/>*/}
                {/*    </IconButton>*/}
                {/*    <Popover*/}
                {/*        id="register"*/}
                {/*        open={showResisterPopOver}*/}
                {/*        anchorEl={anchorEl}*/}
                {/*        onClose={handlePopoverClose}*/}
                {/*        anchorOrigin={{*/}
                {/*            vertical: 'top',*/}
                {/*            horizontal: 'left',*/}
                {/*        }}*/}
                {/*        transformOrigin={{*/}
                {/*            vertical: 'bottom',*/}
                {/*            horizontal: 'left',*/}
                {/*        }}*/}
                {/*    >*/}
                {/*        <ModuleRegisterForm onReady={handlePopoverClose}/>*/}
                {/*    </Popover>*/}
                {/*</div>*/}
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
)(Sidebar)