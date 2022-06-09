import {v4 as uuid4} from "uuid";
import React, {useState} from "react";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import DisabledInput from "./inputs/DisabledInput";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import TuiTagger from "../tui/TuiTagger";
import Button from "./Button";
import PropTypes from "prop-types";
import ErrorsBox from "../../errors/ErrorsBox";
import Chip from "@mui/material/Chip";
import NotImplemented from "../misc/NotImplemented";

const EventSourceForm = ({value, style, onClose}) => {

    if (!value) {
        value = {
            id: uuid4(),
            name: "",
            type: 'rest',
            description: "",
            enabled: true,
            transitional: false,
            permanent_profile_id: false,
            returns_profile: false,
            tags: ['rest', 'api'],
            groups: []
        }
    }

    const [enabledSource, setEnabledSource] = useState(value?.enabled);
    const [transitional, setTransitional] = useState(value?.transitional);
    const [permanent, setPermanent] = useState(value?.permanent_profile_id);
    const [returnsProfile, setReturnsProfile] = useState(value?.returns_profile || false);
    const [name, setName] = useState(value?.name);
    const [id, setId] = useState(value?.id);
    const [groups, setGroups] = useState(value?.groups);
    const [description, setDescription] = useState(value?.description);
    const [errorNameMessage, setNameErrorMessage] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setError] = useState(null);


    const handleSubmit = async () => {

        if (!name || name.length === 0) {
            if (!name || name.length === 0) {
                setNameErrorMessage("Source name can not be empty");
            } else {
                setNameErrorMessage("");
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
                    type: value.type,
                    enabled: enabledSource,
                    transitional: transitional,
                    tags: value.tags,
                    groups: groups,
                    returns_profile: returnsProfile,
                    permanent_profile_id: permanent
                }
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

                <TuiFormGroupField header="Grouping"
                                   description="Sources can be grouped with tags that are typed here.">
                    <TuiTagger tags={groups} onChange={setGroups}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Tags" description="Set tags. Sources will be grouped by tags that lets you
                find sources quickly.">
                    {Array.isArray(value.tags) && value.tags.map((tag, index) => <Chip label={tag} key={index}
                                                                           style={{marginLeft: 5}}/>)}
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event source advanced configuration" />
            <TuiFormGroupContent>
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
                <TuiFormGroupField header="Return profile data in response to client"
                                   description="For security reasons, the system returns only the profile id when
                                   collecting data (events). In justified cases, it is possible to provide the browser
                                   with all data collected in the profile. When turned on, set event
                                   options to 'profile: true' to include profile data in response. Read 'event tracking'
                                   chapter in manual for details and use this option with caution. ">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={returnsProfile}
                            onChange={(ev) => setReturnsProfile(ev.target.checked)}
                            name="returnsProfile"
                        />
                        <span>
                        Return profile data with response
                    </span>
                    </div>
                </TuiFormGroupField>
                <TuiFormGroupField header="Make events from this source always transitional"
                                   description="Transitional events are only processed but not saved in database. If you set
                                   source to collect only transitional events then no event will be stored in the system.
                                   By default control over the event configuration is passed to the client. That
                                   means the event may become transitional if it is sent with options set to 'saveEvents: false'.
                                   Read 'event tracking' chapter in manual for details.">
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
                <TuiFormGroupField header="Make profile id permanent"
                                   description="Profile id may change due to being merged with other profile. If you want
                                   profile it to stay always the same enable this option. For security reasons when you
                                   allow permanent profile ids it is advisable to disallow profile data in response to
                                   collected event. See manual for explanation.">
                    <NotImplemented>This feature is not implemented yet</NotImplemented>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={permanent}
                            onChange={(ev) => setPermanent(ev.target.checked)}
                            name="permanent"
                        />
                        <span>Make profile id permanent</span>
                    </div>
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