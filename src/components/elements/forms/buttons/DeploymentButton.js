import {
    DisplayOnlyIfUpdatesAllowedOnProduction,
    RestrictToMode
} from "../../../context/RestrictContext";
import React from "react";
import {BsTrash} from "react-icons/bs";
import {OnOverTag} from "../../misc/Tag";
import {connect} from "react-redux";
import {showAlert} from "../../../../redux/reducers/alertSlice";
import IconButton from "../../misc/IconButton";
import {DebugButton} from "../../misc/JsonButton";
import useTheme from "@mui/material/styles/useTheme";

function DeployButton({id, data, running, draft, onDelete, onUnDeploy, onDeploy, forceMode}) {

    const handleDelete = () => {
        if (onDelete instanceof Function) {
            onDelete(id)
        }
    }

    const handleUndeploy = () => {
        if(onUnDeploy instanceof Function) {
            onUnDeploy(id)
        }
    }

    const handleDeploy = () => {
        if(onDeploy instanceof Function) {
            onDeploy(id)
        }
    }

    return <DisplayOnlyIfUpdatesAllowedOnProduction>
        {(process.env.NODE_ENV && process.env.NODE_ENV === 'development') && <DebugButton data={data}/>}
        <RestrictToMode mode="with-deployment" forceMode={forceMode}>

            <span className="flexLine" style={{marginLeft: 5, flexWrap: "nowrap"}}>

                {draft && <DraftTag size={20} onClick={handleDeploy} onDeleteClick={handleDelete}/>}

                {running && <RunningTag onDeleteClick={handleUndeploy}/>}

            </span>

        </RestrictToMode>
        <RestrictToMode mode="no-deployment" forceMode={forceMode}>
            <IconButton onClick={handleDelete}><BsTrash size={20} style={{margin: 5}}/></IconButton>
        </RestrictToMode>
    </DisplayOnlyIfUpdatesAllowedOnProduction>
}

function RunningTag({onClick,onDeleteClick}) {
    return <OnOverTag
        label="Running"
        onClick={onClick}
        onDeleteClick={onDeleteClick}
        backgroundColor="rgb(0, 200, 83)"
        style={{padding: "1px 9px", marginLeft: 5, color: "white"}}>
    </OnOverTag>

}

function DraftTag({onClick, onDeleteClick}) {

    const theme = useTheme()

    return <OnOverTag
        label="Deploy Draft"
        onClick={onClick}
        onDeleteClick={onDeleteClick}
        backgroundColor={theme.palette.primary.main}
        style={{padding: "1px 9px", marginLeft: 5, color: "white"}}>
    </OnOverTag>
}


export default connect(
    null,
    {showAlert}
)(DeployButton)
