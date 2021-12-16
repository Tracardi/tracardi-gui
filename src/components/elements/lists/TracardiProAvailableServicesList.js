import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import "./TracardiProAvailableServicesList.css";
import {isObject} from "../../../misc/typeChecking";
import {objectMap} from "../../../misc/mappers";
import ServiceCard from "../cards/ServiceCard";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

const TracardiProAvailableServicesList = ({onServiceClick}) => {

    const [services, setServices] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        asyncRemote({
            url: '/tracardi-pro/services?available=1',
            method: "GET",
        }).then((response) => {
            setServices(response.data)
        }).catch((e) => {
            alert(e.toString())
        }).finally(() => {
            setLoading(false);
        })
    }, [])

    return <div className="TracardiProAvailableServicesList">
        {loading && <CenteredCircularProgress/>}
        {isObject(services) && objectMap(services, (key, service) => {
            return <ServiceCard key={key} service={service} onClick={onServiceClick}/>
        })}
    </div>
}

export default TracardiProAvailableServicesList;