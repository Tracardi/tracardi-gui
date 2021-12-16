import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import "./TracardiProAddedServicesList.css";
import ServiceCard from "../cards/ServiceCard";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

const TracardiProAddedServicesList = ({onServiceClick, refresh}) => {

    const [services, setServices] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        asyncRemote({
            url: '/tracardi-pro/services',
            method: "GET",
        }).then((response) => {
            setServices(response.data)
        }).catch((e) => {
            alert(e.toString())
        }).finally(() => {
            setLoading(false);
        })

    }, [refresh])

    const handleServiceClick = (service) => {
        if(onServiceClick) {
            onServiceClick(service)
        }
    }

    return <div className="TracardiProAddedServicesList">
        {loading && <CenteredCircularProgress/>}
        {Array.isArray(services) && services.map( (service, key) => {
            return <ServiceCard key={key} service={service} onClick={handleServiceClick}/>
        })}
    </div>
}

export default TracardiProAddedServicesList;