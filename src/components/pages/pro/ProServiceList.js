import TracardiProAvailableServicesList from "../../elements/lists/TracardiProAvailableServicesList";
import FormDrawer from "../../elements/drawers/FormDrawer";
import TracardiProServiceConfigForm from "../../elements/forms/pro/TracardiProServiceConfigForm";
import React, {useState} from "react";

export default function ProServiceList() {

    const [selectedService, setSelectedService] = useState(null);


    const handleServiceAddClick = (service) => {
        setSelectedService(service)
    }


    const handleServiceSaveClick = async () => {
        setSelectedService(null);
    }

    return <>
        <TracardiProAvailableServicesList onServiceClick={handleServiceAddClick}/>
        <FormDrawer
            width={550}
            label="Configure"
            onClose={() => setSelectedService(null)}
            open={selectedService !== null}>

            <div style={{padding: 20}}>
                <TracardiProServiceConfigForm
                    service={selectedService}
                    onSubmit={handleServiceSaveClick}
                />
            </div>
        </FormDrawer></>
}