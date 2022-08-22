import {TextField, Autocomplete} from "@mui/material";
import React from "react";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import {TuiForm, TuiFormGroupContent, TuiFormGroupField, TuiFormGroup, TuiFormGroupHeader} from "../tui/TuiForm";
import JsonForm from "./JsonForm";
import {v4 as uuid4} from 'uuid';
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import ErrorsBox from "../../errors/ErrorsBox";
import {isObject} from "../../../misc/typeChecking";
import NoData from "../misc/NoData";
import {TuiSelectEventSource} from "../tui/TuiSelectEventSource";
import storageValue from "../../../misc/localStorageDriver";
import TuiApiUrlInput from "../tui/TuiApiUrlInput";

export default function ImportForm({onSubmit}) {

    const [module, setModule] = React.useState(null);
    const [options, setOptions] = React.useState([]);
    const [error, setError] = React.useState(null);

    const eventType = React.useRef("");
    const config = React.useRef({});
    const mounted = React.useRef(false);
    const name = React.useRef("");
    const desc = React.useRef("");
    const eventSource = React.useRef("");
    const apiUrl = React.useRef("");

    const [form, setForm] = React.useState(null);
    const [loadingForm, setLoadingForm] = React.useState(false);
    const [sendingForm, setSendingForm] = React.useState(false);
    const [formError, setFormError] = React.useState(null);
    const [serverError, setServerError] = React.useState(null);

    React.useEffect(() => {
        mounted.current = true;
        if (module) {

            if (mounted.current) {
                setLoadingForm(true);
                setFormError(null);
                setServerError(null);
                setForm(null);
            }

            asyncRemote({url: "/import/form/" + module})
                .then(response => {
                    if (mounted.current) {
                        setForm(response.data.form);
                        config.current = response.data.init;
                    }
                })
                .catch(e => {
                    if (mounted.current) setServerError(getError(e));
                })
                .finally(() => {
                    if (mounted.current) setLoadingForm(false);
                })
        }
        return () => mounted.current = false;
    }, [module]);

    React.useEffect(() => {
        mounted.current = true;
        asyncRemote({url: "/import/types"})
            .then(response => {
                if (mounted.current) {
                    setOptions(Object.keys(response.data).map(key => {
                        return {label: response.data[key].name, value: response.data[key].module}
                    }))
                }
            })
            .catch(e => {
                if (mounted.current) setError(getError(e))
            })
        return () => mounted.current = false;
    }, [])

    const handleChange = (value) => {
        config.current = value;
    }

    const handleSubmit = () => {

        if (mounted.current) {
            setSendingForm(true);
            setFormError(null);
            setServerError(null);
        }

        asyncRemote({
            url: "/import",
            method: "POST",
            data: {
                id: uuid4(),
                name: name.current,
                description: desc.current,
                enabled: true,
                module: module,
                config: config.current,
                api_url: apiUrl.current,
                event_source: eventSource.current,
                event_type: eventType.current,
            }
        })
            .then(onSubmit)
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
        <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Data importer description"
                                    description="Define a task that will import data into the system. Data will appear
                                    in the system as a set of events of a defined type and properties."/>
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Name" description="Please enter the name of your import task. This will
                    let you identify this import.">
                        <TextField
                            defaultValue={name.current}
                            sx={{width: 300}}
                            size="small"
                            variant="outlined"
                            label="Name"
                            error={isObject(formError) && "name" in formError}
                            helperText={isObject(formError) && "name" in formError ? formError['name'] : null}
                            FormHelperTextProps={{ style: { color: "#d81b60" }}}
                            onChange={(e => name.current = e.target.value)}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Description" description="Please enter the optional description.">
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
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Import destination"/>
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Tracardi API URL"
                                       description="Select an instance of Tracardi API you would like to send the imported data to.">
                        <div style={{width: 500}}>
                            <TuiApiUrlInput
                                label="Tracardi API URL"
                                value={apiUrl.current}
                                options={new storageValue('tracardi-api-urls').read([])}
                                onChange={(value) => apiUrl.current = value}
                                errorMessage={isObject(formError) && "api_url" in formError ? formError['api_url'] : null}
                            />
                        </div>
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Event source" description="Select 'event source' the data will be sent
                    through. Separate event source for import is a good practice.">
                        <div style={{width: 500}}>
                            <TuiSelectEventSource value={eventSource.current}
                                                  fullWidth={true}
                                                  onlyValueWithOptions={false}
                                                  onSetValue={(value) => eventSource.current = value}
                                                  errorMessage={isObject(formError) && "event_source.id" in formError ? formError['event_source.id'] : null}
                            />
                        </div>
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
                            FormHelperTextProps={{ style: { color: "#d81b60" }}}
                            onChange={(e => eventType.current = e.target.value)}
                        />
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Import source"/>
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Import type" description="Please select the import type. Depending on
                    the import type system will load additional configuration form.">
                        <Autocomplete
                            freeSolo={false}
                            multiple={false}
                            fullWidth={false}
                            style={{width: 300}}
                            options={options}
                            getOptionLabel={option => option?.label || null}
                            isOptionEqualToValue={(option, value) => option === null || option.label === value.label}
                            onChange={(_, value) => {
                                setModule(value?.value || null);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Resource"
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        />
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
        {error && <ErrorsBox errorList={error}/>}
        <div style={{margin: 20}}>
            {
                loadingForm ?
                    <CenteredCircularProgress/>
                    :
                    <>
                        {form && <JsonForm
                            values={config.current}
                            schema={form}
                            onChange={handleChange}
                            onSubmit={handleSubmit}
                            processing={sendingForm}
                            errorMessages={formError}
                            serverSideError={serverError}
                        />}
                        {!form && <NoData header="Import type not selected">
                            Select import type to finish configuration.
                        </NoData>}
                    </>
            }
        </div>
    </>;
}
