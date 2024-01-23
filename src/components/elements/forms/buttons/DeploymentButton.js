import {DisplayOnlyOnTestContext, RestrictToMode} from "../../../context/RestrictContext";
import Button from "../Button";
import React, {useState} from "react";
import {useRequest} from "../../../../remote_api/requestClient";
import {BsFillPlayCircleFill, BsTrash} from "react-icons/bs";
import IconButton from "../../misc/IconButton";
import Tag, {OnOverTag} from "../../misc/Tag";
import useTheme from "@mui/material/styles/useTheme";
import {useConfirm} from "material-ui-confirm";
import {connect} from "react-redux";
import {showAlert} from "../../../../redux/reducers/alertSlice";
import {getError} from "../../../../remote_api/entrypoint";

function DeployButton({showAlert, id, production, running, deplomentTable, onDelete}) {

    const [deployed, setDeployed] = useState(production === true)
    const [run, setRun] = useState(running)
    const {request} = useRequest()
    const confirm = useConfirm();

    const handleDeploy = async (deploy) => {
        if (!deploy) {
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
                            setDeployed(response.data);
                            setRun(response.data)
                        }).catch(e => {showAlert({type: "error", message: getError(e)[0].msg, hideAfter: 3000})})
                }).catch(_ => {})

        } else {
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
    }

    return <RestrictToMode mode="commercial">
        <DisplayOnlyOnTestContext>
            <span style={{marginLeft: 5, flexWrap: "nowrap", display: "flex"}}>

                {deployed
                    ?
                    <Button label="deployed" style={{width: 100}} disabled={true} onClick={() => handleDeploy(false)}/>
                    : !deployed
                        ? <Button label="deploy" style={{width: 100}} onClick={() => handleDeploy(true)}/>
                        : <Button label="unknown" disabled={true} style={{width: 100}}></Button>}

                {!deployed && onDelete instanceof Function && <IconButton label={"Delete"}
                                                                          style={{color: "black"}}
                                                                          onClick={() => onDelete(id)}>
                    <BsTrash size={20}/>

                </IconButton>}
                {!run ? "" : (deployed) ? <RunningTag onClick={() => handleDeploy(false)}/> : <VersionsRunningTag/>}
            </span>

        </DisplayOnlyOnTestContext>
    </RestrictToMode>
}

function RunningTag({onClick}) {
    return <OnOverTag
        on={<BsTrash size={20}/>}
        off={<BsFillPlayCircleFill size={20}/>}
        onClick={onClick}
        style={{padding: "1px 9px", marginLeft: 5, backgroundColor: "rgb(0, 200, 83)", color: "white"}}>
    </OnOverTag>

}


function VersionsRunningTag() {
    const theme = useTheme()
    return <Tag
        style={{padding: "1px 9px", marginLeft: 5, backgroundColor: theme.palette.primary.main, color: "white"}}>
        <BsFillPlayCircleFill size={20}/>
    </Tag>
}


export default connect(
    null,
    {showAlert}
)(DeployButton)
