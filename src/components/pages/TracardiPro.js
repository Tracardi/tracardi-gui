import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../remote_api/entrypoint";
import TracardiProAvailableServicesList from "../elements/lists/TracardiProAvailableServicesList";
import TracardiProForm from "../elements/forms/TracardiProForm";
import FormDrawer from "../elements/drawers/FormDrawer";
import TracardiProServiceConfigForm from "../elements/forms/TracardiProServiceConfigForm";
import TracardiProAddedServicesList from "../elements/lists/TracardiProAddedServicesList";

export default function TracardiPro() {

    const [endpoint, setEndpoint] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const response = asyncRemote({
            url: "/tracardi-pro"
        }).then(
            (response) => {
                if (response.status == 200) {
                    setEndpoint(response.data)
                }
            }
        ).catch((e) => {
            alert(e.toString())
        })

    }, [])

    const handleServiceClick = (service) => {
        setSelectedService(service)
    }

    const handleRegisteredServiceClick = (service) => {
        setSelectedService(service)
    }

    return <div style={{height: "100%", overflow: "auto"}}>
        {!endpoint && <TracardiProForm value={endpoint}/>}
        {endpoint && <div>
            <h1>Services</h1>
            <TracardiProAvailableServicesList onServiceClick={handleServiceClick}/>
            <h1>Configured services</h1>
            <TracardiProAddedServicesList onServiceClick={handleRegisteredServiceClick}/>
        </div>}

        <FormDrawer
            width={550}
            label="Configure"
            onClose={() => setSelectedService(null)}
            open={selectedService !== null}>
            <TracardiProServiceConfigForm
                endpoint={endpoint}
                service={selectedService}
                onSubmit={() => setSelectedService(null)}
            />
        </FormDrawer>

    </div>
}