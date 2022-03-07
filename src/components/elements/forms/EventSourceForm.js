import {v4 as uuid4} from "uuid";
import React, {useEffect, useState} from "react";
import {request} from "../../../remote_api/uql_api_endpoint";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import DisabledInput from "./inputs/DisabledInput";
import TuiSelectEventSourceType from "../tui/TuiSelectEventSourceType";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import TuiTagger from "../tui/TuiTagger";
import Button from "./Button";
import PropTypes from "prop-types";
import ErrorsBox from "../../errors/ErrorsBox";
import Chip from "@mui/material/Chip";

const EventSourceForm = ({value, style, onClose}) => {

    if (!value) {
        value = {
            id: uuid4(),
            name: "",
            type: null,
            description: "",
            enabled: false,
            transitional: false,
            tags: [],
            groups: []
        }
    }

    const [enabledSource, setEnabledSource] = useState(value?.enabled);
    const [transitional, setTransitional] = useState(value?.transitional);
    const [type, setType] = useState(null);  // It is set in useEffects after the types are loaded
    const [name, setName] = useState(value?.name);
    const [id, setId] = useState(value?.id);
    const [tags, setTags] = useState(value?.tags);
    const [groups, setGroups] = useState(value?.groups);
    const [description, setDescription] = useState(value?.description);
    const [errorTypeMessage, setTypeErrorMessage] = useState('');
    const [errorNameMessage, setNameErrorMessage] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setError] = useState(null);
    const [credentialTypes, setCredentialTypes] = useState({});

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
                    setCredentialTypes(response.data.result);
                    // Original type value is an id  e.g "aws", but "type" state is and object with id and name,
                    // e.g {name" "AWS credentials", id: "aws"}
                    // It must be set after the available list of event sources are loaded.
                    setType(getIdNameFromType(value?.type, response.data.result));
                    // setTags(getIdTagsFromType(value?.type, response.data.result));
                }
            }
        )
    }, [])  // todo: setting value here make infinite request

    const handleSubmit = async () => {

        if (!name || name.length === 0 || !type?.name) {
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
                    description: description,
                    type: type.id,  // Save only type id not the whole object.
                    enabled: enabledSource,
                    transitional: transitional,
                    tags: tags,
                    groups:  groups
                }
            })

            await asyncRemote({
                url: '/event-sources/refresh',
                method: "GET",
            })

            if (response.status === 404) {
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

    const handleTypeChange = (type) => {
        setType(type);
        if (type?.id in credentialTypes) {
            const template = credentialTypes[type?.id]
            setTags(template?.tags)
        }
    }

    return <TuiForm style={style}>
        {errors && <ErrorsBox errorList={errors}/>}
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event source configuration"
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
                                              onSetValue={handleTypeChange}
                                              errorMessage={errorTypeMessage}/>

                </TuiFormGroupField>
                <TuiFormGroupField header="Event source access"
                                   description="Disabled event sources will not be accessible.">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={enabledSource}
                            onChange={(ev) => setEnabledSource(ev.target.checked)}
                            name="enabledSource"
                        />
                        <span>
                        This event source is enabled
                    </span>
                    </div>
                </TuiFormGroupField>
                <TuiFormGroupField header="Are events from this source transitional?"
                                   description="Transitional events are only processed but not saved in database. If you set
                                   source to collect only transitional event then no event will be stored in Tracardi. By default
                                   events are saved in Tracardi storage.  Control over event is passed to the client. That
                                   means the event may become transitional if it is sent with options set to saveEvents: false.">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={transitional}
                            onChange={(ev) => setTransitional(ev.target.checked)}
                            name="transitional"
                        />
                        <span>
                        Event from this source are transitional (ephemeral)
                    </span>
                    </div>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event source description"/>
            <TuiFormGroupContent>
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

                <TuiFormGroupField header="Grouping" description="Sources can be grouped with tags that are typed here.">
                    <TuiTagger tags={groups} onChange={setGroups}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Tags" description="Set tags. Sources will be grouped by tags that lets you
                find sources quickly.">
                    {Array.isArray(tags) && tags.map((tag, index) => <Chip label={tag} key={index} style={{marginLeft: 5}}/>)}
                </TuiFormGroupField>

            </TuiFormGroupContent>
        </TuiFormGroup>
        {errors && <ErrorsBox errorList={errors}/>}
        <Button label="Save"
                error={errors !== null}
                onClick={handleSubmit}
                progress={processing}
                style={{justifyContent: "center"}}
        />

    </TuiForm>
}

EventSourceForm.propTypes = {
    value: PropTypes.object,
    style: PropTypes.object,
    onClose: PropTypes.func
}


export default EventSourceForm;