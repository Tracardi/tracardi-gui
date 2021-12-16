import React, {useEffect, useState} from "react";
import Url from "url-parse";
import {asyncRemote} from "../../../remote_api/entrypoint";
import "./TracardiProAvailableServicesList.css";
import {isObject} from "../../../misc/typeChecking";
import {objectMap} from "../../../misc/mappers";
import ServiceCard from "../cards/ServiceCard";

const TracardiProAvailableServicesList = ({onServiceClick}) => {

    const [services, setServices] = useState(null);

    useEffect(() => {
        asyncRemote({
            url: '/tracardi-pro/services?available=1',
            method: "GET",
        }).then((response) => {
            setServices(response.data)
        }).catch((e) => {
            alert(e.toString())
        })

    }, [])

    return <div className="TracardiProAvailableServicesList">
        {isObject(services) && objectMap(services, (key, service) => {
            return <ServiceCard key={key} service={service} onClick={onServiceClick}/>
        })}
    </div>
}

export default TracardiProAvailableServicesList;