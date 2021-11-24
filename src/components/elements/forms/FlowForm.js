import TextField from "@material-ui/core/TextField";
import React, {useState} from "react";
import Button from "./Button";
import './FlowForm.css';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import {request} from "../../../remote_api/uql_api_endpoint";
import {v4 as uuid4} from 'uuid';
import ElevatedBox from "../misc/ElevatedBox";
import FormSubHeader from "../misc/FormSubHeader";
import FormDescription from "../misc/FormDescription";
import FormHeader from "../misc/FormHeader";
import Rows from "../misc/Rows";
import TuiTaggerFlow from "../tui/TuiTaggerFlow";
import {connect} from "react-redux";
import {showAlert} from "../../../redux/reducers/alertSlice";
import PropTypes from 'prop-types';

function FlowForm({
                      id,
                      name,
                      description,
                      enabled,
                      projects,
                      onFlowSaveComplete,
                      showAlert,
                      draft = false,
                      refreshMetaData = true
                  }) {

    const [flowName, setFlowName] = useState((name) ? name : "");
    const [flowDescription, setFlowDescription] = useState((description) ? description : "");
    const [flowEnabled, setFlowEnabled] = useState((typeof enabled === "boolean") ? enabled : true);
    const [flowTags, setFlowTags] = useState(projects);
    const [processing, setProcessing] = useState(false);
    const [nameErrorMessage, setNameErrorMessage] = useState("");

    const onSave = () => {

        if (!flowName) {
            if (flowName.length === 0) {
                setNameErrorMessage("Flow name can not be empty");
            } else {
                setNameErrorMessage("");
            }
            return;
        }

        const payload = {
            id: (id) ? id : uuid4(),
            name: flowName,
            description: flowDescription,
            enabled: flowEnabled,
            projects: flowTags && Array.isArray(flowTags) && flowTags.length > 0 ? flowTags : ["General"]
        }
        setProcessing(true);
        request({
                url: (draft) ? '/flow/draft/metadata' : '/flow/metadata',
                method: 'post',
                data: payload
            },
            setProcessing,
            (e) => {
                if (e) {
                    showAlert({message: e[0].msg, type: "error", hideAfter: 5000});
                }
            },
            (data) => {
                if (data !== false) {
                    if(refreshMetaData === true) {
                        setProcessing(true);
                        // Refresh index in elastic so we can see it in the list.
                        request({
                                url: '/flow/metadata/refresh'
                            },
                            setProcessing,
                            () => {
                            },
                            () => {
                                if (onFlowSaveComplete) {
                                    onFlowSaveComplete(payload)
                                }
                            }
                        )
                    } else {
                        if (onFlowSaveComplete) {
                            onFlowSaveComplete(payload)
                        }
                    }

                }
            })
    }

    const onTagChange = (values) => {
        setFlowTags(values)
    }

    return <div className="FlowForm">

        <FormHeader>Description</FormHeader>
        <ElevatedBox>
            <FormSubHeader>Name</FormSubHeader>
            <FormDescription>Edit flow name. Be as descriptive as possible.</FormDescription>
            <div style={{marginTop: 20}}>
                <TextField id="flow-name"
                           variant="outlined"
                           label="Flow name"
                           value={flowName}
                           error={(typeof nameErrorMessage !== "undefined" && nameErrorMessage !== '' && nameErrorMessage !== null)}
                           helperText={nameErrorMessage}
                           onChange={(ev) => {
                               setFlowName(ev.target.value)
                           }}
                           size="small"
                           style={{width: "70%"}}
                />
            </div>
            <FormSubHeader>Description <sup style={{fontSize: "70%"}}>* optional</sup></FormSubHeader>
            <FormDescription>Flow description. Be as descriptive as possible.</FormDescription>
            <div style={{marginTop: 20}}>
                <TextField id="flow-description"
                           variant="outlined"
                           label="Flow description"
                           multiline
                           rows={5}
                           value={flowDescription}
                           onChange={(ev) => {
                               setFlowDescription(ev.target.value)
                           }}
                           size="small"
                           style={{width: "70%"}}
                />
            </div>
        </ElevatedBox>

        <FormHeader>Settings</FormHeader>
        <ElevatedBox>
            <FormDescription>Disabled flows will not be executed.</FormDescription>
            <FormControlLabel
                style={{marginLeft: 2}}
                control={
                    <Checkbox
                        checked={flowEnabled}
                        onChange={() => setFlowEnabled(!flowEnabled)}
                        name="enable"
                        color="primary"
                    />
                }
                label="Enable flow"
            />

            <FormDescription>Tag the flow with project name to group it into meaningful groups.</FormDescription>
            <TuiTaggerFlow tags={projects} onChange={onTagChange}/>
        </ElevatedBox>

        <Rows style={{marginLeft: 20}}>
            <Button label="Save" onClick={onSave} progress={processing}/>
        </Rows>

    </div>
}

FlowForm.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    enabled: PropTypes.bool,
    projects: PropTypes.array,
    onFlowSaveComplete: PropTypes.func,
    draft: PropTypes.bool,
    refreshMetaData: PropTypes.bool
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