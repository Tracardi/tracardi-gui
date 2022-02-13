import {ObjectInspector} from "react-inspector";
import React, {useEffect, useState} from "react";
import "../../flow/InfoTable.css";
import Switch from "@mui/material/Switch";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import {BsXSquare, BsCheckCircle} from "react-icons/bs";
import PropTypes from 'prop-types';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {asyncRemote} from "../../../remote_api/entrypoint";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

export default function PluginForm({id}) {

    const [plugin, setPlugin] = useState(null);
    const [enabled, setEnabled] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [loading, setLoading] = useState(false);

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

    return <>
        {loading && <CenteredCircularProgress/>}
        {!loading && <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Plugin specification"/>
                <TuiFormGroupContent>
                    <TuiFormGroupField>
                        <div className="InfoTable">
                            <div className="InfoRow">
                                <div>module</div>
                                <div>{plugin?.plugin?.spec?.module}</div>
                            </div>
                            <div className="InfoRow">
                                <div>Class name</div>
                                <div>{plugin?.plugin?.spec?.className}</div>
                            </div>
                            <div className="InfoRow">
                                <div>init</div>
                                <div><ObjectInspector data={plugin?.plugin?.spec?.init}/></div>
                            </div>
                            <div className="InfoRow">
                                <div>input</div>
                                <div>{plugin?.plugin?.spec?.inputs.join(", ")}</div>
                            </div>
                            <div className="InfoRow">
                                <div>output</div>
                                <div>{plugin?.plugin?.spec?.outputs?.join(", ")}</div>
                            </div>
                            <div className="InfoRow">
                                <div>start action</div>
                                <div>{plugin?.plugin?.start ? <BsCheckCircle size={23}/> : <BsXSquare size={20}/>}</div>
                            </div>
                            <div className="InfoRow">
                                <div>debug action</div>
                                <div>{plugin?.plugin?.debug ? <BsCheckCircle size={23}/> : <BsXSquare size={20}/>}</div>
                            </div>
                        </div>
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Plugin metadata"/>
                <TuiFormGroupContent>
                    <TuiFormGroupField>
                        <div className="InfoTable">
                            <div className="InfoRow">
                                <div>Name</div>
                                <div>{plugin?.plugin?.metadata?.name}</div>
                            </div>
                            <div className="InfoRow">
                                <div>Description</div>
                                <div>{plugin?.plugin?.metadata?.desc}</div>
                            </div>
                            <div className="InfoRow">
                                <div>Groups</div>
                                <div>{plugin?.plugin?.metadata?.group.join(", ")}</div>
                            </div>
                            <div className="InfoRow">
                                <div>Icon</div>
                                <div><FlowNodeIcons icon={plugin?.plugin?.metadata?.icon}/></div>
                            </div>

                            <div className="InfoRow">
                                <div>enabled</div>
                                <div>
                                    <Switch
                                        checked={enabled}
                                        onChange={handleEnabled}
                                        name="enabledPlugin"
                                    />
                                </div>
                            </div>

                            <div className="InfoRow">
                                <div>hidden</div>
                                <div>
                                    <Switch
                                        checked={hidden}
                                        onChange={handleHidden}
                                        name="enabledPlugin"
                                    />
                                </div>
                            </div>
                        </div>
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>}
        </>
}

PluginForm.propTypes = {
    id: PropTypes.string
}