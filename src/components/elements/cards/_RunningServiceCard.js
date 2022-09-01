import React, {useState} from "react";
import "./ServiceCard.css";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import Chip from "@mui/material/Chip";
import {BsGear} from "react-icons/bs";
import IconButton from "../misc/IconButton";
import {asyncRemote} from "../../../remote_api/entrypoint";
import {BsStopCircle} from "react-icons/bs";
import {useConfirm} from "material-ui-confirm";

const _RunningServiceCard = ({service, onEditClick, onDelete}) => {

    const [stopProgress, setStopProgress] = useState(false);
    const confirm = useConfirm();

    const handleOnStopClick = async (service) => {
        confirm({title: "Do you want to delete this service?", description: "This action can not be undone."})
            .then(async () => {
                try {
                    setStopProgress(true);
                    const response = await asyncRemote({
                        url: `/tracardi-pro/service/${service.id}`,
                        method: "DELETE"
                    })
                    if (response.status === 200) {
                        if (onDelete) {
                            onDelete(service)
                        }
                    }
                } catch (e) {
                    alert("Could not delete service.")
                } finally {
                    setStopProgress(false);
                }
            }).catch(()=>{})
    }

    return (
        <div className="ServiceCard" >
            <div className="Title">
                <FlowNodeIcons icon={service.icon} size={30}/>
                <span style={{marginLeft: 10}}>{service?.name}</span>
            </div>
            <div className="Desc">
                <div style={{marginBottom: 10}}>
                    {service?.description}
                </div>
                <div style={{lineHeight: 2}}>
                    {service.tags.map((tag, key) => <Chip size="small" key={key} label={tag} style={{marginRight: 5}}/>)}
                </div>
                <div style={{display: "flex", justifyContent: "flex-end"}}>
                    <IconButton
                        label="Stop"
                        onClick={() => handleOnStopClick(service)}
                        progress={stopProgress}
                        size="large">
                        <BsStopCircle size={20}/>
                    </IconButton>
                    <IconButton label="Edit" onClick={() => onEditClick(service)} size="large">
                        <BsGear size={20}/>
                    </IconButton>
                </div>

            </div>
        </div>
    );
}

export default _RunningServiceCard;