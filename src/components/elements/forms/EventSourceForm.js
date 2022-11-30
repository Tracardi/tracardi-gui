import {v4 as uuid4} from "uuid";
import React, {useEffect, useRef, useState} from "react";
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
import DocsLink from "../drawers/DocsLink";
import JsonForm from "./JsonForm";
import ShowHide from "../misc/ShowHide";
import {TuiSelectBridge} from "../tui/TuiSelectBridge";

const BridgeForm = ({id, value = null, onChange}) => {

    const [bridge, setBridge] = useState(null)

    const handleConfigChange = (value) => {
        if (onChange instanceof Function) {
            onChange(value)
        }
    }

    useEffect(() => {
        asyncRemote({
            url: `/bridge/${id}`
        }).then((response) => {
            if (response.data) {
                setBridge(response.data)
            }
        })
    }, [id]);

    if (bridge?.form) {
        return <JsonForm schema={bridge.form} values={value || bridge.config} onChange={handleConfigChange}/>
    }

    return ""

}

const EventSourceAdvancedForm = ({value: _value, onChange}) => {

    const [value, setValue] = useState(_value);

    const handleChange = (k, v) => {
        setValue({...value, [k]: v})
    }
    if (onChange instanceof Function) {
        onChange(value)
    }

    return <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event source advanced configuration"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event source access"
                                   description="Disabled event sources will not be accessible. ">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={value.enabled}
                            onChange={(ev) => handleChange('enabled', ev.target.checked)}
                            name="enabledSource"
                        />
                        <span>This event source is enabled</span>
                    </div>
                </TuiFormGroupField>
                <TuiFormGroupField header="Event source will synchronize profile updates"
                                   description="This event source will wait for the previous event to finish profile
                                   modification before it will accept new event. This feature prevents accidental
                                   profile overrides but slows event processing. If the events collected via
                                   this event source do not modify profile you may disable this feature. ">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={value.synchronize_profiles}
                            onChange={(ev) => handleChange('synchronize_profiles', ev.target.checked)}
                            name="enabledSource"
                        />
                        <span>
                        Profile synchronization enabled
                    </span>
                    </div>
                </TuiFormGroupField>
                <TuiFormGroupField header="Event source requires user consent"
                                   description="Data collected through this source requires user consent.
                                   System will embed the Javascript snippet to get the user consents.">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={value.requires_consent}
                            onChange={(ev) => handleChange('requires_consent', ev.target.checked)}
                            name="enabledSource"
                        />
                        <span>
                        Data collected through this source requires user consent
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
                            checked={value.returns_profile}
                            onChange={(ev) => handleChange('returns_profile', ev.target.checked)}
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
                            checked={value.transitional}
                            onChange={(ev) => handleChange('transitional', ev.target.checked)}
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
                            checked={value.permanent_profile_id}
                            onChange={(ev) => handleChange('permanent_profile_id', ev.target.checked)}
                            name="permanent"
                        />
                        <span>Make profile id permanent</span>
                    </div>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}

