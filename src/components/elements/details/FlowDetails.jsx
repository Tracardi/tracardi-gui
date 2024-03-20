import React, {useEffect} from "react";
import Properties from "./DetailProperties";
import Rows from "../misc/Rows";
import {BsGear} from "react-icons/bs";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import urlPrefix from "../../../misc/UrlPrefix";
import {useNavigate} from "react-router-dom";
import FlowForm from "../forms/FlowForm";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash, VscEdit} from "react-icons/vsc";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import FlowRules from "../../rules/FlowRules";
import {useRequest} from "../../../remote_api/requestClient";
import ProductionButton from "../forms/ProductionButton";

export default function FlowDetails({id, onDeleteComplete}) {

    const navigate = useNavigate();

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [displayEdit, setDisplayEdit] = React.useState(false);

    const confirm = useConfirm();
    const {request} = useRequest()

    useEffect(() => {
            let isSubscribed = true;
            setLoading(true);

            request({
                url: '/flow/metadata/' + id,
                method: "get"
            }).then((response) => {
                if(isSubscribed===true) setData(response.data);
            }).catch((e)=> {
                console.error(e)
            }).finally(()=>{
                if(isSubscribed===true) setLoading(false);
            })

            return () => {
                isSubscribed = false
            }
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

    const onGoToEditFlow = (id, type) => {
        navigate(urlPrefix(`/flow/${type}/edit/${id}`));
    }

    const onGoToDeployedFlow = (id) => {
        navigate(urlPrefix("/flow/preview/") + id);
    }

    const onDelete = () => {
        confirm({title: "Do you want to delete this flow?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await request({
                            url: '/flow/' + id,
                            method: "delete"
                        })
                    } catch(e) {
                        console.error(e.toString())
                    }
                    if (onDeleteComplete) {
                        onDeleteComplete(data.id)
                    }
               }
            )
            .catch(() => {})
    }

    const Details = () => <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Workflow" description="Information on workflow"/>
            <TuiFormGroupContent>
                <TuiFormGroupField header="Data">
                    <Properties properties={data} show={["id", "timestamp", "deploy_timestamp", "name", "description", "type"]}/>
                    <Rows style={{marginTop: 20}}>
                        <ProductionButton
                            onClick={onEditClick}
                            icon={<VscEdit size={20}/>}
                            label="Edit" disabled={typeof data === "undefined"}/>
                        <ProductionButton
                            onClick={() => onGoToEditFlow(data.id, data.type)}
                            icon={<BsGear size={20} style={{marginRight: 5}}/>}
                            label="Edit FLOW"
                            disabled={typeof data === "undefined"}/>
                        <ProductionButton
                            onClick={() => onGoToDeployedFlow(data.id)}
                            icon={<BsGear size={20} style={{marginRight: 5}}/>}
                            label="View Deployed FLOW"
                            disabled={typeof data === "undefined"}/>
                        {onDeleteComplete && <ProductionButton
                            icon={<VscTrash size={20}/>}
                            onClick={onDelete}
                            label="Delete"
                            disabled={typeof data === "undefined"}/>
                        }
                    </Rows>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>

        {data.type === 'collection' && <TuiFormGroup>
            <TuiFormGroupHeader header="Triggers" description="List of this workflow triggers."/>
            <TuiFormGroupContent>
                <FlowRules flowName={data.name} id={id}/>
            </TuiFormGroupContent>
        </TuiFormGroup>}

    </TuiForm>

    return <div className="Box10" style={{height: "100%"}}>
        {loading && <CenteredCircularProgress/>}
        {data && <Details/>}
        <FormDrawer
            width={800}
            onClose={() => {
                setDisplayEdit(false)
            }}
            open={displayEdit}>
            {displayEdit && <FlowForm
                onFlowSaveComplete={onEditComplete}
                id={data.id}
                name={data.name}
                description={data.description}
                tags={data.tags}
                type={data.type}
            />}
        </FormDrawer>
    </div>
}

FlowDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
};