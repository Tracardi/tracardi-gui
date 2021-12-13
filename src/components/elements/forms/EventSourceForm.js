import React, {useState} from "react";
import EventSourceCreateForm from "./EventSourceCreateForm";
import EventSourceConfigForm from "./EventSourceConfigForm";


export default function EventSourceForm({value, onClose}) {

    const [configSchema, setConfigSchema] = useState(false);

    const handleConfig = async (data) => {
        setConfigSchema(data);
    }

    return <div style={{margin: 20}}>
        {configSchema === false ? <EventSourceCreateForm value={value} onConfig={handleConfig} onClose={onClose}/> :
            <EventSourceConfigForm schema={configSchema} onClose={onClose}/>
        }
    </div>

}