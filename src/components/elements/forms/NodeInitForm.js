import {JsonForm} from "./JsonForm";
import React, {useEffect, useState} from "react";
import FormSchema from "../../../domain/formSchema";
import MutableMergeRecursive from "../../../misc/recursiveObjectMerge";
import ConfigEditor from "../../flow/editors/ConfigEditor";

export function NodeInitJsonForm({pluginId, formSchema, init, manual, onSubmit}) {

    const [data, setData] = useState(init)
    const [formErrorMessages, setFormErrorMessages] = useState({});
    const [saveOk, setSaveOk] = useState(false);

    useEffect(() => {
        // Reset to default values
        setData(init);
        setSaveOk(false);
        setFormErrorMessages({})
    }, [init])

    const handleSubmit = (config) => {
        const form = new FormSchema(formSchema)
        form.validate(pluginId, config).then(
            (result) => {
                if (result === true) {

                    if(formErrorMessages !== {}) {
                        setFormErrorMessages({})
                    }

                    setData(config)
                    onSubmit(config)
                    setSaveOk(true);

                } else {
                    setFormErrorMessages(result);
                    setSaveOk(false);
                }
            }
        )
    }

    return <ConfigEditor
        config={data}
        manual={manual}
        onConfig={handleSubmit}
        confirmed={saveOk}
        errorMessages={formErrorMessages}
    />
}

export function NodeInitForm({pluginId, init, formSchema, onSubmit}) {

    const [data, setData] = useState({...init})
    const [formErrorMessages, setFormErrorMessages] = useState({});
    const [saveOK, setSaveOk] = useState(false);

    useEffect(() => {
        // Reset to default values
        setData({...init});
        setSaveOk(false);
        setFormErrorMessages({})
    }, [init])

    const handleFormSubmit = () => {
        const form = new FormSchema(formSchema)
        form.validate(pluginId, data).then(
            (result) => {
                if (result === true) {

                    if(formErrorMessages !== {}) {
                        setFormErrorMessages({})
                    }

                    onSubmit(data)
                    setSaveOk(true)

                } else {
                    setFormErrorMessages(result);
                    setSaveOk(false)
                }
            }
        )
    }

    const handleFormChange = (value) => {
        setData(MutableMergeRecursive(data, value))
    }

    return <JsonForm
        pluginId={pluginId}
        values={data}
        errorMessages={formErrorMessages}
        schema={formSchema}
        onSubmit={handleFormSubmit}
        onChange={handleFormChange}
        confirmed={saveOK}
    />
}