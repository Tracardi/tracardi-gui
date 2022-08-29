import TracardiProAvailableServicesList from "../../elements/lists/TracardiProAvailableServicesList";
import FormDrawer from "../../elements/drawers/FormDrawer";
import TracardiProServiceConfigForm from "../../elements/forms/pro/TracardiProServiceConfigForm";
import React, {useState} from "react";
import NoData from "../../elements/misc/NoData";
import {BsCloudCheckFill} from "react-icons/bs";
import Button from "../../elements/forms/Button";

function ServiceCreatedConfirmation({onConfirmed}) {
    return <NoData
        icon={<BsCloudCheckFill size={60}/>}
        header="Service created"
    >
        <p style={{color: "#555"}}>Your service is ready. All the required resources and plugins were added. Please go to Resources tab to see the
        data. If additional plugins were required for this resource to work they have been added to the system an can be found
            in the workflow editor.</p>
        <Button label="OK" onClick={onConfirmed} style={{margin: 20}}/>
    </NoData>
}

function ServiceForm({selectedService, onCreated}) {

    const [ready, setReady] = useState(false);

    const handleSubmit = () => {
        if (onCreated instanceof Function) {
            onCreated()
        }
    }

    return <div style={{padding: 20}}>
        {ready
            ? <ServiceCreatedConfirmation onConfirmed={handleSubmit}/>
            : <TracardiProServiceConfigForm
                service={selectedService}
                onSubmit={()=>setReady(true)}
            />
        }
    </div>
}

export default function ProServiceList() {

    const [selectedService, setSelectedService] = useState(null);


    const handleServiceAddClick = (service) => {
        setSelectedService(service)
    }

    return <>
        <TracardiProAvailableServicesList onServiceClick={handleServiceAddClick}/>
        <FormDrawer
            width={550}
            label="Configure"
            onClose={() => setSelectedService(null)}
            open={selectedService !== null}>

            <ServiceForm
                selectedService={selectedService}
                onCreated={() => setSelectedService(null)}
            />

        </FormDrawer></>
}