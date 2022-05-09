import React from "react";
import { asyncRemote, getError } from "../../../remote_api/entrypoint";
import MutableMergeRecursive from "../../../misc/recursiveObjectMerge";
import { TextField, Autocomplete, responsiveFontSizes } from "@mui/material";
import { TuiForm, TuiFormGroup, TuiFormGroupHeader, TuiFormGroupContent, TuiFormGroupField } from "../tui/TuiForm";
import BoolInput from "./BoolInput";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import JsonForm from "./JsonForm";
import ErrorsBox from "../../errors/ErrorsBox";

export default function BatchEditForm ({ onSubmit, batch }) {

    const [module, setModule] = React.useState({});
    const name = React.useRef(batch.name);
    const desc = React.useRef(batch.desc);
    const enabled = React.useRef(batch.enabled);
    const [options, setOptions] = React.useState([]);
    const [error, setError] = React.useState(null);
    const mounted = React.useRef(false)

    React.useEffect(() => {
        mounted.current = true;
        asyncRemote({url: "/batches/types"})
        .then(response => {
            if (mounted.current) {
                setOptions(Object.keys(response.data).map(key => {return {label: response.data[key].name, value: response.data[key].module}}))
                setModule(Object.keys(response.data).map(key => {return {label: response.data[key].name, value: response.data[key].module}}).filter(el => el.value === batch.module)[0])
            }
        })
        .catch(e => {if (mounted.current) setError(getError(e))})
        return () => mounted.current = false;
    }, [batch])

    const BatchConfigForm = () => {

        const config = React.useRef(batch.config);
        const mounted = React.useRef(false);
        const [form, setForm] = React.useState(null);
        const [loadingForm, setLoadingForm] = React.useState(false);
        const [sendingForm, setSendingForm] = React.useState(false);
        const [formError, setFormError] = React.useState(null);
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
                asyncRemote({url: "/batch/form/" + module.value})
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
                    id: batch.id,
                    name: name.current,
                    description: desc.current,
                    enabled: enabled.current,
                    module: module.value,
                    config: config.current
                }
            })
            .then(onSubmit)
            .catch(e => {if (mounted.current) {
                if (e.response.status === 422) {
                    setFormError(e.response.data);
                } else {
                    setServerError(getError(e));
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

    return <>{batch && <>
        <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="New batch" description="Here you can create a new batch resource." />
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Name" description="Please enter the name of your batch.">
                        <TextField 
                            defaultValue={name.current}
                            sx={{width: 300}}
                            size="small"
                            variant="outlined"
                            label="Name"
                            onChange={(e => name.current = e.target.value)}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Description" description="Please enter the optional description for this batch.">
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
                    <TuiFormGroupField header="Enabled" description="You can disable this batch if you want.">
                        <BoolInput 
                            label="Enabled"
                            value={enabled.current}
                            onChange={() => enabled.current = !enabled.current}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Type" description="Please select the type of your batch resource.">
                        <Autocomplete 
                            value={module}
                            freeSolo={false}
                            multiple={false}
                            fullWidth={false}
                            style={{width: 300}}
                            options={options}
                            getOptionLabel={option => option?.label || ""}
                            isOptionEqualToValue={(option, value) => !value || option.value === value.value}
                            onChange={(_, value) => {setModule(value);}}
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
    </>}</>;
}