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
import TagTextFieldForProjects from "./inputs/TagTextFieldForProjects";

export default function FlowForm({id, name, description, enabled, projects, onFlowSaveComplete, draft = false}) {

    const [flowName, setFlowName] = useState((name) ? name : "");
    const [flowDescription, setFlowDescription] = useState((description) ? description : "");
    const [flowEnabled, setFlowEnabled] = useState((typeof enabled === "boolean") ? enabled : true);
    const [flowTags, setFlowTags] = useState(projects);

    const onSave = () => {

        const payload = {
            id: (id) ? id : uuid4(),
            name: flowName,
            description: flowDescription,
            enabled: flowEnabled,
            projects: flowTags
        }

        request({
                url: (draft) ? '/flow/draft/metadata' : '/flow/metadata',
                method: 'post',
                data: payload
            },
            () => {
            },
            () => {
            },
            (data) => {
                if (onFlowSaveComplete) {
                    onFlowSaveComplete(payload)
                }
            })
    }

    const onTagChange = (values) => {
        setFlowTags(values)
        console.log(flowTags)
    }

    return <div className="FlowForm">

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
            <TagTextFieldForProjects
                initTags={projects}
                onChange={onTagChange}/>
        </ElevatedBox>

        <FormHeader>Description</FormHeader>
        <ElevatedBox>
            <FormSubHeader>Name</FormSubHeader>
            <FormDescription>Edit flow name. Be as descriptive as possible.</FormDescription>
            <div style={{marginTop: 20}}>
                <TextField id="flow-name"
                           variant="outlined"
                           label="Flow name"
                           value={flowName}
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

        <Rows style={{marginLeft: 20}}>
            <Button label="Save" onClick={onSave}/>
        </Rows>

    </div>
}