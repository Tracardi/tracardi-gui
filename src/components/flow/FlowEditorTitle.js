import React, {useCallback, useState} from "react";
import {TiTickOutline} from "react-icons/ti";
import {BsToggleOn} from "react-icons/bs";
import "./FlowEditorTitle.css";
import FormDrawer from "../elements/drawers/FormDrawer";
import Button from "../elements/forms/Button";
import {BsFolder} from "react-icons/bs";
import EventsAnalytics from "../pages/EventsAnalytics";
import Tabs, {TabCase} from "../elements/tabs/Tabs";
import ProfilesAnalytics from "../pages/ProfilesAnalytics";
import SessionsAnalytics from "../pages/SessionsAnalytics";
import FlowRules from "../rules/FlowRules";
import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupContent,
    TuiFormGroupField,
    TuiFormGroupHeader
} from "../elements/tui/TuiForm";
import RuleForm from "../elements/forms/RuleForm";
import Drawer from "@mui/material/Drawer";
import {FaUncharted} from "react-icons/fa";
import {BiReset} from "react-icons/bi";
import {asyncRemote} from "../../remote_api/entrypoint";
import {prepareFlowPayload, save} from "./FlowEditorOps";
import {useConfirm} from "material-ui-confirm";
import TestEditor from "../test/TestEditor";
import {BsClipboardCheck} from "react-icons/bs";
import DropDownMenu from "../menu/DropDownMenu";
import {ReinstallButton} from "../pages/ActionPlugins";
import EntityAnalytics from "../pages/EntityAnalytics";

