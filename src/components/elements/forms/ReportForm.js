import { TextField } from "@mui/material";
import React from "react";
import { ObjectInspector } from "react-inspector";
import {v4 as uuid} from 'uuid';
import { asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import { TuiForm, TuiFormGroupHeader, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField } from "../tui/TuiForm";
import TuiTagger from "../tui/TuiTagger";
import Button from "./Button";
import {JsonInput, SelectInput} from "./JsonFormComponents";


export default function ReportForm({reportId, onComplete}) {

    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [index, setIndex] = React.useState("profile");
    const [query, setQuery] = React.useState("{}");
    const [tags, setTags] = React.useState(["General"]);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(null);
    const [testParams, setTestParams] = React.useState("{}");
    const [testResult, setTestResult] = React.useState({});
    const [testLoading, setTestLoading] = React.useState(false);
    const [testError, setTestError] = React.useState(null);
    const [success, setSuccess] = React.useState(false);
    const [saveLoading, setSaveLoading] = React.useState(false);
    const mounted = React.useRef(false);

    React.useEffect(() => {
        mounted.current = true;
        if (reportId) {
            setLoading(true);
            setError(null);
            asyncRemote({
                url: `/report/${reportId}`,
                method: "GET"
            })
            .catch(() => onComplete())
            .then(response => {
                if (mounted.current) {
                    setName(response.data.name);
                    setDescription(response.data.description);
                    setIndex(response.data.index);
                    setQuery(JSON.stringify(response.data.query, null, "  "));
                    setTags(response.data.tags);
                }
            })
            .finally(() => {
                if (mounted.current) setLoading(false);
            })
        }
        return () => mounted.current = false;
    }, [reportId])

    const handleTest = () => {
        if (mounted.current) {
            setTestLoading(true);
            setTestError(null);
        }
        asyncRemote({
            url: "/report/test",
            method: "POST",
            data: {
                report: {
                    id: uuid(),
                    name,
                    description,
                    index: index,
                    query: JSON.parse(query),
                    tags: [],
                },
                params: JSON.parse(testParams)
            }
        })
        .then(response => {
            if (mounted.current) setTestResult(response.data);
        })
        .catch(e => { if (mounted.current) setTestError(getError(e)); })
        .finally(() => {
            if (mounted.current) setTestLoading(false);
        })
    }

    const handleSave = () => {
        if (name && query && index) {
            if (mounted.current) {
                setError(null);
                setSaveLoading(true);
            }
            asyncRemote({
                url: "/report",
                method: "POST",
                data: {
                    id: (reportId) ? reportId : uuid(),
                    name,
                    description,
                    index: index,
                    query: JSON.parse(query),
                    tags: Array.isArray(tags) && tags.length > 0 ? tags : ["General"],
                }
            })
            .then(_ => {
                setSuccess(true);
                onComplete();
            })
            .catch(e => {
                if( mounted.current) setError(getError(e));
            })
            .finally(() => {
                if(mounted.current) setSaveLoading(false);
            })
        } else setError([{msg: "Name, index and query have to be provided.", type: "Warning"}]);
    }

    return <>{
        loading ?
        <CenteredCircularProgress />
        :
        <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Report configuration" description="Add template for custom report, that you can use later in workflow or internal reporting."/>
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Name" description="Type the name of your report.">
                        <TextField
                            value={name}
                            onChange={e => setName(e.target.value)}
                            size="small"
                            fullWidth
                            label="Name"
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Description" description="Type a short description for your report. (Optional)">
                        <TextField
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            size="small"
                            fullWidth
                            label="Description"
                            multiline={true}
                            rows={3}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Index" description="Select which index will be queried.">
                        <SelectInput
                            label="Index"
                                items={{
                                profile: "Profile",
                                event: "Event",
                                session: "Session",
                                entity: "Entity"
                            }}
                            value={index}
                            onChange={setIndex}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField
                        header="Query"
                        description='It will be executed on selected index, every time when you run the report. You can use parameter placeholders for example: {"profile.id": "{{profile_id}}"}.
                        Placeholders defined between {{ }} will be replaced by the parameters passed during report execution time! e.g. {"profile_id": "<some-id>"}.
                        Please note that the whole string has to be a parameter, e.g. something like "{{profile_id}}-some-other-data" will not work.'
                    >
                        <JsonInput
                            label="Query"
                            value={query}
                            onChange={value => setQuery(value)}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Tags" description="You can add tags to your reports to group them in meaningful way.">
                        <TuiTagger
                            label="Tags"
                            tags={tags}
                            onChange={value => setTags(value)}
                        />
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Report testing" description="Use this form to test defined report."/>
                <TuiFormGroupContent>
                    <TuiFormGroupField
                        header="Test your query!"
                        description='Here you can provide some example parameters and see how your query works!'
                    >
                        <JsonInput
                            label="Test parameters"
                            value={testParams}
                            onChange={value => setTestParams(value)}
                        />
                    </TuiFormGroupField>
                    <Button
                        label="TEST"
                        style={{width: "calc(100% - 2px)"}}
                        onClick={handleTest}
                        disabled={testLoading}
                    />
                    {
                        testLoading ?
                        <div style={{height: 300}}><CenteredCircularProgress/></div>
                        :
                        <TuiFormGroupField
                            header="Test results"
                            description='Inspect report returns:'
                        >
                            {testError ?
                                <ErrorsBox errorList={testError}/>
                                 :
                                <div style={{borderRadius: 6, border: "1px solid #ccc", padding: 10, marginBottom: 20}}><ObjectInspector data={testResult} expandLevel={3}/></div>
                            }
                        </TuiFormGroupField>
                    }
                    {error && <ErrorsBox errorList={error}/>}
                </TuiFormGroupContent>
            </TuiFormGroup>
            <Button
                label="SAVE"
                onClick={handleSave}
                error={!!error}
                success={success}
                progress={saveLoading}
            />
        </TuiForm>
    }</>
}