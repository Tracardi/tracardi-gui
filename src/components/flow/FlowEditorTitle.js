import React, {useState} from "react";
import {RiExchangeFundsFill} from "@react-icons/all-files/ri/RiExchangeFundsFill";
import {TiTickOutline} from "@react-icons/all-files/ti/TiTickOutline";
import {BsToggleOn} from "@react-icons/all-files/bs/BsToggleOn";
import {BsToggleOff} from "@react-icons/all-files/bs/BsToggleOff";
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
import Drawer from "@material-ui/core/Drawer";
import {FaUncharted} from "react-icons/fa";

export default function FlowEditorTitle({flowId, title, modified, deployed, onSave, onDeploy}) {

    const [eventsOpened, setEventsOpened] = useState(false);
    const [rulesOpened, setRulesOpened] = useState(false);
    const [openRuleForm, setOpenRuleForm] = useState(false);
    const [refresh, setRefresh] = useState(1);

    const Saved = ({onClick}) => {
        const button = () => (modified)
            ? <span className="AlertTag"><RiExchangeFundsFill size={20} style={{marginRight: 5}}/>Modified</span>
            : <span className="OKTag"><TiTickOutline size={20} style={{marginRight: 5}}/>Saved</span>

        return <span onClick={onClick} style={{cursor: "pointer"}}>{button()}</span>
    }

    const Deployed = ({onClick}) => {
        const button = () => (deployed)
            ? <span className="OKTag"><BsToggleOn size={20} style={{marginRight: 5}}/>Deployed</span>
            : <span className="AlertTag"><BsToggleOff size={20} style={{marginRight: 5}}/>Draft</span>

        return <span onClick={onClick} style={{cursor: "pointer"}}>{button()}</span>
    }

    return <aside className="FlowEditorTitle">
        <div>
            <Saved onClick={onSave}/>
            <Deployed onClick={onDeploy}/>
            <span style={{marginLeft: 10}}>{title}</span>
        </div>
        <div>
            <Button label="Data"
                    icon={<BsFolder size={20}/>}
                    style={{padding: "4px", width: 100, fontSize: 14, justifyContent: "center"}}
                    onClick={() => setEventsOpened(true)}/>
            <Button label="Rules"
                    icon={<BsFolder size={20}/>}
                    style={{padding: "4px", width: 100, fontSize: 14, justifyContent: "center"}}
                    onClick={() => setRulesOpened(true)}/>
        </div>


        <FormDrawer
            width={1300}
            label="Flow details"
            onClose={() => {
                setEventsOpened(false)
            }}
            open={eventsOpened}>
            {eventsOpened && <Tabs tabs={["Events", "Profiles", "Sessions"]}>
                <TabCase id={0}>
                    <EventsAnalytics displayChart={false}/>
                </TabCase>
                <TabCase id={1}>
                    <ProfilesAnalytics displayChart={false}/>
                </TabCase>
                <TabCase id={2}>
                    <SessionsAnalytics displayChart={false}/>
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
                    <Button label="Add rule"
                            onClick={() => {
                                setOpenRuleForm(true)
                            }}
                    icon={<FaUncharted size={20}/>}/>
                </div>
                <TuiForm>
                    <TuiFormGroup>
                        <TuiFormGroupHeader header="Rules" description="Information on rules connected to workflow"/>
                        <TuiFormGroupContent>
                            <TuiFormGroupField header="Active rules" description="Rules that trigger this flow">
                                <FlowRules flowName={title} id={flowId} refresh={refresh}/>
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
                                    name: title
                                },
                                event: {},
                                name: "",
                                description: "",
                                source: {},
                                sourceDisabled: true
                            }}
                            onReady={() => {
                                setOpenRuleForm(false);
                                setRefresh(refresh + 1)
                            }}/>}
                    </div>
                </Drawer>
            </div>}
        </FormDrawer>

    </aside>
}