import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import "./TracardiProRunningServicesList.css";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import RunningServiceCard from "../cards/RunningServiceCard";

const TracardiProRunningServicesList = ({onEditClick, refresh}) => {

    const [services, setServices] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (services === null) {
            setLoading(true);
        }
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

    const handleServiceEditClick = (service) => {
        if (onEditClick) {
            onEditClick(service)
        }
    }

    const handleDelete = async () => {
        try {
            // Load again services
            const newResposne = await asyncRemote({
                url: '/tracardi-pro/services',
                method: "GET",
            })
            setServices(newResposne.data);
        } catch (e) {
            alert(e.toString())
        }
    }

    return <div className="TracardiProAddedServicesList">
        {loading && <CenteredCircularProgress/>}
        {Array.isArray(services) && services.map((service, key) => {
            return <RunningServiceCard key={key}
                                       service={service}
                                       onEditClick={handleServiceEditClick}
                                       onDelete={handleDelete}
            />
        })}
    </div>
}

export default TracardiProRunningServicesList;