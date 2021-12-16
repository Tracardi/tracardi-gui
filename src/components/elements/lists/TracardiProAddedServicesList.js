import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import "./TracardiProAddedServicesList.css";
import ServiceCard from "../cards/ServiceCard";

const TracardiProAddedServicesList = ({onServiceClick}) => {

    const [services, setServices] = useState(null);

    useEffect(() => {
        asyncRemote({
            url: '/tracardi-pro/services',
            method: "GET",
        }).then((response) => {
            setServices(response.data)
        }).catch((e) => {
            alert(e.toString())
        })

    }, [])

    const handleServiceClick = (service) => {
        if(onServiceClick) {
            onServiceClick(service)
        }
    }

    return <div className="TracardiProAddedServicesList">
        {Array.isArray(services) && services.map( (service, key) => {
            return <ServiceCard key={key} service={service} onClick={handleServiceClick}/>
        })}
    </div>
}

export default TracardiProAddedServicesList;