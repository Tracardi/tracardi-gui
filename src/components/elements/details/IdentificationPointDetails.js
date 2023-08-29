import React, {useEffect} from "react";
import Button from "../forms/Button";
import Rows from "../misc/Rows";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import FormDrawer from "../drawers/FormDrawer";
import {VscTrash, VscEdit} from "react-icons/vsc";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import {asyncRemote} from "../../../remote_api/entrypoint";
import IdentificationPointForm from "../forms/IdentifiactionPointForm";
import EventTypeMetadata from "./EventTypeMetadata";
import {RestrictToLocalStagingContext} from "../../context/RestrictContext";
import AssignValueToKey from "./AssignValueToKey";

export function IdentificationPointCard({data, onDeleteComplete, onEditComplete, displayMetadata=true}) {

    const [displayEdit, setDisplayEdit] = React.useState(false);

    const confirm = useConfirm();

    const handleEdit = () => {
        if (data) {
            setDisplayEdit(true);
        }
    }

    const handleEditComplete = (flowData) => {
        setDisplayEdit(false);
        if(onEditComplete instanceof Function) onEditComplete(flowData);
    }

    const handleDelete = () => {
        confirm({title: "Do you want to delete this event identification point?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await asyncRemote({
                            url: '/identification/point/' + data?.id,
                            method: "delete"
                        })
                        if (onDeleteComplete) {
                            onDeleteComplete(data?.id)
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            )
            .catch(() => {
            })
    }

    const Details = () => <>
        <TuiForm>
            {displayMetadata && <EventTypeMetadata data={data}/>}
            <TuiFormGroup>
                <TuiFormGroupHeader header="Identification Data Fields"
                                    description="If the data in an event matches the data in a customer's profile,
                                    specifically when certain predefined pairs of data match (for example, when
                                    the email in the customer's profile matches the email property in the event),
                                    then the customer's profile will be merged with other profiles that share
                                    the same email."/>
                <TuiFormGroupContent>
                    { data?.fields &&
                        data?.fields.map((item, index) => {
                            return <AssignValueToKey key={index}
                                                     value={`profile@${item.profile_trait?.value}`}
                                                     label={`event@properties.${item.event_property?.value}`}/>
                        })
                    }
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
        <RestrictToLocalStagingContext>
            <div>
                <Rows style={{marginTop: 20}}>
                    <Button onClick={handleEdit}
                            icon={<VscEdit size={20}/>}
                            label="Edit"
                            disabled={typeof data === "undefined"}/>
                    {onDeleteComplete && <Button
                        icon={<VscTrash size={20}/>}
                        onClick={handleDelete}
                        label="Delete"
                        disabled={typeof data === "undefined"}
                    />}
                </Rows>
            </div>
        </RestrictToLocalStagingContext>
    </>

    return <div className="Box10" style={{height: "100%"}}>
        {data && <Details/>}
        <FormDrawer
            width={800}
            onClose={() => {
                setDisplayEdit(false)
            }}
            open={displayEdit}>
            {displayEdit && <IdentificationPointForm
                onSubmit={handleEditComplete}
                data={data}
            />}
        </FormDrawer>
    </div>
}


export default function IdentificationPointDetails({id, onDeleteComplete, onEditComplete}) {

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
            let isSubscribed = true;
            setLoading(true);

            asyncRemote({
                url: '/identification/point/' + id,
                method: "get"
            }).then(response => {
                if (isSubscribed === true) setData(response.data);
            }).catch((e) => {
                console.error(e)
            }).finally(() => {
                    if (isSubscribed === true) setLoading(false)
                }
            )

            return () => {
                isSubscribed = false
            }
        },
        [id])

    if (loading) return <CenteredCircularProgress/>

    return <IdentificationPointCard data={data} onDeleteComplete={onDeleteComplete} onEditComplete={onEditComplete}/>
}

IdentificationPointDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
    onEditComplete: PropTypes.func
};