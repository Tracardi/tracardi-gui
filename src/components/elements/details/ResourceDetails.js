import React, {Suspense, useEffect} from "react";
import "../lists/cards/SourceCard.css";
import "./ResourceDetails.css";
import "./Details.css";
import Properties from "./DetailProperties";
import Button from "../forms/Button";
import Rows from "../misc/Rows";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import {request} from "../../../remote_api/uql_api_endpoint";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash,VscEdit} from "react-icons/vsc";
import ResourceForm from "../forms/ResourceForm";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import CredentialsVault from "../misc/CredentialsVault";

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
        request(
            {
                url: '/resource/' + id,
                method: "GET"
            },
            setLoading,
            (e) => {
                if (e) {
                    console.error(e)
                }
            },
            (response) => {
                if (response) {
                    setCredentials(response.data.credentials);
                    delete response.data.credentials;
                    setData(response.data);
                }
            }
        )
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
        }).then(() => {
            request(
                {
                    url: '/resource/' + data.id,
                    method: "DELETE"
                },
                () => {
                },
                (e) => {
                    if (e) {
                        console.error(e);
                    }
                }, (reponse) => {
                    request({
                            url: '/resources/refresh'
                        },
                        () => {
                        },
                        (e) => {
                            if (e) {
                                console.error(e);
                            }
                        },
                        () => {
                            if (onDeleteComplete) {
                                onDeleteComplete(reponse)
                            }
                        }
                    )
                }
            )
        }).catch(() => {
        })
    }

    const Details = () => <>
        <TuiForm>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Resource"/>
                <TuiFormGroupContent header={"Data"}>
                    <Properties properties={data}/>
                    <Rows style={{marginTop: 20}}>
                        <Button onClick={onEdit}
                                icon={<VscEdit size={20}/>}
                                label="Edit"
                                disabled={typeof data === "undefined"}/>
                        <Button onClick={onDelete}
                                icon={<VscTrash size={20}/>}
                                label="Delete"
                                disabled={typeof data === "undefined"}/>
                    </Rows>
                </TuiFormGroupContent>

            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Credentials"/>
                <TuiFormGroupContent header={"Data"}>
                    <CredentialsVault production={credentials?.production} test={credentials?.test}/>
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
            width={800}
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