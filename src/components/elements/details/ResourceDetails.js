import React, {Suspense, useEffect} from "react";
import "../lists/cards/SourceCard.css";
import "./ResourceDetails.css";
import "./Details.css";
import Properties from "./DetailProperties";
import Button from "../forms/Button";
import Rows from "../misc/Rows";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash, VscEdit} from "react-icons/vsc";
import ResourceForm from "../forms/ResourceForm";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import CredentialsVault from "../misc/CredentialsVault";
import {asyncRemote} from "../../../remote_api/entrypoint";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import TuiTags from "../tui/TuiTags";
import TimeDifference from "../datepickers/TimeDifference";

const TrackerUseScript = React.lazy(() => import('../tracker/TrackerUseScript'));
const TrackerScript = React.lazy(() => import('../tracker/TrackerScript'));

export default function ResourceDetails({id, onDeleteComplete}) {

    const confirm = useConfirm();
    const [data, setData] = React.useState(null);
    const [credentials, setCredentials] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [editData, setEditData] = React.useState(null);

    useEffect(() => {
        setLoading(true);
        let isSubscribed = true;
        asyncRemote(
            {
                url: '/resource/' + id,
                method: "GET"
            }).then(response => {
            if (response && isSubscribed === true) {
                setCredentials(response.data.credentials);
                delete response.data.credentials;
                setData(response.data);
            }
        }).catch(e => {
            if (e && isSubscribed === true) {
                console.error(e)
            }
        }).finally(() => {
            if (isSubscribed === true) setLoading(false)
        })

        return () => {
            isSubscribed = false
        }

    }, [id])

    const onEdit = () => {
        const editData = JSON.parse(JSON.stringify(data));
        editData.credentials = JSON.parse(JSON.stringify(credentials));
        setEditData(editData)
    }

    const onDelete = () => {
        confirm({
            title: "Do you want to delete this resource?",
            description: "This action can not be undone."
        }).then(async () => {
            try {
                const response = await asyncRemote(
                    {
                        url: '/resource/' + data.id,
                        method: "DELETE"
                    })
                if (onDeleteComplete) {
                    onDeleteComplete(response)
                }
            } catch (e) {
                console.error(e)
            }
        }).catch(() => {
        })
    }
    const Details = () => <>
        <div style={{display: "flex", margin: "5px 20px 20px 20px", flexDirection: "column"}}>

            <div style={{display: "flex",justifyContent: "space-between", alignItems: 'center', marginBottom: 10}}>
                <div style={{display: "flex", flexDirection: "row", alignItems: 'center'}}>
                    <FlowNodeIcons icon={data.icon} size={30}/>
                    <h1 className="header"
                        style={{marginBottom: 0, marginLeft: 10}}> {data.name} ({data.type})</h1>
                </div>
                <div style={{display: "flex", alignItems: "start"}}>
                    <Rows>
                        {data?.locked !== true && <Button onClick={onEdit}
                                                          icon={<VscEdit size={20}/>}
                                                          label="Edit"
                                                          disabled={typeof data === "undefined"}/>}
                        <Button onClick={onDelete}
                                icon={<VscTrash size={20}/>}
                                label="Delete"
                                disabled={typeof data === "undefined"}/>
                    </Rows>
                </div>
            </div>
            {data.description && <h2 className="subHeader">{data.description}</h2>}
            <div>
                Created: {data.timestamp} <TimeDifference date={data.timestamp}/>
            </div>
            <div style={{marginBottom: 10}}>
                <TuiTags tags={data.tags}/>
            </div>
        </div>

        <TuiForm>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Credentials"/>
                <TuiFormGroupContent header={"Data"}>
                    <CredentialsVault production={credentials?.production} test={credentials?.test}/>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Destination"/>
                <TuiFormGroupContent header={"Data"}>
                    {(data?.destination && <Properties properties={(data?.destination)}/>) || "This resource does not provide destination configuration."}
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Other details"/>
                <TuiFormGroupContent header={"Data"}>
                    <Properties properties={data} exclude={['tags', 'destination', 'name', 'description', ]}/>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>

        {data.type === "web-page" && <TuiForm>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Integration"
                                    description="Please paste this code into your web page. This code should appear on every page."/>
                <TuiFormGroupContent>
                    <Suspense fallback={<CenteredCircularProgress/>}><TrackerScript sourceId={data.id}/></Suspense>
                </TuiFormGroupContent>
            </TuiFormGroup>

            <TuiFormGroup>
                <TuiFormGroupHeader header="Javascript example"
                                    description="This is an example of event sending. This code sends multiple events. Please refer to Tracardi documentation on more complex configuration."/>
                <TuiFormGroupContent>
                    <Suspense fallback={<CenteredCircularProgress/>}><TrackerUseScript/></Suspense>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
        }

    </>

    return <div className="Box10" style={{height: "100%"}}>
        {loading && <CenteredCircularProgress/>}
        {data && <Details/>}

        <FormDrawer
            width={700}
            label="Edit Resource"
            onClose={() => {
                setEditData(null)
            }}
            open={editData !== null}>
            <ResourceForm init={editData} onClose={() => {
                setEditData(null)
            }}/>
        </FormDrawer>
    </div>

}

ResourceDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
};