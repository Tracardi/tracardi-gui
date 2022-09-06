import React from "react";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField} from "../tui/TuiForm";
import ErrorsBox from "../../errors/ErrorsBox";
import Button from "../forms/Button";
import ImportEditForm from "../forms/ImportEditForm";
import Tabs, {TabCase} from "../tabs/Tabs";
import NamedActionButton from "../forms/inputs/NamedActionButton";
import {BsPlayFill} from "react-icons/bs";
import {VscDebugAlt} from "react-icons/vsc";

export default function ImportDetails({onClose, id}) {

    const [tab, setTab] = React.useState(0);
    const [error, setError] = React.useState(null);
    const [batch, setBatch] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [deleteProgress, setDeleteProgress] = React.useState(false);
    const [runProgress, setRunProgress] = React.useState(false);
    const [debugRunProgress, setDebugRunProgress] = React.useState(false);
    const [runSuccessful, setRunSuccessful] = React.useState(false);
    const [runDebugSuccessul, setRunDebugSuccessful] = React.useState(false);
    const mounted = React.useRef(false);

    React.useEffect(() => {
        mounted.current = true;
        if (mounted.current) setLoading(true);
        asyncRemote({url: "/import/" + id})
            .then(response => {
                if (mounted.current) setBatch(response.data)
            })
            .catch(e => {
                if (mounted.current) setError(getError(e))
            })
            .finally(() => {
                if (mounted.current) setLoading(false)
            })
        return () => mounted.current = false;
    }, [id])

    const handleDelete = () => {
        if (mounted.current) {
            setError(null);
            setDeleteProgress(true);
        }
        asyncRemote({url: "/import/" + id, method: "DELETE"})
            .then(onClose)
            .catch(e => {
                if (mounted.current) setError(getError(e));
            })
            .finally(() => {
                if (mounted.current) setDeleteProgress(false)
            })
    }

    const handleRun = (name, debug) => {
        if (mounted.current) {
            setError(null);
            if (debug) {
                setDebugRunProgress(true);
                setRunDebugSuccessful(false);
            } else {
                setRunProgress(true);
                setRunSuccessful(false);
            }
        }

        asyncRemote({
            url: `/import/${id}/run?name=` + encodeURIComponent(name) + "&debug=" + encodeURIComponent(debug),
            method: "GET"
        })
            .then(response => {
                if (response.status === 200) {
                    if (debug) {
                        if (mounted.current) setRunDebugSuccessful(true);
                    } else {
                        if (mounted.current) setRunSuccessful(true);
                    }
                }
            })
            .catch(e => {
                if (mounted.current) setError(getError(e))
            })
            .finally(() => {
                if (mounted.current) {
                    if (debug) {
                        if (mounted.current) setDebugRunProgress(false);
                    } else {
                        if (mounted.current) setRunProgress(false);
                    }
                }
            })
    }

    return <>
        {loading && <CenteredCircularProgress/>}
        {error && <ErrorsBox errorList={error} style={{margin: 20}}/>}
        {batch &&
        <Tabs tabs={["Actions", "Details"]} defaultTab={tab} onTabSelect={setTab}>
            <TabCase id={0}>
                <TuiForm style={{margin: 20}}>
                    <TuiFormGroup>
                        <TuiFormGroupContent>
                            <TuiFormGroupField header="Start importing" description="After clicking this button, batch will fetch data from selected resource and insert them to Tracardi
                                as events with fetched data as event properties.">
                                <NamedActionButton
                                    buttonLabel={batch.enabled ? "RUN" : "Import is disabled"}
                                    textLabel="Task name"
                                    disabled={!batch.enabled}
                                    confirmed={runSuccessful}
                                    progress={runProgress}
                                    onClick={(name) => handleRun(name, false)}
                                    icon={<BsPlayFill size={20}/>}
                                />
                            </TuiFormGroupField>
                            <TuiFormGroupField header="Debug import " description="After clicking this button, batch will fetch data from selected resource using test credentials, and
                                insert them to Tracardi as events.">
                                <NamedActionButton
                                    buttonLabel={batch.enabled ? "RUN DEBUG" : "Import is disabled"}
                                    textLabel="Task name"
                                    disabled={!batch.enabled}
                                    confirmed={runDebugSuccessul}
                                    progress={debugRunProgress}
                                    onClick={(name) => handleRun(name, true)}
                                    icon={<VscDebugAlt size={20}/>}
                                />
                            </TuiFormGroupField>
                        </TuiFormGroupContent>
                    </TuiFormGroup>
                    <TuiFormGroup>
                        <TuiFormGroupContent>
                            <TuiFormGroupField header="Other actions">
                                <div style={{display: "flex"}}>
                                    <Button label="Edit" onClick={() => setTab(1)}/>
                                    <Button label="Delete" onClick={handleDelete} progress={deleteProgress}/>
                                </div>
                            </TuiFormGroupField>

                        </TuiFormGroupContent>

                    </TuiFormGroup>
                </TuiForm>
            </TabCase>
            <TabCase id={1}>
                <ImportEditForm importConfig={batch} onSubmit={onClose}/>
            </TabCase>
        </Tabs>
        }
    </>
}