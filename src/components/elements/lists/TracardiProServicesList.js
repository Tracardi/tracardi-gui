import React, {useEffect, useState} from "react";
import Url from "url-parse";
import {asyncRemote} from "../../../remote_api/entrypoint";
import "./TracardiProServicesList.css";
import {isObject} from "../../../misc/typeChecking";
import {objectMap} from "../../../misc/mappers";
import ServiceCard from "../cards/ServiceCard";

const TracardiProServicesList = ({endpoint, onServiceClick}) => {

    const [services, setServices] = useState(null);

    useEffect(() => {
        const u = new Url(endpoint.url)

        u.set("pathname", '')
        u.set("query", '')
        u.set("hash", '')

        asyncRemote({
            baseURL: u.href,
            url: '/services',
            method: "GET",
        }).then((response) => {
            setServices(response.data)
        }).catch((e) => {
            alert(e.toString())
        })

    }, [])

    return <div className="ProServicesList">
        {isObject(services) && objectMap(services, (key, service) => {
            return <ServiceCard key={key} service={service} onClick={onServiceClick}/>
        })}
    </div>
}

export default TracardiProServicesList;