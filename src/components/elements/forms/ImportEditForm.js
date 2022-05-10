import React from "react";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import {TextField, Autocomplete} from "@mui/material";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField} from "../tui/TuiForm";
import BoolInput from "./BoolInput";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import JsonForm from "./JsonForm";
import ErrorsBox from "../../errors/ErrorsBox";
import LinearProgress from "@mui/material/LinearProgress";
import {isObject} from "../../../misc/typeChecking";

export default function ImportEditForm({onSubmit, importConfig}) {

    const [module, setModule] = React.useState({});

    const name = React.useRef(importConfig.name);
    const desc = React.useRef(importConfig.desc);
    const transitional = React.useRef(importConfig.transitional);
    const eventType = React.useRef(importConfig.event_type);

    const enabled = React.useRef(importConfig.enabled);
    const [options, setOptions] = React.useState([]);
    const [loadingOptions, setLoadingOptions] = React.useState(false);
    const [error, setError] = React.useState(null);
    const mounted = React.useRef(false)

    const [formError, setFormError] = React.useState(null);

    React.useEffect(() => {
        mounted.current = true;
        setLoadingOptions(true)
        asyncRemote({url: "/import/types"})
            .then(response => {
                if (mounted.current) {
                    setOptions(Object.keys(response.data).map(key => {
                        return {label: response.data[key].name, value: response.data[key].module}
                    }))
                    setModule(Object.keys(response.data).map(key => {
                        return {label: response.data[key].name, value: response.data[key].module}
                    }).filter(el => el.value === importConfig.module)[0])
                }
            })
            .catch(e => {
                if (mounted.current) setError(getError(e))
            })
            .finally(() => {
                if (mounted.current) setLoadingOptions(false)
            })
        return () => mounted.current = false;
    }, [importConfig])

    const ImportConfigForm = () => {

        const config = React.useRef(importConfig.config);
        const mounted = React.useRef(false);

        const [form, setForm] = React.useState(null);
        const [loadingForm, setLoadingForm] = React.useState(false);
        const [sendingForm, setSendingForm] = React.useState(false);

        const [serverError, setServerError] = React.useState(null);

        React.useEffect(() => {
            mounted.current = true;
            if (module?.value) {
                if (mounted.current) {
                    setLoadingForm(true);
                    setFormError(null);
                    setServerError(null);
                    setForm(null);
                }
                asyncRemote({url: "/import/form/" + module.value})
                    .then(response => {
                        if (mounted.current) setForm(response.data.form);
                    })
                    .catch(e => {
                        if (mounted.current) setServerError(getError(e));
                    })
                    .finally(() => {
                        if (mounted.current) setLoadingForm(false);
                    })
            }
            return () => mounted.current = false;
        }, []);

        const handleFormChange = (value) => {
            config.current = value;
        }

        const handleFormSave = () => {
            if (mounted.current) {
                setSendingForm(true);
                setFormError(null);
                setServerError(null);
            }
            asyncRemote({
                url: "/import",
                method: "POST",
                data: {
                    id: importConfig.id,
                    name: name.current,
                    description: desc.current,
                    enabled: enabled.current,
                    transitional: transitional.current,
                    event_type: eventType.current,
                    module: module.value,
                    config: config.current
                }
            })
                .then((response) => {
                    if(onSubmit instanceof Function) {
                        onSubmit(response)
                    }
                })
                .catch(e => {
                    if (mounted.current) {
                        if (e.response.status === 422) {
                            setFormError(e.response.data);
                        } else {
                            setServerError(getError(e));
                        }
                    }
                })
                .finally(() => {
                    if (mounted.current) setSendingForm(false)
                })
        }

        return <>
            {
                loadingForm ?
                    <CenteredCircularProgress/>
                    :
                    <>
                        {form && <JsonForm
                            values={config.current}
                            schema={form}
                            onChange={handleFormChange}
                            onSubmit={handleFormSave}
                            processing={sendingForm}
                            errorMessages={formError}
                            serverSideError={serverError}
                        />}
                    </>
            }
        </>
    }

    return <>{importConfig && <>
        <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Name" description="Please enter the name of this import.">
                        <TextField
                            defaultValue={name.current}
                            sx={{width: 300}}
                            size="small"
                            variant="outlined"
                            label="Name"
                            error={isObject(formError) && "name" in formError}
                            helperText={isObject(formError) && "name" in formError ? formError['name'] : null}
                            onChange={(e => name.current = e.target.value)}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Description"
                                       description="Please enter the optional description for this import. Clear
                                       description will allow you to understand what is being imported into the system.">
                        <TextField
                            defaultValue={desc.current}
                            fullWidth
                            size="small"
                            multiline={true}
                            rows={4}
                            variant="outlined"
                            label="Description"
                            onChange={(e => desc.current = e.target.value)}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Event type" description="Type of the event that you want to be
                    triggered for every data record. Event type identifies the imported data.">
                        <TextField
                            defaultValue={eventType.current}
                            sx={{width: 300}}
                            size="small"
                            variant="outlined"
                            label="Event type"
                            error={isObject(formError) && "event_type" in formError}
                            helperText={isObject(formError) && "event_type" in formError ? formError['event_type'] : null}
                            onChange={(e => eventType.current = e.target.value)}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Make event transitional" description="Transitional events are only processed but not
                    saved in the database. If you set import to collect only transitional events then no event will be stored in the system. ">
                        <BoolInput
                            label="Transitional event"
                            value={transitional.current}
                            onChange={() => transitional.current = !transitional.current}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Enabled" description="Make this configuration available for the import process">
                        <BoolInput
                            label="Enabled"
                            value={enabled.current}
                            onChange={() => enabled.current = !enabled.current}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Import type" description="Please select the type of import.">
                        <Autocomplete
                            value={module}
                            freeSolo={false}
                            multiple={false}
                            fullWidth={false}
                            style={{width: 300}}
                            options={options}
                            getOptionLabel={option => option?.label || ""}
                            isOptionEqualToValue={(option, value) => !value || option.value === value.value}
                            onChange={(_, value) => {
                                setModule(value);
                            }}
                            renderInput={(params) => (
                                <><TextField
                                    {...params}
                                    label="Type"
                                    variant="outlined"
                                    size="small"
                                />
                                    {loadingOptions && <LinearProgress/>}
                                </>)
                            }
                        />
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
        {error && <ErrorsBox errorList={error}/>}
        <div style={{margin: 20}}>
            <ImportConfigForm/>
        </div>
    </>}</>;
}