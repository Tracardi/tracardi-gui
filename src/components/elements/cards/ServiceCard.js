import React from "react";
import "./ServiceCard.css";
import Button from "../forms/Button";

const ServiceCard = ({service, onClick}) => {
    return <div className="ServiceCard" onClick={() => onClick(service)}>
        <div className="Title">
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