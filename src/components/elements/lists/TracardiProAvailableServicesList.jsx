import React from "react";
import "./TracardiProAvailableServicesList.css";
import {isObject} from "../../../misc/typeChecking";
import {objectMap} from "../../../misc/mappers";
import ServiceCard from "../cards/ServiceCard";

const TracardiProAvailableServicesList = ({services = null, onServiceClick}) => {

    const handleClick = (v) => {
        onServiceClick(v)
    }

    return <div className="TracardiProAvailableServicesList">

        {isObject(services) && objectMap(services?.services, (key, service) => {
            return <ServiceCard key={key} service={service} onClick={handleClick}/>
        })}
    </div>
}

export default TracardiProAvailableServicesList;