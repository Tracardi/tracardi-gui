import React, {useEffect, useState} from "react";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import "./TracardiProAvailableServicesList.css";
import {isObject} from "../../../misc/typeChecking";
import {objectMap} from "../../../misc/mappers";
import ServiceCard from "../cards/ServiceCard";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import ErrorsBox from "../../errors/ErrorsBox";

const TracardiProAvailableServicesList = ({services = null, onServiceClick}) => {

    // const [services, setServices] = useState(null);
    // const [loading, setLoading] = useState(false);
    // const [error, setError] = useState(null);

    // useEffect(() => {
    //     setLoading(true);
    //     asyncRemote({
    //         url: `/tpro/available_services?query=${query}&category=${category}`,
    //         method: "GET",
    //     }).then((response) => {
    //         setServices(response.data)
    //     }).catch((e) => {
    //         setError(getError(e))
    //     }).finally(() => {
    //         setLoading(false);
    //     })
    // }, [query, category])
    //
    // if (error) {
    //     return <ErrorsBox errorList={error} />
    // }
    //
    // if(loading) {
    //     return <CenteredCircularProgress label="Connecting Tracardi PRO"/>
    // }

    return <div className="TracardiProAvailableServicesList">

        {isObject(services) && objectMap(services?.services, (key, service) => {
            return <ServiceCard key={key} service={service} onClick={onServiceClick}/>
        })}
    </div>
}

export default TracardiProAvailableServicesList;