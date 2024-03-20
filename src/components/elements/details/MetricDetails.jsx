import {useFetch} from "../../../remote_api/remoteState";
import {getMetricById} from "../../../remote_api/endpoints/metrics";
import NoData from "../misc/NoData";
import FetchError from "../../errors/FetchError";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import React, {useState} from "react";
import Properties from "./DetailProperties";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";
import FormDrawer from "../drawers/FormDrawer";
import Rows from "../misc/Rows";
import {VscEdit, VscTrash} from "react-icons/vsc";
import MetricsForm from "../forms/MetricsForm";
import {useConfirm} from "material-ui-confirm";
import {useRequest} from "../../../remote_api/requestClient";
import ProductionButton from "../forms/ProductionButton";

export function MetricDetails({data:_data, onDeleteComplete, onEditComplete}) {

    const [data, setData] = useState(_data)
    const [displayEdit, setDisplayEdit] = useState(false)

    const confirm = useConfirm();
    const {request} = useRequest()

    const handleEditComplete = (data) => {
        setData(data)
        setDisplayEdit(false);
        if (onEditComplete instanceof Function) {
            onEditComplete(data)
        }
    }

    const handleEditClick  = () => {
        if (data) {
            setDisplayEdit(true);
        }
    }

    const handleDelete = () => {
        confirm({
            title: "Do you want to delete this metric?",
            description: "This action can not be undone."
        })
            .then(async () => {
                    try {
                        await request({
                            url: '/setting/metric/' + data.id,
                            method: "delete"
                        })
                        if (onDeleteComplete instanceof Function) {
                            onDeleteComplete(data.id)
                        }
                    } catch (e) {
                        console.error(e)
                    }
                }
            )
            .catch(() => {
            })
    }

    return <>
        <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Metric settings"/>
                <TuiFormGroupContent>
                    <Properties properties={data}/>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <div style={{marginBottom: 20}}>
                <Rows style={{marginTop: 20}}>
                    <ProductionButton
                        onClick={handleEditClick}
                        icon={<VscEdit size={20}/>}
                        label="Edit"
                        disabled={typeof data === "undefined"}/>
                    {onDeleteComplete && <ProductionButton
                        icon={<VscTrash size={20}/>}
                        onClick={handleDelete}
                        label="Delete"
                        disabled={typeof data === "undefined"}
                    />}
                </Rows>
            </div>
        </TuiForm>
        <FormDrawer
            width={800}
            onClose={() => {
                setDisplayEdit(false)
            }}
            open={displayEdit}>
            {displayEdit && <MetricsForm
                onSubmit={handleEditComplete}
                init={data}
            />}
        </FormDrawer>
    </>
}

export function MetricDetailsById({id, onDeleteComplete, onEditComplete}) {

    const query = useFetch(
        ["getMetric", [id]],
        getMetricById(id),
        data => {
            return data
        })

    if (query.isError) {
        if (query.error.status === 404)
            return <NoData header="Could not find metric.">
                This can happen if the metric was deleted.
            </NoData>
        return <FetchError error={query.error}/>
    }

    if (query.isLoading) {
        return <CenteredCircularProgress/>
    }

    return <>
        {query.data && <MetricDetails
            data={query.data}
            onEditComplete={onEditComplete}
            onDeleteComplete={onDeleteComplete}
        />}
    </>
}