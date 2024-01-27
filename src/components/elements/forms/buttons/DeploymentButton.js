import {DisplayOnlyOnTestContext, RestrictToMode} from "../../../context/RestrictContext";
import Button from "../Button";
import React from "react";
import {BsFillPlayCircleFill, BsTrash} from "react-icons/bs";
import {OnOverTag} from "../../misc/Tag";
import {connect} from "react-redux";
import {showAlert} from "../../../../redux/reducers/alertSlice";
import {MdOutlineModeEditOutline} from "react-icons/md";

function DeployButton({id, deployed, running, draft, onDelete, onUnDeploy, onDeploy}) {


    const handleDelete = () => {
        if (onDelete instanceof Function) {
            onDelete(id)
        }
    }

    const handleUndeploy = () => {
        if(onUnDeploy instanceof Function) {
            onUnDeploy()
        }
    }

    const handleDeploy = () => {
        if(onDeploy instanceof Function) {
            onDeploy()
        }
    }

    return <RestrictToMode mode="commercial">
        {/*<DisplayOnlyOnTestContext>*/}
            <span className="flexLine" style={{marginLeft: 5, flexWrap: "nowrap"}}>

                {draft && <DraftTag size={20} onClick={handleDelete}/>}

                {deployed
                    ? <Button label="deployed" style={{width: 100}} disabled={true}/>
                    : <Button label="deploy" style={{width: 100}} onClick={handleDeploy}/>}

                {running && <RunningTag onClick={handleUndeploy}/>}

            </span>

        {/*</DisplayOnlyOnTestContext>*/}
    </RestrictToMode>
}

function RunningTag({onClick}) {
    return <OnOverTag
        on={<BsTrash size={20} style={{margin: 5}}/>}
        off={<BsFillPlayCircleFill size={20} style={{margin: 5}}/>}
        onClick={onClick}
        style={{padding: "1px 9px", marginLeft: 5, backgroundColor: "rgb(0, 200, 83)", color: "white"}}>
    </OnOverTag>

}

function DraftTag({onClick}) {
    return <OnOverTag
        on={<BsTrash size={20} style={{margin: 5}}/>}
        off={<MdOutlineModeEditOutline size={20} style={{margin: 5}}/>}
        onClick={onClick}
        style={{padding: "1px 9px", marginLeft: 5, backgroundColor: "#EF6C00", color: "white"}}>
    </OnOverTag>
}


export default connect(
    null,
    {showAlert}
)(DeployButton)