const EventSourceDescriptionForm = ({value: _value, style, errorNameMessage, onChange}) => {

    const [value, setValue] = useState(_value);

    const handleChange = (k, v) => {
        setValue({...value, [k]: v})
    }
    if (onChange instanceof Function) {
        onChange(value)
    }

    return <TuiForm style={style}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Event source description"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Event source id"
                                   description="Event source id is auto-generated. In most cases you do not have to change it.
                                   just leave it like it is. In rare cases when you would like to create a event source
                                   with user defined value, then unlock the field and type your event source id. If you change
                                   the id of existing event source new event source will be created.">
                    <DisabledInput label={"Event source id"}
                                   value={value.id}
                                   onChange={(v) => handleChange('id', v)}/>
                </TuiFormGroupField>

                <TuiFormGroupField header="Name" description={<>
                    <span>Event source name can be any string that identifies Event source. </span>
                    <DocsLink src="http://docs.tracardi.com/traffic/inbound/#event-sources">Would you like to learn
                        more?</DocsLink>
                </>}>
                    <TextField
                        label={"Event source name"}
                        value={value.name}
                        error={(typeof errorNameMessage !== "undefined" && errorNameMessage !== '' && errorNameMessage !== null)}
                        helperText={errorNameMessage}
                        onChange={(ev) => handleChange('name', ev.target.value)}
                        size="small"
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Description"
                                   description="Description will help you understand what kind of event source it is.">
                    <TextField
                        label={"Event source description"}
                        value={value.description}
                        multiline
                        rows={3}
                        onChange={(ev) => handleChange('description', ev.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                </TuiFormGroupField>

                <TuiFormGroupField header="Grouping"
                                   description="Sources can be grouped with tags that are typed here.">
                    <TuiTagger tags={value.groups}
                               onChange={(v) => handleChange('groups', v)}
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Tags" description="Set tags. Sources will be grouped by tags that lets you
                find sources quickly.">
                    {Array.isArray(value.tags) && value.tags.map((tag, index) => <Chip label={tag} key={index}
                                                                                       style={{marginLeft: 5}}/>)}
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}

const EventSourceForm = ({value, style, onClose}) => {

    if (!value) {
        value = {
            id: uuid4(),
            name: "",
            description: "",
            type: 'rest',
            bridge: {
                id: "",
                name: ""
            },
            enabled: true,
            synchronize_profiles: true,
            transitional: false,
            permanent_profile_id: false,
            returns_profile: false,
            requires_consent: false,
            tags: ['rest', 'api'],
            groups: [],
            config: null,
            manual: null
        }
    }

    const config = useRef(value.config)
    const metadata = useRef({
        id: (!value.id) ? uuid4() : value.id,
        name: value.name,
        description: value.description,
        groups: value.groups,
        tags: value.tags
    })
    const advanced = useRef({
        enabled: value.enabled,
        synchronize_profiles: value.synchronize_profiles,
        returns_profile: value.returns_profile,
        requires_consent: value.requires_consent,
        permanent_profile_id: value.permanent_profile_id,
        transitional: value.transitional,
    })

    const [bridge, setBridge] = useState(value?.bridge);
    const [errorNameMessage, setNameErrorMessage] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setError] = useState(null);

    const handleSubmit = async () => {

        if (!metadata.current.name || metadata.current.name.length === 0) {
            setNameErrorMessage("Source name can not be empty");
            return
        } else {
            setNameErrorMessage('');
        }

        setProcessing(true);

        try {
            const response = await asyncRemote({
                url: '/event-source',
                method: "POST",
                data: {
                    ...metadata.current,
                    ...advanced.current,
                    bridge: {
                        id: bridge.id,
                        name: bridge.name
                    },
                    type: bridge.type,
                    tags: value.tags,
                    config: config.current,
                    manual: bridge.manual
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

    const handleConfigChange = (value) => {
        config.current = value
    }

    const handleMetadataChange = value => {
        metadata.current = value
    }

    const handleBridgeChange = (value) => {
        setBridge(value)
    }

    const handleAdvancedChange = value => {
        advanced.current = value
    }

    return <div style={style}>
        <TuiForm>
            {errors && <ErrorsBox errorList={errors}/>}
            <TuiFormGroup>
                <TuiFormGroupHeader header="Event source type"/>
                <TuiFormGroupContent>
                    <TuiFormGroupField
                        description="Data in Tracardi is collected through an open event source. Event source use a data bridge
                        to get data. Data bridge can open and API endpoint or connect to the external system to monitor
                        for changes. Please select the how would you like to collect data.">

                        <TuiSelectBridge value={bridge} onSetValue={handleBridgeChange}/>

                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
        {bridge.id && <>
            <EventSourceDescriptionForm value={metadata.current}
                                        errorNameMessage={errorNameMessage}
                                        onChange={handleMetadataChange}/>
            <BridgeForm id={bridge?.id} value={config.current} onChange={handleConfigChange}/>
            <ShowHide label="Advanced settings" style={{marginBottom: 10}}>
                <EventSourceAdvancedForm value={advanced.current} onChange={handleAdvancedChange}/>
            </ShowHide>
            <div>
                {errors && <ErrorsBox errorList={errors}/>}
                <Button label="Save"
                        error={errors !== null || errorNameMessage}
                        onClick={handleSubmit}
                        progress={processing}
                        style={{justifyContent: "center"}}
                />
            </div>
        </>
        }
    </div>
}

EventSourceForm.propTypes = {
    value: PropTypes.object,
    style: PropTypes.object,
    onClose: PropTypes.func
}


export default EventSourceForm;