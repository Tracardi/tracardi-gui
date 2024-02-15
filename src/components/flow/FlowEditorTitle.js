import React, {useCallback, useState} from "react";
import {TiTickOutline} from "react-icons/ti";
import "./FlowEditorTitle.css";
import FormDrawer from "../elements/drawers/FormDrawer";
import Button from "../elements/forms/Button";
import {BsFolder, BsPlayCircle, BsClipboardCheck} from "react-icons/bs";
import EventsAnalytics from "../pages/EventsAnalytics";
import Tabs, {TabCase} from "../elements/tabs/Tabs";
import ProfilesAnalytics from "../pages/ProfilesAnalytics";
import SessionsAnalytics from "../pages/SessionsAnalytics";
import FlowRules from "../rules/FlowRules";
import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupContent,
    TuiFormGroupHeader
} from "../elements/tui/TuiForm";
import RuleForm from "../elements/forms/RuleForm";
import Drawer from "@mui/material/Drawer";
import {prepareFlowPayload, save} from "./FlowEditorOps";
import {ReinstallButton} from "../pages/ActionPlugins";
import EntityAnalytics from "../pages/EntityAnalytics";
import {useRequest} from "../../remote_api/requestClient";
import ProductionButton from "../elements/forms/ProductionButton";
import TestTrackForm from "../elements/forms/TestTrackForm";

export default function FlowEditorTitle({flowId, reactFlowInstance, flowMetaData, onSaveDraft}) {

    const [testConsoleOpened, setTestConsoleOpened] = useState(false);
    const [eventsOpened, setEventsOpened] = useState(false);
    const [rulesOpened, setRulesOpened] = useState(false);
    const [openRuleForm, setOpenRuleForm] = useState(false);
    const [refresh, setRefresh] = useState(1);
    const [draftSaveProgress, setDraftSaveProgress] = useState(false);

    const {request} = useRequest()

    const handleDraftSave = useCallback((progress, deploy = false) => {

        if (reactFlowInstance) {
            save(flowId,
                flowMetaData,
                reactFlowInstance,
                (e) => {
                    // todo error
                    console.error(e.toString());
                },
                () => {
                    if (onSaveDraft) {
                        onSaveDraft()
                    }
                },
                progress,
                request);
        } else {
            // todo error
            console.error("Can not save Editor not ready.");
        }
    }, [flowMetaData, reactFlowInstance, flowId, onSaveDraft]);

    const handleSave = () => {
        handleDraftSave(setDraftSaveProgress, false)
    }

    const handleRearrange = async () => {
        try {
            const payload = prepareFlowPayload(
                flowId,
                flowMetaData,
                reactFlowInstance
            )
            await request({
                url: `/flow/draft/nodes/rearrange`,
                method: "POST",
                data: payload
            })

        } catch (e) {
            if (e) {
                console.error(e)
            }
        } finally {

        }
    }

    return <aside className="FlowEditorTitle">
        <div>
            <span style={{marginLeft: 10}}>{flowMetaData?.name} <sup>({flowMetaData?.type})</sup></span>
        </div>
        <div>
            <ReinstallButton/>
            <ProductionButton
                label="Rearrange"
                icon={<TiTickOutline size={20}/>}
                onClick={handleRearrange}
            />
            <ProductionButton
                label="Save"
                icon={<TiTickOutline size={20}/>}
                onClick={handleSave}
                progress={draftSaveProgress}
            />
            {flowMetaData?.type !== 'segment' && <Button
                label="Test"
                icon={<BsClipboardCheck size={20}/>}
                onClick={() => setTestConsoleOpened(true)}
            />}
            <Button
                label="Data"
                icon={<BsFolder size={20}/>}
                onClick={() => setEventsOpened(true)}
            />
            {flowMetaData?.type !== 'segment' &&
                <Button
                    label="Triggers"
                    icon={<BsPlayCircle size={20}/>}
                    onClick={() => setRulesOpened(true)}
                />}
        </div>

        <FormDrawer
            width={610}
            onClose={() => {
                setTestConsoleOpened(false)
            }}
            open={testConsoleOpened}>
            {testConsoleOpened && <div style={{margin: 20}}><TestTrackForm eventType="page-view" sxOnly={true}/></div>}
        </FormDrawer>

        <FormDrawer
            width={1300}
            onClose={() => {
                setEventsOpened(false)
            }}
            open={eventsOpened}>
            {eventsOpened && <Tabs tabs={["Events", "Profiles", "Sessions", "Entities"]}>
                <TabCase id={0}>
                    <EventsAnalytics displayChart={false}/>
                </TabCase>
                <TabCase id={1}>
                    <ProfilesAnalytics displayChart={false}/>
                </TabCase>
                <TabCase id={2}>
                    <SessionsAnalytics displayChart={false}/>
                </TabCase>
                <TabCase id={3}>
                    <EntityAnalytics displayChart={false}/>
                </TabCase>
            </Tabs>
            }
        </FormDrawer>

        <FormDrawer
            width={800}
            onClose={() => {
                setRulesOpened(false)
            }}
            open={rulesOpened}>
            {rulesOpened && <div style={{padding: 15}}>
                <div style={{padding: "10px 0", display: "flex", justifyContent: "flex-end"}}>
                    <ProductionButton
                        label="Add trigger"
                        onClick={() => {
                            setOpenRuleForm(true)
                        }}
                        icon={<BsPlayCircle size={20}/>}/>
                </div>
                <TuiForm>
                    <TuiFormGroup>
                        <TuiFormGroupHeader header="Trigger Rules" description="Information on this workflow triggers"/>
                        <TuiFormGroupContent>
                            <FlowRules flowName={flowMetaData?.name} id={flowId} refresh={refresh}/>
                        </TuiFormGroupContent>
                    </TuiFormGroup>
                </TuiForm>
                <Drawer anchor="right" open={openRuleForm} onClose={() => setOpenRuleForm(false)}>
                    <div style={{width: 600}}>
                        {openRuleForm && <RuleForm
                            data={{
                                flow: {
                                    id: flowId,
                                    name: flowMetaData?.name
                                },
                                event: {},
                                name: "",
                                description: "",
                                source: {},
                                sourceDisabled: true
                            }}
                            onSubmit={() => {
                                setOpenRuleForm(false);
                                setRefresh(refresh + 1)
                            }}/>}
                    </div>
                </Drawer>
            </div>}
        </FormDrawer>
    </aside>
}