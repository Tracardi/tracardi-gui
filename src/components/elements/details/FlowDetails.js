import React, {useEffect} from "react";
import Properties from "./DetailProperties";
import Button from "../forms/Button";
import Rows from "../misc/Rows";
import {IoGitNetworkSharp} from "@react-icons/all-files/io5/IoGitNetworkSharp";
import {request} from "../../../remote_api/uql_api_endpoint";
import RuleRow from "../lists/rows/RuleRow";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import urlPrefix from "../../../misc/UrlPrefix";
import {useHistory} from "react-router-dom";
import FlowForm from "../forms/FlowForm";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash} from "@react-icons/all-files/vsc/VscTrash";
import {VscEdit} from "@react-icons/all-files/vsc/VscEdit";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";

export default function FlowDetails({id, onDeleteComplete}) {

    const history = useHistory();

    const [rules, setRules] = React.useState([]);
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [displayEdit, setDisplayEdit] = React.useState(false);

    const confirm = useConfirm();

    useEffect(() => {
            setLoading(true);
            request({
                    url: '/flow/metadata/' + id,
                    method: "get"
                },
                setLoading,
                () => {
                },
                (result) => {
                    setData(result.data);
                }
            );
        },
        [id])

    useEffect(() => {
            request({
                    url: '/rules/by_flow/' + id
                },
                () => {
                    setRules([])
                },
                () => {
                },
                (response) => {
                    if (response) {
                        setRules(response.data)
                    }
                }
            )
        },
        [id])

    const onEditClick = () => {
        if (data) {
            setDisplayEdit(true);
        }
    }

    const onEditComplete = (flowData) => {
        setData(flowData);
        setDisplayEdit(false);
    }

    const onGoToEditFlow = (id) => {
        history.push(urlPrefix("/setup/flow/edit/") + id);
    }

    const onGoToDeployedFlow = (id) => {
        history.push(urlPrefix("/setup/flow/") + id);
    }

    const onDelete = () => {
        confirm({title: "Do you want to delete this flow?", description: "This action can not be undone."})
            .then(() => {
                    request({
                            url: '/flow/' + id,
                            method: "delete"
                        },
                        () => {},
                        () => {},
                        (result) => {
                            if (result !== false) {
                                request({
                                        url: '/flow/metadata/refresh'
                                    },
                                    ()=>{},
                                    ()=>{},
                                    ()=>{
                                        if (onDeleteComplete) {
                                            onDeleteComplete(data.id)
                                        }
                                    }
                                )
                            }
                        }
                    );

                }
            )
            .catch(() => {
            })
    }

    const RulesList = ({flow, rules}) => {
        return rules.map((rule, index) => {
            return <RuleRow data={rule} flow={flow} key={index}/>
        })
    }

    const Details = () => <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Workflow" description="Information on workflow"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Data">
                    <Properties properties={data} show={["id", "name", "description", "enabled"]}/>
                    <Rows style={{marginTop: 20}}>
                        <Button onClick={onEditClick}
                                icon={<VscEdit size={20}/>}
                                label="Edit" disabled={typeof data === "undefined"}/>
                        <Button onClick={() => onGoToEditFlow(data.id)}
                                icon={<IoGitNetworkSharp size={20} style={{marginRight: 5}}/>}
                                label="Edit FLOW"
                                disabled={typeof data === "undefined"}/>
                        <Button onClick={() => onGoToDeployedFlow(data.id)}
                                icon={<IoGitNetworkSharp size={20} style={{marginRight: 5}}/>}
                                label="View Deployed FLOW"
                                disabled={typeof data === "undefined"}/>
                        {onDeleteComplete && <Button
                            icon={<VscTrash size={20}/>}
                            onClick={onDelete}
                            label="Delete"
                            disabled={typeof data === "undefined"}/>
                        }
                    </Rows>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>

        {Array.isArray(rules) && rules.length > 0 && <TuiFormGroup>
            <TuiFormGroupHeader header="Rules" description="List of rules connected with the workflow."/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Active rules" description="Rules that trigger this flow">
                    <RulesList flow={data.name} rules={rules}/>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>}

    </TuiForm>

    return <div className="Box10" style={{height: "100%"}}>
        {loading && <CenteredCircularProgress/>}
        {data && <Details/>}
        <FormDrawer
            width={800}
            label="Edit Flow"
            onClose={() => {
                setDisplayEdit(false)
            }}
            open={displayEdit}>
            {displayEdit && <FlowForm
                onFlowSaveComplete={onEditComplete}
                id={data.id}
                name={data.name}
                description={data.description}
                enabled={data.enabled}
                projects={data.projects}
            />}
        </FormDrawer>
    </div>
}

FlowDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
};