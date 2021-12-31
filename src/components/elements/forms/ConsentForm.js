import TextField from "@material-ui/core/TextField";
import React, {useState} from "react";
import Button from "./Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {request} from "../../../remote_api/uql_api_endpoint";
import {v4 as uuid4} from 'uuid';
import TuiTaggerFlow from "../tui/TuiTaggerFlow";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import PropTypes from 'prop-types';
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import TuiTagger from "../tui/TuiTagger";
import MenuItem from "@material-ui/core/MenuItem";

export default function ConsentForm({
                                        id,
                                        name,
                                        description,
                                        enabled,
                                        revokable,
                                        default_value,
                                        tags,
                                        onSaveComplete
                                    }) {

    const [consentType, setConsentType] = useState((name) ? name : "");
    const [consentDescription, setConsentDescription] = useState((description) ? description : "");
    const [consentEnabled, setConsentEnabled] = useState((typeof enabled === "boolean") ? enabled : true);
    const [consentRevokable, setConsentRevokable] = useState((typeof revokable === "boolean") ? revokable : true);
    const [consentDefaultValue, setConsentDefaultValue] = useState(default_value || "grant");
    const [consentTags, setConsentTags] = useState(tags);
    const [processing, setProcessing] = useState(false);
    const [consentTypeErrorMessage, setConsentTypeErrorMessage] = useState("");
    const [consentDescErrorMessage, setConsentDescErrorMessage] = useState("");
    const [error, setError] = useState(false);

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
            tags: consentTags && Array.isArray(consentTags) && consentTags.length > 0 ? consentTags : ["General"]
        }

        setProcessing(true);

        try {
            const response = await asyncRemote({
                url: '/consent/type',
                method: 'post',
                data: payload
            })

            if (response?.data) {
                await asyncRemote({
                    url: '/consents/type/refresh'
                })
                if (onSaveComplete) {
                    onSaveComplete(payload)
                }
            }

        } catch (e) {
            if (e) {
                setError(getError(e))
                // todo error;
            }
        } finally {
            setProcessing(false);
        }
    }

    const handleTagChange = (values) => {
        setConsentTags(values)
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Consent description"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name" description="Type consent name. Be as descriptive as possible.">
                    <TextField variant="outlined"
                               label="Consent type"
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
                <TuiFormGroupField header="Description" description="Flow description. Be as descriptive as possible.">
                    <TextField id="flow-description"
                               variant="outlined"
                               label="Flow description"
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
                            <Checkbox
                                checked={consentEnabled}
                                onChange={(e) => setConsentEnabled(e.target.checked)}
                                name="enable"
                                color="primary"
                            />
                        }
                        label="Enable consent type"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Can customer revoke this consent "
                                   description="Most of the consents must should be revokable.">
                    <FormControlLabel
                        style={{marginLeft: 2}}
                        control={
                            <Checkbox
                                checked={consentRevokable}
                                onChange={(e) => setConsentRevokable(e.target.checked)}
                                name="enable"
                                color="primary"
                            />
                        }
                        label="Is consent type to be revokable?"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header="Consent tags"
                                   description="Tag the consent type to group it into meaningful groups.">
                    <TuiTagger tags={tags} value={tags} onChange={handleTagChange}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        {error && <ErrorsBox errorList={error}/>}
        <Button label="Save" onClick={onSave} progress={processing} style={{justifyContent: "center"}}/>
    </TuiForm>
}

ConsentForm.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    enabled: PropTypes.bool,
    tags: PropTypes.array,
    onSaveComplete: PropTypes.func
}
