import React from "react";
import "./ServiceCard.css";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import Chip from "@material-ui/core/Chip";
import {BsPlayCircle} from "react-icons/all";
import IconButton from "../misc/IconButton";

const ServiceCard = ({service, onClick}) => {
    return <div className="ServiceCard">
        <div className="Title">
            <span>
                <FlowNodeIcons icon={service.icon} size={30}/>
                <span style={{marginLeft: 10}}>{service?.name}</span>
            </span>
            <IconButton label="Start" onClick={() => onClick(service)}>
                <BsPlayCircle size={23}/>
            </IconButton>
        </div>
        <div className="Desc">
            <div style={{marginBottom: 10}}>
                {service?.description}
            </div>
            <Chip size="small" label={service.prefix} style={{marginRight: 5}}></Chip>
            <Chip size="small"label={service.traffic} style={{marginRight: 5}}></Chip>
        </div>
    </div>
}

export default ServiceCard;