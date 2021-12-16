import React, {useEffect, useState} from "react";
import {asyncRemote} from "../../remote_api/entrypoint";
import TracardiProServicesList from "../elements/lists/TracardiProServicesList";
import TracardiProForm from "../elements/forms/TracardiProForm";
import FormDrawer from "../elements/drawers/FormDrawer";
import TracardiProServiceConfigForm from "../elements/forms/TracardiProServiceConfigForm";
import TracardiProServicesRegisteredList from "../elements/lists/TracardiProServicesRegisteredList";

export default function TracardiPro() {

    const [endpoint, setEndpoint] = useState(null);
    const [selectedService, setSelectedService] = useState(null);

    useEffect(() => {
        const response = asyncRemote({
            url: "/tracardi/pro"
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
            <TracardiProServicesList endpoint={endpoint} onServiceClick={handleServiceClick}/>
            <h1>Configured services</h1>
            <TracardiProServicesRegisteredList onServiceClick={handleRegisteredServiceClick}/>
        </div>}

        <FormDrawer
            width={500}
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