import {DisplayOnlyOnTestContext, RestrictToMode} from "../../../context/RestrictContext";
import Button from "../Button";
import React, {useState} from "react";
import {useRequest} from "../../../../remote_api/requestClient";
import {BsFillPlayCircleFill, BsPlayCircle, BsStopCircle, BsTrash} from "react-icons/bs";
import IconButton from "../../misc/IconButton";
import Tag from "../../misc/Tag";
import useTheme from "@mui/material/styles/useTheme";

export default function DeployButton({id, production, running, deplomentTable, onDelete}) {

    const [deployed, setDeployed] = useState(production === true)
    const [run, setRun] = useState(running)
    const {request} = useRequest()

    const handleDeploy = async (deploy) => {
        try {
            const response = await request({
                url: deploy ? `/deploy/${deplomentTable}/${id}` : `/undeploy/${deplomentTable}/${id}`,
                method: "get"
            })
            setDeployed(response.data)
            setRun(true)
        } catch (e) {
            console.error(e)
        }
    }

    return <RestrictToMode mode="commercial">
        <DisplayOnlyOnTestContext>
            <span style={{marginLeft: 5, flexWrap: "nowrap", display:"flex"}}>
                {deployed
                    ? <Button label="deployed" style={{width: 100}} disabled={true} onClick={() => handleDeploy(false)}/>
                    : !deployed
                        ? <Button label="deploy" style={{width: 100}} onClick={() => handleDeploy(true)}/>
                        : <Button label="unknown" disabled={true} style={{width: 100}}></Button>}

                {!deployed && onDelete instanceof Function && <IconButton label={"Delete"}
                                                                          style={{color:"black"}}
                                                                          onClick={() => onDelete(id)}>
                    <BsTrash size={20}/>

                </IconButton>}
                {!run ? <NotRunningTag/> : (deployed) ? <RunningTag/> : <VersionsRunningTag/>}
            </span>

        </DisplayOnlyOnTestContext>
    </RestrictToMode>
}

function RunningTag() {
    return <Tag
        style={{padding: "1px 9px",marginLeft: 5,backgroundColor: "rgb(0, 200, 83)", color: "white"}}>
        <BsFillPlayCircleFill size={20}/>
    </Tag>
}


function VersionsRunningTag() {
    const theme = useTheme()
    return <Tag
        style={{padding: "1px 9px",marginLeft: 5,backgroundColor: theme.palette.primary.main, color: "white"}}>
        <BsPlayCircle size={20}/>
    </Tag>
}

function NotRunningTag() {
    return <Tag
        style={{padding: "1px 9px",marginLeft: 5,backgroundColor: "rgba(128, 128, 128,.5)", color: "white"}}>
        <BsStopCircle size={20}/>
    </Tag>

    return <Button
        selected={true}
        style={{marginLeft: 5}}
        label={<BsStopCircle size={20}/>}
        disabled={true}
    />
}

