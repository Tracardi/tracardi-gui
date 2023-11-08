import React, {useCallback, useState} from "react";
import {TiTickOutline} from "react-icons/ti";
import {VscRocket} from "react-icons/vsc";
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
import {BiReset} from "react-icons/bi";
import {prepareFlowPayload, save} from "./FlowEditorOps";
import {useConfirm} from "material-ui-confirm";
import TestEditor from "../test/TestEditor";
import DropDownMenu from "../menu/DropDownMenu";
import {ReinstallButton} from "../pages/ActionPlugins";
import EntityAnalytics from "../pages/EntityAnalytics";
import useTheme from "@mui/material/styles/useTheme";
import {useRequest} from "../../remote_api/requestClient";

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
    const theme = useTheme();
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
                    if (deploy) {
                        if (onDeploy) {
                            onDeploy()
                        }
                    }
                },
                progress,
                deploy,
                request);
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
            const response = await request({
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
                    await request({
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
                const response = await request({
                    url: `/flow/draft/${id}/restore`
                })

                if (onDraftRestore instanceof Function) {
                    onDraftRestore(response?.data)
                }
            } catch (e) {
                if (e) {
                    // todo error
                    console.error(e)
                }
            } finally {
                setDraftRestoreProgress(false);
            }
        }).catch(()=>{})
    }

    const style = {
        backgroundColor: theme.palette.primary.light
    }

    return <aside className="FlowEditorTitle" style={style}>
        <div>
            <span style={{marginLeft: 10}}>{flowMetaData?.name} <sup>({flowMetaData?.type})</sup></span>
        </div>
        <div>
            <ReinstallButton/>
            <Button label="Rearrange"
                    icon={<TiTickOutline size={20}/>}
                    onClick={handleRearrange}
            />
            <DropDownMenu label="Flow" icon={<BiReset size={20}/>}
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
                    icon={<VscRocket size={20}/>}
                    onClick={handleDeploy}
                    progress={deployProgress}
            />
            {flowMetaData?.type !== 'segment' &&<Button label="Test"
                    icon={<BsClipboardCheck size={20}/>}
                    onClick={() => setTestConsoleOpened(true)}
            />}
            <Button label="Data"
                    icon={<BsFolder size={20}/>}
                    onClick={() => setEventsOpened(true)}
            />
            {flowMetaData?.type !== 'segment' &&
            <Button label="Triggers"
                    icon={<BsPlayCircle size={20}/>}
                    onClick={() => setRulesOpened(true)}
            />}
        </div>

        <FormDrawer
            width={750}
            onClose={() => {
                setTestConsoleOpened(false)
            }}
            open={testConsoleOpened}>
            {testConsoleOpened && <div style={{margin: 20}}><TestEditor eventType="page-view" sxOnly={true}/></div>}
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
                    <Button label="Add trigger"
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