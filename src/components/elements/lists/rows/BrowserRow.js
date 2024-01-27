import React, {useState} from 'react';
import FlowNodeIcons from "../../../flow/FlowNodeIcons";
import {BsGear} from "react-icons/bs";
import IconButton from "../../misc/IconButton";
import TuiTags from "../../tui/TuiTags";
import {StatusPoint} from "../../misc/StatusPoint";
import DeployButton from "../../forms/buttons/DeploymentButton";
import {getError} from "../../../../remote_api/entrypoint";
import {connect} from "react-redux";
import {showAlert} from "../../../../redux/reducers/alertSlice";
import {useConfirm} from "material-ui-confirm";
import {useRequest} from "../../../../remote_api/requestClient";

const BrowserRow = ({showAlert, id, data: _data, icon, onClick, deleteEndpoint, onSettingsClick, deplomentTable=null, tags, children, status, lock}) => {

    const [data, setData] = useState({..._data, icon})
    const [display, setDisplay] = useState(true)
    const [run, setRun] = useState(data?.running)
    const [deployed, setDeployed] = useState(data?.production === true)

    const description = children ? children : data.description
    const confirm = useConfirm();
    const {request} = useRequest()

    const handleDelete = async (id) => {
        confirm({title: "Do you want to delete this record?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        const response  = await request({
                            url: deleteEndpoint + id,
                            method: "delete"
                        })

                        const _deleted = response.data[0]
                        const _objectInOtherContext = response.data[1]

                        if(_deleted === true) {
                            if(_objectInOtherContext === null) {
                                // Everything is deleted
                                setDisplay(false)
                            } else {
                                setData({..._objectInOtherContext, icon})
                                if(data?.production === false){
                                    setRun(true)
                                    setDeployed(true)
                                } else {
                                    setRun(false)
                                    setDeployed(false)
                                }

                            }
                        }

                    } catch (e) {
                        console.error(e)
                    }
                }
            ).catch(_=>{})
    }

    const handleDeploy = async () => {
        if (deplomentTable === null) {
            confirm({
                title: "No deployment!",
                description: "This action has no deployment process."
            })
                .then(() => {

                }).catch(_ => {
            })
            return
        }
        try {
            const response = await request({
                url: `/deploy/${deplomentTable}/${id}`,
                method: "get"
            })
            setDeployed(response.data)
            setRun(response.data)
        } catch (e) {
            showAlert({type: "error", message: getError(e)[0].msg, hideAfter: 3000})
        }
    }


    const handleUnDeploy = async () => {
        confirm({
            title: "Do you want to delete this record from production!",
            description: "This action will delete this record from production and it can not be reverted."
        })
            .then(() => {
                request({
                    url: `/undeploy/${deplomentTable}/${id}`,
                    method: "GET"
                })
                    .then((response) => {
                        setDisplay(response.data);
                        if(response.data === true) {
                            setRun(false)
                        }
                    }).catch(e => {
                    showAlert({type: "error", message: getError(e)[0].msg, hideAfter: 3000})
                })
            }).catch(_ => {
        })
    }

    const render = () => <div style={{display: "flex", flexDirection: "row", width: "100%", alignItems: "center", borderBottom: "solid 1px rgba(128,128,128,.3)", padding: "0 10px"}}>
        <div
            style={{
                display: "flex",
                width: "100%",
                cursor: "pointer",
                fontSize: 14,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "10px 0"
            }}
            onClick={(ev) => {
                onClick(id)
            }}
        >

            <div style={{display: "flex", alignItems: "center", width: "auto"}}>
                <span style={{opacity: "60%", display: "flex", width: 30}}><FlowNodeIcons icon={data?.icon} size={22}/></span>
                <div style={{display: "flex", flexDirection:"column", marginLeft: 10, gap: 5}}>
                    <div className="flexLine" style={{fontSize: 18, marginRight: 5, fontWeight: 500}}>{data.name}</div>
                    {description && <div className="flexLine">{description}</div>}
                </div>
            </div>
            <div className="flexLine" style={{gap: 3}}>
                {Array.isArray(tags) && <TuiTags tags={tags} size="small"/>}
                {lock && <FlowNodeIcons icon="lock" size={22}/>}
                {typeof  status !== 'undefined'  && <StatusPoint status={status}/>}
            </div>

        </div>

        {onSettingsClick instanceof Function && <IconButton label={"Settings"}
                                                            style={{color:"black"}}
                                                            onClick={() => onSettingsClick(id)}>
            <BsGear size={20}/>
        </IconButton>}

        <DeployButton id={id}
                      draft={!deployed}
                      deployed={deployed}
                      running={run}
                      onDelete={handleDelete}
                      onUnDeploy={handleUnDeploy}
                      onDeploy={handleDeploy}
        />

    </div>

    return display && render()

}

export default connect(
    null,
    {showAlert}
)(BrowserRow)
