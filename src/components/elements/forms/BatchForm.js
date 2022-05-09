import { TextField, Autocomplete } from "@mui/material";
import React from "react";
import { asyncRemote, getError } from "../../../remote_api/entrypoint";
import { TuiForm, TuiFormGroupContent, TuiFormGroupField, TuiFormGroup, TuiFormGroupHeader } from "../tui/TuiForm";
import BoolInput from "./BoolInput";
import JsonForm from "./JsonForm";
import MutableMergeRecursive from "../../../misc/recursiveObjectMerge";
import { uuid4 } from "@sentry/utils";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import ErrorsBox from "../../errors/ErrorsBox";


export default function BatchForm ({ onSubmit }) {

    const [module, setModule] = React.useState(null);
    const name = React.useRef(null);
    const desc = React.useRef(null);
    const enabled = React.useRef(true);
    const [options, setOptions] = React.useState([]);
    const [error, setError] = React.useState(null);
    const mounted = React.useRef(false)

    React.useEffect(() => {
        mounted.current = true;
        asyncRemote({url: "/batches/types"})
        .then(response => {
            if (mounted.current) {
                setOptions(Object.keys(response.data).map(key => {return {label: response.data[key].name, value: response.data[key].module}}))
            }
        })
        .catch(e => {if (mounted.current) setError(getError(e))})
        return () => mounted.current = false;
    }, [])

    const BatchConfigForm = () => {

        const config = React.useRef({});
        const mounted = React.useRef(false);
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
                asyncRemote({url: "/batch/form/" + module})
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
        }, []);

        const handleFormChange = (value, deleted = {}) => {
            const merged = MutableMergeRecursive(config.current, value, deleted);
            config.current = {...merged};
        }

        const handleFormSave = () => {
            if (mounted.current) {
                setSendingForm(true);
                setFormError(null);
                setServerError(null);
            }
            asyncRemote({
                url: "/batch",
                method: "POST",
                data: { 
                    id: uuid4(),
                    name: name.current,
                    description: desc.current,
                    enabled: enabled.current,
                    module: module,
                    config: config.current
                }
            })
            .then(onSubmit)
            .catch(e => {if (mounted.current) {
                if (e.response.status === 422) {
                    if (mounted.current) setFormError(e.response.data);
                } else {
                    if (mounted.current) setServerError(getError(e));
                }
            }})
            .finally(() => {if (mounted.current) setSendingForm(false)})
        }

        return <>
            {
                loadingForm ?
                <CenteredCircularProgress />
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

    return <>
        <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="New batch" description="Here you can create a new batch resource." />
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Name" description="Please enter the name of your batch.">
                        <TextField 
                            sx={{width: 300}}
                            size="small"
                            variant="outlined"
                            label="Name"
                            onChange={(e => name.current = e.target.value)}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Description" description="Please enter the optional description for this batch.">
                        <TextField 
                            fullWidth
                            size="small"
                            multiline={true}
                            rows={4}
                            variant="outlined"
                            label="Description"
                            onChange={(e => desc.current = e.target.value)}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Enabled" description="You can disable this batch if you want.">
                        <BoolInput 
                            label="Enabled"
                            value={true}
                            onChange={() => enabled.current = !enabled.current}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Type" description="Please select the type of your batch resource.">
                        <Autocomplete 
                            freeSolo={false}
                            multiple={false}
                            fullWidth={false}
                            style={{width: 300}}
                            options={options}
                            getOptionLabel={option => option?.label || null}
                            isOptionEqualToValue={(option, value) => option === null || option.label === value.label}
                            onChange={(_, value) => {setModule(value?.value || null);}}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Type"
                                    variant="outlined"
                                    size="small"
                                />
                            )}
                        />
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
        {error && <ErrorsBox errorList={error} />}
        <div style={{margin: 20}}>
            <BatchConfigForm />
        </div>
    </>;
}