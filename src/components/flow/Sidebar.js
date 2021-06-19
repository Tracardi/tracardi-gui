import React, {useEffect, useState} from 'react';
import './Sidebar.css';
import FlowMenuNode from "./FlowMenuNode";
import TextField from "@material-ui/core/TextField";
import {BsPlusCircle} from "@react-icons/all-files/bs/BsPlusCircle";
import IconButton from "../elements/misc/IconButton";
import Popover from "@material-ui/core/Popover";
import ModuleRegisterForm from "./ModuleRegisterForm";
import {request} from "../../remote_api/uql_api_endpoint";
import {connect} from "react-redux";
import {showAlert} from "../../redux/reducers/alertSlice";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";

function Sidebar({filter, showAlert}) {

    const [showResisterPopOver, setShowResisterPopOver] = useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [plugins, setPlugins] = useState(null);
    const [pluginsLoading, setPluginsLoading] = useState(false);
    const [refresh, setRefresh] = useState(Math.random)

    useEffect(() => {
        setPluginsLoading(true);
        request({
                url: "/flow/action/plugins?query=*not-hidden" + refresh,
            },
            setPluginsLoading,
            (e) => {
                if (e) {
                    showAlert({message: e[0].msg, type: "error", hideAfter: 4000});
                }
            },
            (response) => {
                console.log(response.data)
                if(response) {
                    setPlugins(response.data);
                }
            })
    }, [showAlert, refresh])

    const onDragStart = (event, data) => {
        event.dataTransfer.setData('application/json', JSON.stringify(data));
        event.dataTransfer.effectAllowed = 'move';
    };

    const onRegisterClick = (event) => {
        console.log(event);
        setAnchorEl(event.currentTarget);
        setShowResisterPopOver(true);
    }

    const handlePopoverClose = () => {
        setShowResisterPopOver(false);
        setAnchorEl(null);
        setPlugins(null);
        setRefresh(Math.random);
    };

    return (
        <React.Fragment>
            <div className="TaskFilter">
                <TextField id="actions" label="Action filter"
                    // value={filterTask}
                    // onChange={(ev) => setFilterTask(ev.target.value)}
                           size="small"
                           fullWidth
                           style={{width: "100%"}}
                />
            </div>
            <div className="TaskNodes">
                <div>
                    {pluginsLoading && <CenteredCircularProgress/>}
                    {
                        plugins?.total > 0 && Object.entries(plugins?.grouped).map(([category,plugs], index) => {
                            return <>
                                <p key={index}>{category}</p>
                                {plugs.map((row, subIndex) => {
                                    return <FlowMenuNode key={index+"-"+subIndex} data={row.plugin} onDragStart={onDragStart} draggable/>
                                })}
                            </>
                        })
                    }
                </div>
                <div style={{textAlign: "right"}}>
                    <IconButton onClick={onRegisterClick} label="Register action">
                        <BsPlusCircle size={20} />
                    </IconButton>
                    <Popover
                        id="register"
                        open={showResisterPopOver}
                        anchorEl={anchorEl}
                        onClose={handlePopoverClose}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                    >
                        <ModuleRegisterForm onReady={handlePopoverClose}/>
                    </Popover>
                </div>
            </div>
        </React.Fragment>
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