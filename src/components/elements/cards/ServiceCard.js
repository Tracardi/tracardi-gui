import React from "react";
import "./ServiceCard.css";
import Button from "../forms/Button";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import Chip from "@material-ui/core/Chip";

const ServiceCard = ({service, onClick}) => {
    return <div className="ServiceCard" onClick={() => onClick(service)}>
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
            <div style={{display: "flex", justifyContent: "flex-end", marginTop: 15}}>
                <Button label={service.id ? "Edit" : "Add"} style={{padding: "2px 4px", width: 80, justifyContent: "center"}}/>
            </div>

        </div>
    </div>
}

export default ServiceCard;