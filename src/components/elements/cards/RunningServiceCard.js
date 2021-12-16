import React, {useState} from "react";
import "./ServiceCard.css";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import Chip from "@material-ui/core/Chip";
import {BsGear} from "@react-icons/all-files/bs/BsGear";
import IconButton from "../misc/IconButton";
import {asyncRemote} from "../../../remote_api/entrypoint";
import {BsStopCircle} from "react-icons/all";

const RunningServiceCard = ({service, onEditClick, onDelete}) => {

    const [stopProgress, setStopProgress] = useState(false);

    const handleOnStopClick = async (service) => {
        try {
            setStopProgress(true);
            const response = await asyncRemote({
                url: `/tracardi-pro/service/${service.id}`,
                method: "DELETE"
            })
            if (response.status === 200) {
                if(onDelete) {
                    onDelete(service)
                }
            }
        } catch (e) {
            alert(e.toString())
        } finally {
            setStopProgress(false);
        }
    }

    return <div className="ServiceCard" >
        <div className="Title">
            <FlowNodeIcons icon={service.icon} size={30}/>
            <span style={{marginLeft: 10}}>{service?.name}</span>
        </div>
        <div className="Desc">
            <div style={{marginBottom: 10}}>
                {service?.description}
            </div>
            <Chip size="small" label={service.prefix} style={{marginRight: 5}}></Chip>
            <Chip size="small"label={service.traffic} style={{marginRight: 5}}></Chip>
            <div style={{display: "flex", justifyContent: "flex-end"}}>
                <IconButton label="Stop" onClick={() => handleOnStopClick(service)} progress={stopProgress}>
                    <BsStopCircle size={20}/>
                </IconButton>
                <IconButton label="Edit" onClick={() => onEditClick(service)}>
                    <BsGear size={20}/>
                </IconButton>
            </div>

        </div>
    </div>
}

export default RunningServiceCard;