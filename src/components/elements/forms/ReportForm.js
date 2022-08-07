import { TextField } from "@mui/material";
import React from "react";
import { ObjectInspector } from "react-inspector";
import {v4 as uuid} from 'uuid';
import { asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import { TuiForm, TuiFormGroupHeader, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField } from "../tui/TuiForm";
import TuiTagger from "../tui/TuiTagger";
import AutoComplete from "./AutoComplete";
import Button from "./Button";
import { JsonInput } from "./JsonFormComponents";


export default function ReportForm({reportId, onComplete}) {
    
    const [id, setId] = React.useState(reportId);
    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [index, setIndex] = React.useState({id: "profile", name: "Profile"});
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
        if (id) {
            setLoading(true);
            setError(null);
            asyncRemote({
                url: `/report/${id}`,
                method: "GET"
            })
            .catch(() => onComplete())
            .then(response => {
                if (mounted.current) {
                    setName(response.data.name);
                    setDescription(response.data.description);
                    setIndex({id: response.data.index, name: response.data.index.charAt(0).toUpperCase() + response.data.index.slice(1)});
                    setQuery(JSON.stringify(response.data.query, null, "  "));
                    setTags(response.data.tags);
                }
            })
            .finally(() => {
                if (mounted.current) setLoading(false);
            })
        }
        return () => mounted.current = false;
    }, [id])

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
                    index: index.id,
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
        if (name && query && index?.id) {
            if (mounted.current) {
                setError(null);
                setSaveLoading(true);
            }
            asyncRemote({
                url: "/report",
                method: "POST",
                data: {
                    id: uuid(),
                    name,
                    description,
                    index: index.id,
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
                <TuiFormGroupHeader header="Report configuration" description="Here you can add template for custom report, that you can use later."/>
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Name" description="Provide the name of your report.">
                        <TextField
                            value={name}
                            onChange={e => setName(e.target.value)}
                            size="small"
                            fullWidth
                            label="Name"
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Description" description="Provide a short description for your report.">
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
                    <TuiFormGroupField header="Index" description="Decide which index will be queried by your report.">
                        <AutoComplete
                            placeholder="Index"
                            initValue={index}
                            defaultValueSet={[{id: "profile", name: "Profile"}, {id: "event", name: "Event"}, {id: "session", name: "Session"}, {id: "entity", name: "Entity"}]}
                            onSetValue={value => setIndex(value)}
                            onlyValueWithOptions={true}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Tags" description="You can add tags to your reports to group them in meaningful way.">
                        <TuiTagger
                            label="Tags"
                            tags={tags}
                            onChange={value => setTags(value)}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField 
                        header="Query" 
                        description='Here is your query. It will be executed on selected index, every time when you run the report. You can use parameters like: {"profile.id": "{{profile_id}}"}.
                        This works like dot template, but you define the names of your parameters yourself! Then you can pass them as config in form of {"profile_id": "<some-id>"} to get results.
                        Please note that the whole string has to be parameter, e.g. something like "{{profile_id}}-some-other-data" will not work.'
                    >
                        <JsonInput
                            label="Query"
                            value={query}
                            onChange={value => setQuery(value)}
                        />
                    </TuiFormGroupField>
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
                            description='Here you can see what your report returns:'
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