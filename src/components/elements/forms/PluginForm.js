import {ObjectInspector} from "react-inspector";
import React, {useEffect, useState} from "react";
import "../../flow/InfoTable.css";
import Switch from "@mui/material/Switch";
import {BsXSquare, BsCheckCircle} from "react-icons/bs";
import PropTypes from 'prop-types';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import {asyncRemote} from "../../../remote_api/entrypoint";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import Tabs, {TabCase} from "../../elements/tabs/Tabs";
import "./PluginForm.css";
import IconSelector from "../../elements/IconSelector";
import {FiEdit3} from "react-icons/fi";
import IconButton from "../misc/IconButton";
import { TextField } from "@mui/material";
import { AiOutlineCheckCircle } from "react-icons/ai";
import MdManual from "../../flow/actions/MdManual";
import Properties from "../details/DetailProperties";

export default function PluginForm({id}) {

    const [plugin, setPlugin] = useState(null);
    const [enabled, setEnabled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [nameEdit, setNameEdit] = useState(false);
    const [newName, setNewName] = useState("");
    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState(0);

    useEffect(() => {
            let isSubscribed = true;
            setLoading(true)
            if (id) {
                asyncRemote({
                    url: "/flow/action/plugin/" + id
                }).then(response => {
                    if (response && isSubscribed === true) {
                        setEnabled(response?.data?.settings?.enabled);
                        setHidden(response?.data?.settings?.hidden);
                        setPlugin(response.data);
                    }
                }).catch(e => {
                    console.error(e)
                }).finally(()=>{
                    if(isSubscribed === true) setLoading(false)
                })
            }

            return () => {
                isSubscribed = false
            }
        },
        [id])

    const handleEnabled = async () => {
        await asyncRemote(
            {
                url: '/flow/action/plugin/' + plugin.id + '/enable/' + ((!enabled) ? 'yes' : 'no')
            }
        )
        setEnabled(!enabled)
    }

    const handleHidden = async () => {
        await asyncRemote(
            {
                url: '/flow/action/plugin/' + plugin.id + '/hide/' + ((!hidden) ? 'yes' : 'no')
            })
        setHidden(!hidden)
    }

    const handleIcon = async icon => {
        await asyncRemote({
            url: '/flow/action/plugin/' + plugin.id + '/icon/' + icon,
            method: "PUT" 
        })
    }

    const handleSaveName = async () => {
        await asyncRemote({
            url: '/flow/action/plugin/' + plugin.id + "/name/" + newName,
            method: "PUT" 
        })
        setNameEdit(false);
        plugin.plugin.metadata.name = newName;
        setPlugin({...plugin})
    }

    return <>
        {loading && <CenteredCircularProgress/>}
        {!loading && <> 
                        <Tabs
                            className="PluginTabs"
                            tabs={["Overview", "Config", "Docs", "Raw"]}
                            defaultTab={tab}
                            onTabSelect={setTab}
                            tabContentStyle={{overflow: "initial"}}
                            tabsStyle={{
                                display: "flex", 
                                flexDirection: "row",
                                backgroundColor: "white",
                                marginTop: 0,
                                marginBottom: 0,
                                position: "sticky",
                                top: 0,
                                zIndex: 2
                            }}
                        >
                            <TabCase id={0} key="Overview">
                                <TuiForm style={{margin: 20}}>
                                    <TuiFormGroup>
                                        <TuiFormGroupHeader header="Plugin overview" description="Here you can check some basic information on selected plugin."/>
                                        <TuiFormGroupContent>
                                            <div className="plugin-info-field" style={{alignItems: "center"}}>
                                                <div className="field-name">Name</div>
                                                <div style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "450px", alignItems: "center"}}>
                                                    {
                                                        nameEdit ? 
                                                        <>
                                                            <TextField
                                                                fullWidth 
                                                                size="small"
                                                                value={newName}
                                                                label="Name"
                                                                onChange={e => setNewName(e.target.value)}
                                                                style={{marginLeft: -14}}
                                                                InputProps={{style: {fontSize: 16}}}
                                                            />
                                                            <IconButton onClick={handleSaveName}>
                                                                <AiOutlineCheckCircle size={20}/>
                                                            </IconButton>
                                                        </>
                                                        :
                                                        <>
                                                            <div>{plugin?.plugin?.metadata?.name || "Name not provided"}</div>
                                                            <IconButton onClick={() => {setNameEdit(true); setNewName(plugin?.plugin?.metadata?.name)}}>
                                                                <FiEdit3 size={20}/>
                                                            </IconButton>
                                                        </>
                                                    }
                                                </div>
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Description</div>
                                                <div style={{overflowWrap: "anywhere"}}>{plugin?.plugin?.metadata?.desc || "Description not provided"}</div>
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Author</div>
                                                <div>{plugin?.plugin?.spec?.author || "Author's name not provided"}</div>
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">License</div>
                                                <div>{plugin?.plugin?.spec?.license || "License type not provided"}</div>
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Brand</div>
                                                <div>{plugin?.plugin?.metadata?.brand || "Brand not provided"}</div>
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Version</div>
                                                <div>{plugin?.plugin?.spec?.version || "Version not provided"}</div>
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Type</div>
                                                <div>{plugin?.plugin?.metadata?.type || "Plugin type not provided"}</div>
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Class name</div>
                                                <div>{plugin?.plugin?.spec?.className || "Class name not provided"}</div>
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Module</div>
                                                <div style={{overflowWrap: "anywhere"}}>{plugin?.plugin?.spec?.module || "Module not provided"}</div>
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Inputs</div>
                                                <div style={{overflowWrap: "anywhere"}}>
                                                    {(Array.isArray(plugin?.plugin?.spec?.inputs) && plugin.plugin.spec.inputs.join(", ")) || "No inputs provided"}
                                                </div>
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Outputs</div>
                                                <div style={{overflowWrap: "anywhere"}}>
                                                    {(Array.isArray(plugin?.plugin?.spec?.outputs) && plugin.plugin.spec.outputs.join(", ")) || "No outputs provided"}
                                                </div>
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Plugin ID</div>
                                                <div>{plugin?.id || "Plugin ID not provided"}</div>
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Tags</div>
                                                <div style={{overflowWrap: "anywhere"}}>
                                                    {(Array.isArray(plugin?.plugin?.metadata?.tags) && plugin.plugin.metadata.tags.join(", ")) || "Tags not provided"}
                                                </div>
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Keywords</div>
                                                <div style={{overflowWrap: "anywhere"}}>
                                                    {(Array.isArray(plugin?.plugin?.metadata?.keywords) && plugin.plugin.metadata.keywords.join(", ")) || "Keywords not provided"}
                                                </div>
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Groups</div>
                                                <div style={{overflowWrap: "anywhere"}}>
                                                    {(Array.isArray(plugin?.plugin?.metadata?.groups) && plugin.plugin.metadata.groups.join(", ")) || "Groups not provided"}
                                                </div>
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Node width</div>
                                                <div>
                                                    {plugin?.plugin?.metadata?.width || "Width not provided"}
                                                </div>
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Node height</div>
                                                <div>
                                                    {plugin?.plugin?.metadata?.height || "Height not provided"}
                                                </div>
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Start action</div>
                                                {plugin?.plugin?.start ? <BsCheckCircle size={24} color="#00c853"/> : <BsXSquare size={24} color="#d81b60"/>}
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Debug action</div>
                                                {plugin?.plugin?.debug ? <BsCheckCircle size={24} color="#00c853"/> : <BsXSquare size={24} color="#d81b60"/>}
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Tracardi Pro</div>
                                                {plugin?.plugin?.metadata?.pro ? <BsCheckCircle size={24} color="#00c853"/> : <BsXSquare size={24} color="#d81b60"/>}
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Frontend</div>
                                                {plugin?.plugin?.metadata?.frontend ? <BsCheckCircle size={24} color="#00c853"/> : <BsXSquare size={24} color="#d81b60"/>}
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Enabled</div>
                                                <Switch 
                                                    checked={enabled}
                                                    onChange={handleEnabled}
                                                />
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Hidden</div>
                                                <Switch
                                                    checked={hidden}
                                                    onChange={handleHidden}
                                                />
                                            </div>
                                            <div className="plugin-info-field">
                                                <div className="field-name">Icon</div>
                                                <IconSelector value={plugin?.plugin?.metadata?.icon} onChange={handleIcon}/>
                                            </div>
                                        </TuiFormGroupContent>
                                    </TuiFormGroup>
                                </TuiForm>
                            </TabCase>
                            <TabCase id={1} key="Config">
                                {
                                    <TuiForm style={{margin: 20}}>
                                        <TuiFormGroup>
                                            <TuiFormGroupHeader header="Plugin config" description="Here you can check initial configuration object."/>
                                            <TuiFormGroupContent>
                                                <ObjectInspector data={plugin?.plugin?.spec?.init || {detail: "Configuration object not provided"}} expandLevel={5}/>
                                            </TuiFormGroupContent>
                                        </TuiFormGroup>
                                        <TuiFormGroup>
                                            <TuiFormGroupHeader header="Plugin form" description="Here you can check form information from selected plugin."/>
                                            <TuiFormGroupContent>
                                                <ObjectInspector data={plugin?.plugin?.spec?.form || {detail: "No form object provided"}} expandLevel={5}/>
                                            </TuiFormGroupContent>
                                        </TuiFormGroup>
                                        <TuiFormGroup>
                                            <TuiFormGroupHeader header="Plugin runtime config" description="Here you can check default runtime settings for selected plugin."/>
                                            <TuiFormGroupContent>
                                                <div className="plugin-info-field">
                                                    <div className="field-name">Join input payload</div>
                                                    {plugin?.plugin?.spec?.join_input_payload ? <BsCheckCircle size={24} color="#00c853"/> : <BsXSquare size={24} color="#d81b60"/>}
                                                </div>
                                                <div className="plugin-info-field">
                                                <div className="field-name">Append input payload</div>
                                                    {plugin?.plugin?.spec?.append_input_payload ? <BsCheckCircle size={24} color="#00c853"/> : <BsXSquare size={24} color="#d81b60"/>}
                                                </div>
                                                <div className="plugin-info-field">
                                                    <div className="field-name">Skip</div>
                                                    {plugin?.plugin?.spec?.skip ? <BsCheckCircle size={24} color="#00c853"/> : <BsXSquare size={24} color="#d81b60"/>}
                                                </div>
                                                <div className="plugin-info-field">
                                                    <div className="field-name">Run in background</div>
                                                    {plugin?.plugin?.spec?.run_in_background ? <BsCheckCircle size={24} color="#00c853"/> : <BsXSquare size={24} color="#d81b60"/>}
                                                </div>
                                                <div className="plugin-info-field">
                                                    <div className="field-name">On error continue</div>
                                                    {plugin?.plugin?.spec?.on_error_continue ? <BsCheckCircle size={24} color="#00c853"/> : <BsXSquare size={24} color="#d81b60"/>}
                                                </div>
                                                <div className="plugin-info-field">
                                                    <div className="field-name">On connection error repeat</div>
                                                    <div>
                                                    {(plugin?.plugin?.spec?.on_connection_error_repeat && 
                                                        `${plugin.plugin.spec.on_connection_error_repeat} time${plugin.plugin.spec.on_connection_error_repeat > 1 ? "s" : ""}`
                                                        ) || "Repeating attempts number not provided"
                                                    }
                                                    </div>
                                                </div>
                                                <div className="plugin-info-field">
                                                    <div className="field-name">Run once</div>
                                                    <div style={{width: "500px"}}>
                                                        <Properties properties={plugin?.plugin?.spec?.run_once || {detail: "No run once info provided"}} />
                                                    </div>
                                                </div>
                                            </TuiFormGroupContent>
                                        </TuiFormGroup>
                                    </TuiForm>
                                }
                            </TabCase>
                            <TabCase id={2} key="Docs">
                                {
                                    <TuiForm style={{margin: 20}}>
                                        <TuiFormGroup>
                                            <TuiFormGroupHeader header="Plugin docs" description="Here you can find some helpful information about selected plugin."/>
                                            <TuiFormGroupContent>
                                                <div className="plugin-info-field">
                                                    <div className="field-name">Tutorial</div>
                                                    {
                                                    (plugin?.plugin?.metadata?.documentation?.tutorial && 
                                                        <a href={plugin.plugin.metadata.documentation.tutorial}>
                                                            {plugin.plugin.metadata.documentation.tutorial}
                                                        </a>
                                                    ) 
                                                    || "No tutorial provided"
                                                    }
                                                </div>
                                                <div className="plugin-info-field">
                                                    <div className="field-name" style={{minWidth: 190}}>Documentation</div>
                                                    {
                                                    (plugin?.plugin?.spec?.manual &&
                                                        <MdManual mdFile={plugin.plugin.spec.manual}/>
                                                    ) 
                                                    || "No documentation file provided"
                                                    }
                                                </div>
                                                <div className="plugin-info-field">
                                                    <div className="field-name">Inputs</div>
                                                    <div>
                                                        {
                                                            typeof plugin?.plugin?.metadata?.documentation?.inputs === "object" &&
                                                            Object.keys(plugin.plugin.metadata.documentation.inputs).map(key => {
                                                                return <div key={key} className="plugin-info-field" style={{width: "450px"}}>
                                                                    <div style={{maxWidth: "100px", minWidth: "100px", fontSize: "16px", fontWeight: 500, overflowWrap: "anywhere"}}>
                                                                        {key}
                                                                    </div>
                                                                    <div style={{overflowWrap: "anywhere"}}>
                                                                        {plugin.plugin.metadata.documentation.inputs[key]?.desc || "No input description provided"}
                                                                    </div>
                                                                </div>
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                                <div className="plugin-info-field">
                                                    <div className="field-name">Outputs</div>
                                                    <div>
                                                        {
                                                            typeof plugin?.plugin?.metadata?.documentation?.outputs === "object" &&
                                                            Object.keys(plugin.plugin.metadata.documentation.outputs).map(key => {
                                                                return <div key={key} className="plugin-info-field" style={{width: "450px"}}>
                                                                    <div style={{maxWidth: "100px", minWidth: "100px", fontSize: "16px", fontWeight: 500, overflowWrap: "anywhere"}}>
                                                                        {key}
                                                                    </div>
                                                                    <div style={{overflowWrap: "anywhere"}}>
                                                                        {plugin.plugin.metadata.documentation.outputs[key]?.desc || "No output description provided"}
                                                                    </div>
                                                                </div>
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            </TuiFormGroupContent>
                                        </TuiFormGroup>
                                    </TuiForm>
                                }
                            </TabCase>
                            <TabCase id={3} key="Raw">
                                {
                                    <TuiForm style={{margin: 20}}>
                                        <TuiFormGroup>
                                            <TuiFormGroupHeader header="Plugin raw information" description="Here you can check all information about original plugin object."/>
                                            <TuiFormGroupContent>
                                                <ObjectInspector data={plugin || {detail: "Plugin object not provided"}} expandLevel={10}/>
                                            </TuiFormGroupContent>
                                        </TuiFormGroup>
                                    </TuiForm>
                                }
                            </TabCase>
                        </Tabs>
                    </>
        }
        </>
}

PluginForm.propTypes = {
    id: PropTypes.string
}