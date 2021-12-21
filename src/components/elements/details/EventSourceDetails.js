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
import {VscTrash} from "@react-icons/all-files/vsc/VscTrash";
import {VscEdit} from "@react-icons/all-files/vsc/VscEdit";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import EventSourceForm from "../forms/EventSourceForm";

const TrackerUseScript = React.lazy(() => import('../tracker/TrackerUseScript'));
const TrackerScript = React.lazy(() => import('../tracker/TrackerScript'));

export default function EventSourceDetails({id, onDeleteComplete}) {

    const confirm = useConfirm();
    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [editData, setEditData] = React.useState(null);

    useEffect(() => {
        setLoading(true);
        request(
            {
                url: '/event-source/' + id,
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
                    setData(response.data);
                }
            }
        )
    }, [id])

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
            label="Edit event source"
            onClose={() => {
                setEditData(null)
            }}
            open={editData !== null}>

            <EventSourceForm value={editData}
                             style={{margin: 20}}
                             onClose={() => {
                                       setEditData(null)
                                   }}/>

        </FormDrawer>
    </div>

}

EventSourceDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
};