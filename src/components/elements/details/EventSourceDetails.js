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
import {VscTrash, VscEdit} from "react-icons/vsc";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import EventSourceForm from "../forms/EventSourceForm";
import TextField from "@mui/material/TextField";
import {asyncRemote} from "../../../remote_api/entrypoint";

const TrackerUseScript = React.lazy(() => import('../tracker/TrackerUseScript'));
const TrackerScript = React.lazy(() => import('../tracker/TrackerScript'));

export default function EventSourceDetails({id, onDeleteComplete}) {

    const confirm = useConfirm();
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [editData, setEditData] = React.useState(null);
    const [refresh, setRefresh] = React.useState(0);

    useEffect(() => {
        setLoading(true);
        asyncRemote({
            url: '/event-source/' + id,
            method: "GET"
        }).then((response) => {
            if (response) {
                setData(response.data);
            }
        }).catch((e) => {
            if (e) {
                console.error(e)
            }
        }).finally(() => {
            setLoading(false);
        })
    }, [id])

    // Loads data without loading indicator
    useEffect(() => {
        asyncRemote({
            url: '/event-source/' + id,
            method: "GET"
        }).then((response) => {
            if (response) {
                setData(response.data);
            }
        }).catch((e) => {
            if (e) {
                console.error(e)
            }
        })
    }, [id, refresh])

    const onEdit = () => {
        setEditData(data)
    }

    const onDelete = () => {
        confirm({
            title: "Do you want to delete this event source?",
            description: "This action can not be undone."
        }).then(() => {
            request(
                {
                    url: '/event-source/' + data.id,
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
                            url: '/event-sources/refresh'
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
                <TuiFormGroupHeader header="Event Source"/>
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
                <TuiFormGroupHeader header="Web hook"
                                    description="For every event source there is a web hook created. Calling it will emit
                                profile less event. For full fledged events call regular /track endpoint."/>
                <TuiFormGroupContent>
                    <h3>Web hook URL</h3>
                    <p>Event properties should be send inthe body of request and <b>event-type</b> inside URL should be
                        replaced with the event type you would like to emit. Please refer to the documentation to see
                        what are profile less events as calling this web hook will emit one of them.
                    </p>

                    <TextField
                        label="Web hook"
                        value={`/collect/event-type/${data.id}`}
                        size="small"
                        disabled={true}
                        variant="outlined"
                        fullWidth
                    />

                </TuiFormGroupContent>
            </TuiFormGroup>

        </TuiForm>


        {data.type === "javascript" && <TuiForm>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Integration"
                                    description="Please paste this code into your web page. This code should appear on every page."/>
                <TuiFormGroupContent>
                    <Suspense fallback={<CenteredCircularProgress/>}><TrackerScript sourceId={data.id}/></Suspense>
                </TuiFormGroupContent>
            </TuiFormGroup>

            <TuiFormGroup>
                <TuiFormGroupHeader header="Javascript example"
                                    description="This is an example of event sending. This code sends multiple events.
                                    Please refer to Tracardi documentation on more complex configuration."/>
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
            label="Edit event source"
            onClose={() => {
                setEditData(null)
            }}
            open={editData !== null}>

            <EventSourceForm value={editData}
                             style={{margin: 20}}
                             onClose={() => {
                                 setEditData(null);
                                 setRefresh(refresh + 1)
                             }}/>

        </FormDrawer>
    </div>

}

EventSourceDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
};