export default function FlowEditorTitle({flowId, reactFlowInstance, flowMetaData, onDraftRestore, onDeploy, onSaveDraft}) {

    const [testConsoleOpened, setTestConsoleOpened] = useState(false);
    const [eventsOpened, setEventsOpened] = useState(false);
    const [rulesOpened, setRulesOpened] = useState(false);
    const [openRuleForm, setOpenRuleForm] = useState(false);
    const [refresh, setRefresh] = useState(1);
    const [productionRestoreProgress, setProductionRestoreProgress] = useState(false);
    const [draftRestoreProgress, setDraftRestoreProgress] = useState(false);
    const [draftSaveProgress, setDraftSaveProgress] = useState(false);
    const [deployProgress, setDeployProgress] = useState(false);

    const confirm = useConfirm();

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
                    if (deploy) {
                        if (onDeploy) {
                            onDeploy()
                        }
                    }
                },
                progress,
                deploy);
        } else {
            // todo error
            console.error("Can not save Editor not ready.");
        }
    }, [flowMetaData, reactFlowInstance, flowId, onSaveDraft, onDeploy]);

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
            const response = await asyncRemote({
                url: `/flow/draft/nodes/rearrange`,
                method: "POST",
                data: payload
            })

            if (onDraftRestore instanceof Function) {
                onDraftRestore(response?.data)
            }

        } catch (e) {
            if (e) {
                // todo error
            }
        } finally {

        }
    }

    const handleDeploy = () => {
        confirm({
            title: "Do you want to deploy this flow?",
            description: "After deployment this flow will be used in production.\n" +
                "This action can not be undone."
        }).then(
            () => handleDraftSave(setDeployProgress, true )
        ).catch(() => {
            // todo error
        })
    }

    const restoreProduction = async (id) => {
        confirm({
            title: "Restore production from copy",
            description: "Do you want to restore production workflow from last working copy?\n" +
                "This action can not be undone."
        }).then(
            async () => {
                setProductionRestoreProgress(true);
                try {
                    await asyncRemote({
                        url: `/flow/production/${id}/restore`
                    })

                } catch (e) {
                    if (e) {
                        // todo error
                    }
                } finally {
                    setProductionRestoreProgress(false);
                }
            }
        ).catch(() => {})
    }

    const restoreDraft = async (id) => {
        confirm({
            title: "Restore draft from copy",
            description: "Do you want to restore workflow draft from last working copy?\n" +
                "This action can not be undone."
        }).then(async () => {
            setDraftRestoreProgress(true);
            try {
                const response = await asyncRemote({
                    url: `/flow/draft/${id}/restore`
                })

                if (onDraftRestore instanceof Function) {
                    onDraftRestore(response?.data)
                }
            } catch (e) {
                if (e) {
                    // todo error
                }
            } finally {
                setDraftRestoreProgress(false);
            }
        }).catch(()=>{})
    }

    return <aside className="FlowEditorTitle">
        <div>
            {/*<TextField select style={{width: 130, marginRight: 10}} value="draft">*/}
            {/*    <MenuItem value="draft">Draft</MenuItem>*/}
            {/*    <MenuItem value="production">Production</MenuItem>*/}
            {/*    <MenuItem value="backup">Back-up</MenuItem>*/}
            {/*</TextField>*/}
            <span style={{marginLeft: 10}}>{flowMetaData?.name}</span>
        </div>
        <div>
            <ReinstallButton/>
            <Button label="Rearrange nodes"
                    icon={<TiTickOutline size={20}/>}
                    onClick={handleRearrange}
            />
            <DropDownMenu label="Restore Flow" icon={<BiReset size={20}/>}
                          progress={draftRestoreProgress || productionRestoreProgress}
                          options = {{
                'Restore production flow': () => restoreProduction(flowId),
                'Restore draft flow': () => restoreDraft(flowId)
            }}/>
            <Button label="Save"
                    icon={<TiTickOutline size={20}/>}
                    onClick={handleSave}
                    progress={draftSaveProgress}
            />
            <Button label="Deploy"
                    icon={<BsToggleOn size={20}/>}
                    onClick={handleDeploy}
                    progress={deployProgress}
            />
            <Button label="Test"
                    icon={<BsClipboardCheck size={20}/>}
                    onClick={() => setTestConsoleOpened(true)}
            />
            <Button label="Data"
                    icon={<BsFolder size={20}/>}
                    onClick={() => setEventsOpened(true)}
            />
            <Button label="Rules"
                    icon={<FaUncharted size={20}/>}
                    onClick={() => setRulesOpened(true)}
            />
        </div>

        <FormDrawer
            width={750}
            label="Test console"
            onClose={() => {
                setTestConsoleOpened(false)
            }}
            open={testConsoleOpened}>
            {testConsoleOpened && <TestEditor eventType="page-view"/>}
        </FormDrawer>


        <FormDrawer
            width={1300}
            label="Flow details"
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
            label="Rule details"
            onClose={() => {
                setRulesOpened(false)
            }}
            open={rulesOpened}>
            {rulesOpened && <div style={{padding: 15}}>
                <div style={{padding: "10px 0", display: "flex", justifyContent: "flex-end"}}>
                    <Button label="Add routing rule"
                            onClick={() => {
                                setOpenRuleForm(true)
                            }}
                            icon={<FaUncharted size={20}/>}/>
                </div>
                <TuiForm>
                    <TuiFormGroup>
                        <TuiFormGroupHeader header="Routing Rules" description="Information on rules connected to workflow"/>
                        <TuiFormGroupContent>
                            <TuiFormGroupField header="Active rules" description="Rules that trigger this flow">
                                <FlowRules flowName={flowMetaData?.name} id={flowId} refresh={refresh}/>
                            </TuiFormGroupField>
                        </TuiFormGroupContent>
                    </TuiFormGroup>
                </TuiForm>
                <Drawer anchor="right" open={openRuleForm} onClose={() => setOpenRuleForm(false)}>
                    <div style={{width: 600}}>
                        {openRuleForm && <RuleForm
                            init={{
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
                            onEnd={() => {
                                setOpenRuleForm(false);
                                setRefresh(refresh + 1)
                            }}/>}
                    </div>
                </Drawer>
            </div>}
        </FormDrawer>
    </aside>
}