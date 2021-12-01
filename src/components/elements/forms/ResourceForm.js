import React, {useEffect, useState} from "react";
import Button from "./Button";
import TextField from "@material-ui/core/TextField";
import Switch from "@material-ui/core/Switch";
import {v4 as uuid4} from 'uuid';
import JsonEditor from "../editors/JsonEditor";
import {request} from "../../../remote_api/uql_api_endpoint";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import PropTypes from 'prop-types';
import TuiSelectResourceType from "../tui/TuiSelectResourceType";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import DisabledInput from "./inputs/DisabledInput";
import Chip from "@material-ui/core/Chip";


function ResourceForm({init, onClose, showAlert}) {

    if (!init) {
        init = {
            id: uuid4(),
            name: "",
            type: {},
            description: "",
            config: {},
            consent: false,
            enabled: false,
            tags: []
        }
    }

    const [requiresConsent, _setRequiresConsent] = useState(init?.consent);
    const [enabledSource, setEnabledSource] = useState(init?.enabled);
    const [type, setType] = useState(init?.type);
    const [name, setName] = useState(init?.name);
    const [id, setId] = useState(init?.id);
    const [tags, setTags] = useState(init?.tags);
    const [description, setDescription] = useState(init?.description);
    const [errorTypeMessage, setTypeErrorMessage] = useState('');
    const [errorNameMessage, setNameErrorMessage] = useState('');
    const [config, setConfig] = useState(JSON.stringify(init?.config, null, '  '));
    const [processing, setProcessing] = useState(false);
    const [credentialTypes, setCredentialTypes] = useState({});

    useEffect(() => {
        request(
            {url: "/resources/type/configuration"},
            () => {
            },
            () => {
            },
            (response) => {
                if (response) {
                    setCredentialTypes(response.data.result)
                }
            }
        )
    }, [])

    const setRequiresConsent = (ev) => {
        _setRequiresConsent(ev.target.checked)
    }

    const onSubmit = (payload) => {
        setProcessing(true);
        request({
                url: "/resource",
                method: "post",
                data: payload
            },
            setProcessing,
            (e) => {
                if (e) {
                    showAlert({message: e[0].msg, type: "error", hideAfter: 5000});
                }
            },
            (data) => {
                if (data) {
                    request({
                            url: '/resources/refresh'
                        },
                        setProcessing,
                        () => {
                        },
                        () => {
                            if (onClose) {
                                onClose(data)
                            }
                        }
                    )
                }
            }
        )
    }

    const setTypeAndDefineCredentialsTemplate = (type) => {
        setType(type)

        if (type?.id in credentialTypes) {
            const template = credentialTypes[type.id]
            setConfig(JSON.stringify(template?.config, null, '  '))
            setTags(template?.tags)
        }
    }

    const handleSubmit = () => {

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

        try {
            const payload = {
                id: (!id) ? uuid4() : id,
                name: name,
                description: description,
                type: type.name,
                config: (config === "") ? {} : JSON.parse(config),
                consent: requiresConsent,
                enabled: enabledSource,
                tags: tags
            };
            onSubmit(payload)
        } catch (e) {
            alert("Invalid JSON in field CONFIG.")
        }
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Resource"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Resource id"
                                   description="Resource id is auto-generated. In most cases you do not have to do nothing
                                   just leave it like it is. In rare cases when you would like to create a resource
                                   with user defined value, then unlock the field and type your resource id. If you change
                                   the id of existing resource new resource will be created.">
                    <DisabledInput label={"Resource id"}
                                   value={id}
                                   onChange={setId}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Resource type"
                                   description="Resource type defines storage or endpoint type. ">
                    <TuiSelectResourceType value={type}
                                           onSetValue={setTypeAndDefineCredentialsTemplate}
                                           errorMessage={errorTypeMessage}/>
                </TuiFormGroupField>
                <TuiFormGroupField header="Name" description="Resource name can be any string that
                    identifies resource.">
                    <TextField
                        label={"Resource name"}
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
                <TuiFormGroupField header="Description" description="Description will help you understand what kind of resource it is.">
                    <TextField
                        label={"Rule description"}
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
                <TuiFormGroupField header="Tags" description="Resources are auto-tagged. This is only information on
                resource type. It is used internally by the system.">
                    {Array.isArray(tags) && tags.map((tag, index) => <Chip label={tag} key={index} style={{marginLeft: 5}}/>)}
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Access and Consent"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Resource consent" description="Check if this resource requires user consent? E.g. web pages
                    located in Europe require user consent to comply with GDPR. ">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={requiresConsent}
                            onChange={setRequiresConsent}
                            name="consentRequired"
                        />
                        <span>
                            This resource requires user consent
                        </span>
                    </div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <Switch
                            checked={enabledSource}
                            onChange={() => setEnabledSource(!enabledSource)}
                            name="enabledSource"
                        />
                        <span>
                        This resource is enabled
                    </span>
                    </div>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Configuration"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Credentials or Access tokens" description="This json data will be an
                encrypted part of resource. Please pass here all the credentials or access configuration information,
                such as hostname, port, username and password, etc. This part can be empty or left as it is if resource does not
                require authorization.">
                </TuiFormGroupField>
                <fieldset>
                    <legend>Credentials configuration</legend>
                    <JsonEditor value={config} onChange={setConfig}/>
                </fieldset>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <Button label="Save"
                onClick={handleSubmit}
                progress={processing}
                style={{justifyContent: "center"}}
        />
    </TuiForm>
}

ResourceForm.propTypes = {
    init: PropTypes.object,
    onClose: PropTypes.func
}

const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert}
)(ResourceForm)