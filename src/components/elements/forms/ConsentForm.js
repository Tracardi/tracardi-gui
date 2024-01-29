import TextField from "@mui/material/TextField";
import React, {useEffect, useRef, useState} from "react";
import FormControlLabel from "@mui/material/FormControlLabel";
import {v4 as uuid4} from 'uuid';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import PropTypes from 'prop-types';
import {getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import TuiTagger from "../tui/TuiTagger";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import {useRequest} from "../../../remote_api/requestClient";
import ProductionButton from "./ProductionButton";

export default function ConsentForm({
                                        id,
                                        name,
                                        description,
                                        enabled,
                                        revokable,
                                        default_value,
                                        auto_revoke,
                                        required,
                                        tags,
                                        onSaveComplete
                                    }) {

    const [consentType, setConsentType] = useState((name) ? name : "");
    const [consentDescription, setConsentDescription] = useState((description) ? description : "");
    const [consentEnabled, setConsentEnabled] = useState((typeof enabled === "boolean") ? enabled : true);
    const [consentRequired, setConsentRequired] = useState((typeof revokable === "boolean") ? required : false);
    const [consentRevokable, setConsentRevokable] = useState((typeof revokable === "boolean") ? revokable : false);
    const [consentDefaultValue, setConsentDefaultValue] = useState(default_value || "grant");
    const [consentTags, setConsentTags] = useState(tags);
    const [consentAutoRevoke, setConsentAutoRevoke] = useState(auto_revoke || "");
    const [processing, setProcessing] = useState(false);
    const [consentTypeErrorMessage, setConsentTypeErrorMessage] = useState("");
    const [consentDescErrorMessage, setConsentDescErrorMessage] = useState("");
    const [error, setError] = useState(false);

    const mounted = useRef(false);
    const {request} = useRequest()

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        };
    }, []);

    const onSave = async () => {

        if (!consentType || !consentDescription) {
            if (consentType.length === 0) {
                setConsentTypeErrorMessage("Consent type can not be empty");
            } else {
                setConsentTypeErrorMessage("");
            }
            if (consentDescription.length === 0) {
                setConsentDescErrorMessage("Consent description can not be empty");
            } else {
                setConsentDescErrorMessage("");
            }
            return;
        }

        const payload = {
            id: (id) ? id : uuid4(),
            name: consentType,
            description: consentDescription,
            revokable: consentRevokable,
            default_value: consentDefaultValue,
            enabled: consentEnabled,
            auto_revoke: consentAutoRevoke,
            required: consentRequired,
            tags: consentTags && Array.isArray(consentTags) && consentTags.length > 0 ? consentTags : ["General"]
        }

        setProcessing(true);

        try {
            const response = await request({
                url: '/consent/type',
                method: 'post',
                data: payload
            })

            if (response?.data && mounted.current) {
                if (onSaveComplete) {
                    onSaveComplete(payload)
                }
            }

        } catch (e) {
            if (e && mounted.current) {
                setError(getError(e))
                // todo error;
            }
        } finally {
            if(mounted.current) {
                setProcessing(false);
            }
        }
    }

    const handleTagChange = (values) => {
        setConsentTags(values)
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name" description="Type consent name. Be as descriptive as possible.">
                    <TextField variant="outlined"
                               label="Consent type title"
                               value={consentType}
                               error={(typeof consentTypeErrorMessage !== "undefined" && consentTypeErrorMessage !== '' && consentTypeErrorMessage !== null)}
                               helperText={consentTypeErrorMessage}
                               onChange={(ev) => {
                                   setConsentType(ev.target.value)
                               }}
                               fullWidth
                               size="small"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header={<span>Description <sup>(Optional)</sup></span>} description="Consent type description. Be as descriptive as possible.">
                    <TextField variant="outlined"
                               label="Consent description"
                               multiline
                               rows={5}
                               value={consentDescription}
                               onChange={(ev) => {
                                   setConsentDescription(ev.target.value)
                               }}
                               error={(typeof consentDescErrorMessage !== "undefined" && consentDescErrorMessage !== '' && consentDescErrorMessage !== null)}
                               helperText={consentDescErrorMessage}
                               fullWidth
                               size="small"
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Settings"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Default consent value">
                    <TextField select
                               fullWidth
                               value={consentDefaultValue}
                               onChange={(e) => setConsentDefaultValue(e.target.value)}
                               label="Default value"
                               variant="outlined"
                               size="small">
                        <MenuItem value="grant">Grant consent</MenuItem>
                        <MenuItem value="deny">Deny consent</MenuItem>
                    </TextField>
                </TuiFormGroupField>
                <TuiFormGroupField header="Enable consent" description="Disabled consents will not be visible to user.">
                    <FormControlLabel
                        style={{marginLeft: 2}}
                        control={
                            <Switch
                                checked={consentEnabled}
                                onChange={(e) => setConsentEnabled(e.target.checked)}
                                name="enable"
                                color="primary"
                            />
                        }
                        label="Enable consent type"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Can customer not agree to this consent type "
                                   description="Some consents are required for the site to work.">
                    <FormControlLabel
                        style={{marginLeft: 2}}
                        control={
                            <Switch
                                checked={consentRequired}
                                onChange={(e) => setConsentRequired(e.target.checked)}
                                name="enable"
                                color="primary"
                            />
                        }
                        label="Is this consent type required for the site to work?"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Can customer revoke this consent "
                                   description="Same of the consents may be revokable.">
                    <FormControlLabel
                        style={{marginLeft: 2}}
                        control={
                            <Switch
                                checked={consentRevokable}
                                onChange={(e) => setConsentRevokable(e.target.checked)}
                                name="enable"
                                color="primary"
                            />
                        }
                        label="Is consent type to be revokable?"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Auto revoke this consent "
                                   description="If you set this option the consent will revoke after defined time. e.g. +14 days">
                    <TextField variant="outlined"
                               label="Auto revoke time"
                               value={consentAutoRevoke}
                               onChange={(ev) => {
                                   setConsentAutoRevoke(ev.target.value)
                               }}
                               fullWidth
                               size="small"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Consent tags"
                                   description="Tag the consent type to group it into meaningful groups.">
                    <TuiTagger tags={tags} onChange={handleTagChange}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        {error && <ErrorsBox errorList={error}/>}
        <ProductionButton
            label="Save"
            onClick={onSave}
            progress={processing}
            style={{justifyContent: "center"}}/>
    </TuiForm>
}

ConsentForm.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    enabled: PropTypes.bool,
    tags: PropTypes.array,
    revokable: PropTypes.bool,
    default_value: PropTypes.string,
    auto_revoke: PropTypes.string,
    required: PropTypes.bool,
    onSaveComplete: PropTypes.func
}
