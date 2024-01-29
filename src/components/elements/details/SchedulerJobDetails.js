import React, {useEffect} from "react";
import Properties from "./DetailProperties";
import Rows from "../misc/Rows";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {useConfirm} from "material-ui-confirm";
import {VscTrash} from "react-icons/vsc";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import {useRequest} from "../../../remote_api/requestClient";
import ProductionButton from "../forms/ProductionButton";

export default function SchedulerJobDetails({id, onDeleteComplete}) {

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const confirm = useConfirm();
    const {request} = useRequest()

    useEffect(() => {
            let isSubscribed = true;
            setLoading(true);

            request({
                url: '/scheduler/job/' + id,
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

    const onDelete = () => {
        confirm({title: "Do you want to delete this scheduled event?", description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await request({
                            url: '/scheduler/job/' + id,
                            method: "delete"
                        })
                        if (onDeleteComplete) {
                            onDeleteComplete(id)
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            )
            .catch(() => {
            })
    }

    const Details = () => <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Scheduled job details" description="Information on scheduled job."/>
            <TuiFormGroupContent>
                <TuiFormGroupField>
                    <Properties properties={data}/>
                    <Rows style={{marginTop: 20}}>
                        {onDeleteComplete && <ProductionButton
                            icon={<VscTrash size={20}/>}
                            onClick={onDelete}
                            label="Delete"
                            disabled={typeof data === "undefined"}
                        />}
                    </Rows>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>

    return <div className="Box10" style={{height: "100%"}}>
        {loading && <CenteredCircularProgress/>}
        {data && <Details/>}
    </div>
}

SchedulerJobDetails.propTypes = {
    id: PropTypes.string,
    onDeleteComplete: PropTypes.func,
};