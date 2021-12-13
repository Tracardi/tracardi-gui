import {v4 as uuid4} from "uuid";
import React, {useEffect, useState} from "react";
import {request} from "../../../remote_api/uql_api_endpoint";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import DisabledInput from "./inputs/DisabledInput";
import TuiSelectEventSourceType from "../tui/TuiSelectEventSourceType";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import TuiTagger from "../tui/TuiTagger";
import Button from "./Button";
import PropTypes from "prop-types";
import ErrorsBox from "../../errors/ErrorsBox";

const EventSourceCreateForm = ({value, onConfig, onClose}) => {

    if (!value) {
        value = {
            id: uuid4(),
            name: "",
            url: "",
            type: null,
            description: "",
            enabled: false,
            tags: [],
            configurable: false
        }
    }

    const [enabledSource, setEnabledSource] = useState(value?.enabled);
    const [type, setType] = useState(null);  // It is set in useEffects after the types are loaded
    const [name, setName] = useState(value?.name);
    const [url, setUrl] = useState(value?.url);
    const [id, setId] = useState(value?.id);
    const [tags, setTags] = useState(value?.tags);
    const [description, setDescription] = useState(value?.description);
    const [errorTypeMessage, setTypeErrorMessage] = useState('');
    const [errorNameMessage, setNameErrorMessage] = useState('');
    const [errorUrlMessage, setUrlErrorMessage] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setError] = useState(null);

    const getIdNameFromType = (type, types) => {
        if (type in types) {
            return {id: type, name: types[type]['name']}
        }
        return {id: type, name: type}
    }

    useEffect(() => {
        request(
            {url: "/event-sources/type/configuration"},
            () => {
            },
            () => {
            },
            (response) => {
                if (response) {
                    // Original type value is an id  e.g "aws", but "type" state is and object with id and name,
                    // e.g {name" "AWS credentials", id: "aws"}
                    // It must be set after the available list of event sources are loaded.
                    setType(getIdNameFromType(value?.type, response.data.result));
                }
            }
        )
    }, [])  // todo: setting value here make infinite request

    const handleSubmit = async () => {

        if (!name || name.length === 0 || !type?.name || !url || url.length === 0) {
            if (!name || name.length === 0) {
                setNameErrorMessage("Source name can not be empty");
            } else {
                setNameErrorMessage("");
            }

            if (!type?.name) {
                setTypeErrorMessage("Source type can not be empty");
            } else {
                setTypeErrorMessage("");
            }

            if (!url || url.length === 0) {
                setUrlErrorMessage("Source URL can not be empty");
            } else {
                setUrlErrorMessage("");
            }

            return;
        }


        setProcessing(true);

        try {
            const response = await asyncRemote({
                url: '/event-source',
                method: "POST",
                data: {
                    id: (!id) ? uuid4() : id,
                    name: name,
                    url: url,
                    description: description,
                    type: type.id,  // Save only type id not the whole object.
                    enabled: enabledSource,
                    tags: tags
                }
            })

            await asyncRemote({
                url: '/event-sources/refresh',
                method: "GET",
            })

            if (response.status === 206) {
                onConfig(response.data);
            } else if (response.status === 404) {
                setError(response.data)
            } else {
                if (onClose) {
                    onClose(response.data)
                }
            }

        } catch (e) {
            setProcessing(false);
            setError(getError(e))
        }

    }

    return <TuiForm>
        {errors && <ErrorsBox errorList={errors} />}
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event source"
                                description="This is a source where Tracardi will collect events from."/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event source id"
                                   description="Event source id is auto-generated. In most cases you do not have to do nothing
                                   just leave it like it is. In rare cases when you would like to create a event source
                                   with user defined value, then unlock the field and type your event source id. If you change
                                   the id of existing event source new event source will be created.">
                    <DisabledInput label={"Event source id"}
                                   value={id}
                                   onChange={setId}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Event source type"
                                   description="Event source type defines storage or endpoint type. ">
                    <TuiSelectEventSourceType value={type}
                                              onSetValue={setType}
                                              errorMessage={errorTypeMessage}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Source URL" description="Event source URL is required for Tracardi PRO services.
                Web page source needs it only for informational purposes.">
                    <TextField
                        label="Event source URL"
                        value={url}
                        error={(typeof errorUrlMessage !== "undefined" && errorUrlMessage !== '' && errorUrlMessage !== null)}
                        helperText={errorUrlMessage}
                        onChange={(ev) => {
                            setUrl(ev.target.value)
                        }}
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Name" description="Event source name can be any string that
                    identifies Event source.">
                    <TextField
                        label={"Event source name"}
                        value={name}
                        error={(typeof errorNameMessage !== "undefined" && errorNameMessage !== '' && errorNameMessage !== null)}
                        helperText={errorNameMessage}
                        onChange={(ev) => {
                            setName(ev.target.value)
                        }}
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Description"
                                   description="Description will help you understand what kind of event source it is.">
                    <TextField
                        label={"Event source description"}
                        value={description}
                        multiline
                        rows={3}
                        onChange={(ev) => {
                            setDescription(ev.target.value)
                        }}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Event source access"
                                   description="Disabled event sources will not be accessible.">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={enabledSource}
                            onChange={() => setEnabledSource(!enabledSource)}
                            name="enabledSource"
                        />
                        <span>
                        This event source is enabled
                    </span>
                    </div>
                </TuiFormGroupField>
                <TuiFormGroupField header="Tags">
                    <TuiTagger tags={tags} onChange={setTags} value={tags}/>
                </TuiFormGroupField>

            </TuiFormGroupContent>
        </TuiFormGroup>
        {errors && <ErrorsBox errorList={errors} />}
        <Button label="Save"
                error={errors!==null}
                onClick={handleSubmit}
                progress={processing}
                style={{justifyContent: "center"}}
        />

    </TuiForm>
}

EventSourceCreateForm.propTypes = {
    value: PropTypes.object,
    onClose: PropTypes.func
}


export default EventSourceCreateForm;