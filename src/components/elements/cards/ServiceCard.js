import React from "react";
import "./ServiceCard.css";
import Button from "../forms/Button";
import FlowNodeIcons from "../../flow/FlowNodeIcons";

const ServiceCard = ({service, onClick}) => {
    return <div className="ServiceCard" onClick={() => onClick(service)}>
        <div className="Title">
            <FlowNodeIcons icon={service.icon}/>
            {service?.name}
        </div>
        <div className="Desc">
            {service?.description}
            {service.prefix}
            {service.traffic}
        </div>
        <Button label={service.id ? "Edit" : "Add"}/>
    </div>
}

export default ServiceCard;