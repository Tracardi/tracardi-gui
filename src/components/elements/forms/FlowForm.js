import TextField from "@mui/material/TextField";
import React, {useEffect, useRef, useState} from "react";
import {v4 as uuid4} from 'uuid';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import PropTypes from 'prop-types';
import TuiTagger from "../tui/TuiTagger";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import {useRequest} from "../../../remote_api/requestClient";
import ProductionButton from "./ProductionButton";

function FlowForm({
                      id,
                      name,
                      description,
                      tags,
                      onFlowSaveComplete,
                      showAlert,
                      type = 'collection',
                      disableType = false
                  }) {

    const [flowName, setFlowName] = useState((name) ? name : "");
    const [flowDescription, setFlowDescription] = useState((description) ? description : "");
    const [flowTags, setFlowTags] = useState(tags);
    const [flowType, setFlowType] = useState(type);
    const [processing, setProcessing] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState("");

    const mounted = useRef(false);
    const {request} = useRequest()

    useEffect(() => {
        mounted.current = true;

        return () => {
            mounted.current = false;
        }
    }, [])

    const onSave = async () => {

        if (!flowName) {
            if (flowName.length === 0) {
                setNameErrorMessage("Flow name can not be empty");
            } else {
                setNameErrorMessage("");
            }
            return;
        }

        try {
            setProcessing(true);

            const payload = {
                id: (id) ? id : uuid4(),
                name: flowName,
                description: flowDescription,
                tags: flowTags && Array.isArray(flowTags) && flowTags.length > 0 ? flowTags : ["General"],
                type: flowType
            }

            const response = await request({
                url: '/flow/metadata',
                method: 'post',
                data: payload
            })

            if (response) {
                if (onFlowSaveComplete) {
                    onFlowSaveComplete(payload)
                }
            }

        } catch (e) {
            if (e && mounted.current) {
                showAlert({message: e.toString(), type: "error", hideAfter: 5000});
            }
        } finally {
            if (mounted.current) {
                setProcessing(false)
            }
        }
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Flow description" description="Data required to create a flow."/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Name" description="Type flow name. Be as descriptive as possible.">
                    <TextField id="flow-name"
                               variant="outlined"
                               label="Flow name"
                               value={flowName}
                               error={(typeof nameErrorMessage !== "undefined" && nameErrorMessage !== '' && nameErrorMessage !== null)}
                               helperText={nameErrorMessage}
                               onChange={(ev) => {
                                   setFlowName(ev.target.value)
                               }}
                               fullWidth
                               size="small"
                    />
                </TuiFormGroupField>
                <TuiFormGroupField header={<span>Description <sup>(Optional)</sup></span>} description="Flow description. Be as descriptive as possible.">
                    <TextField id="flow-description"
                               variant="outlined"
                               label="Flow description"
                               multiline
                               rows={5}
                               value={flowDescription}
                               onChange={(ev) => {
                                   setFlowDescription(ev.target.value)
                               }}
                               fullWidth
                               size="small"
                    />
                </TuiFormGroupField>
                {!disableType && <TuiFormGroupField header="Type" description="Flow type. Flows can be used to collect or segment data.">
                    <FormControl sx={{m: 1, minWidth: 120}} size="small">
                        <InputLabel id="flow-type">Flow type</InputLabel>
                        <Select
                            defaultValue="collection"
                            labelId="flow-type"
                            variant="outlined"
                            size="small"
                            value={flowType}
                            label="Flow type"
                            onChange={(e) => setFlowType(e.target.value)}
                        >
                            <MenuItem value={"collection"}>Collection</MenuItem>
                            <MenuItem value={"segmentation"}>Segmentation</MenuItem>
                        </Select>
                    </FormControl>
                </TuiFormGroupField>}
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Settings"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Flow tags"
                                   description="Tag the flow with project name to group it into meaningful groups.">
                    <TuiTagger
                        label="Flow tags"
                        onChange={setFlowTags}
                        tags={tags}
                    />
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <ProductionButton
            label="Save"
            onClick={onSave}
            progress={processing}
            style={{justifyContent: "center"}}/>
    </TuiForm>
}

FlowForm.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    type: PropTypes.string,
    disableType: PropTypes.bool,
    tags: PropTypes.array,
    onFlowSaveComplete: PropTypes.func
}


const mapProps = (state) => {
    return {
        notification: state.notificationReducer,
    }
};
export default connect(
    mapProps,
    {showAlert}
)(FlowForm)