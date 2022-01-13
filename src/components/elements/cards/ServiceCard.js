import React from "react";
import "./ServiceCard.css";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import Chip from "@material-ui/core/Chip";
import {BsPlayCircle} from "react-icons/bs";
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
            <div style={{marginBottom: 40}}>
                {service?.description}
            </div>
            <div style={{lineHeight: 2}}>
                <Chip size="small" label={service.prefix} style={{marginRight: 5}}></Chip>
                {service.tags.map((tag, key) => <Chip size="small" key={key} label={tag} style={{marginRight: 5}}/>)}
            </div>
        </div>
    </div>
}

export default ServiceCard;