import React from "react";
import { TuiForm, TuiFormGroup, TuiFormGroupHeader, TuiFormGroupContent } from "../elements/tui/TuiForm";
import PropertyField from "../elements/details/PropertyField";
import { asyncRemote, getError } from "../../remote_api/entrypoint";
import ErrorsBox from "../errors/ErrorsBox";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import {BsCheckCircle, BsXSquare} from "react-icons/bs";
import Tag from "../elements/misc/Tag";


export default function ElasticClusterHealthInfo() {

    const [healthInfo, setHealthInfo] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(null);

    React.useEffect(() => {
        let isSubscribed = true;
        if (isSubscribed) {
            setError(null);
            setLoading(true);
        }
        
        asyncRemote({url: "/test/elasticsearch"})
        .then(response => {
            if (isSubscribed) setHealthInfo(response.data);
        })
        .catch(e => {
            if (isSubscribed) setError(getError(e));
        })
        .finally(() => {
            if (isSubscribed) setLoading(false);
        })

        return () => isSubscribed = false;
    }, []);

    const statusColor = (status) => {
        switch (status) {
            case "yellow":
                return "#ffc107"
            case "green":
                return "#00c853"
            case "red":
                return "#d81b60"
            default:
                return "#aaa"
        }
    }

    return <TuiForm style={{margin: 20}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Elasticsearch cluster health" description="Information about the Elasticsearch cluster health"/>
            <TuiFormGroupContent>
                {
                    loading ? 
                    <CenteredCircularProgress />
                    :
                        error ? 
                        <ErrorsBox errorList={error}/>
                        :
                        <>
                            <PropertyField key="name" name="Name of the cluster" content={healthInfo?.cluster_name || "cluster name not provided"}/>
                            <PropertyField key="status" name="Status of the cluster" content={
                                typeof healthInfo?.status === "string" ?
                                    <Tag backgroundColor={statusColor(healthInfo.status)} color="white">{healthInfo.status}</Tag>
                                : 
                                    "cluster status not provided"}/>
                            <PropertyField key="timed_out" name="Timed out" 
                                content={
                                    (
                                        healthInfo?.timed_out && healthInfo?.timed_out ? <BsCheckCircle size={20} color="#00c853"/> : <BsXSquare size={20} color="#d81b60"/>
                                    )
                                    || "timeout info not provided"
                                }
                            />
                            <PropertyField key="no_of_nodes" name="Number of nodes" content={
                                Number.isInteger(healthInfo?.number_of_nodes) ? healthInfo.number_of_nodes.toString() : "nodes number not provided"
                            }/>
                            <PropertyField key="no_of_data_nodes" name="Number of data nodes" content={
                                Number.isInteger(healthInfo?.number_of_data_nodes) ? healthInfo.number_of_data_nodes.toString() : "data nodes number not provided"
                            }/>
                            <PropertyField key="active_primary_shards" name="Active primary shards" content={
                                Number.isInteger(healthInfo?.active_primary_shards) ? healthInfo.active_primary_shards.toString() : "active primary shards number not provided"
                            }/>
                            <PropertyField key="active_shards" name="Active shards" content={
                                Number.isInteger(healthInfo?.active_shards) ? healthInfo.active_shards.toString() : "active shards number not provided"
                            }/>
                            <PropertyField key="relocating_shards" name="Relocating shards" content={
                                Number.isInteger(healthInfo?.relocating_shards) ? healthInfo.relocating_shards.toString() : "relocating shards number not provided"
                            }/>
                            <PropertyField key="initializing_shards" name="Initializing shards" content={
                                Number.isInteger(healthInfo?.initializing_shards) ? healthInfo.initializing_shards.toString() : "initializing shards number not provided"
                            }/>
                            <PropertyField key="unassigned_shards" name="Unassigned shards" content={
                                Number.isInteger(healthInfo?.unassigned_shards) ? healthInfo.unassigned_shards.toString() : "unassigned shards number not provided"
                            }/>
                            <PropertyField key="delayed_unassigned_shards" name="Delayed unassigned shards" content={
                                Number.isInteger(healthInfo?.delayed_unassigned_shards) ? healthInfo.delayed_unassigned_shards.toString() : "delayed unassigned shards number not provided"
                            }/>
                            <PropertyField key="pending_tasks" name="Number of pending tasks" content={
                                Number.isInteger(healthInfo?.number_of_pending_tasks) ? healthInfo.number_of_pending_tasks.toString() : "pending tasks number not provided"
                            }/>
                            <PropertyField key="in_flight_fetches" name="In-flight fetches" content={
                                Number.isInteger(healthInfo?.number_of_in_flight_fetch) ? healthInfo.number_of_in_flight_fetch.toString() : "in-flight fetch actions number not provided"
                            }/>
                            <PropertyField key="max_task_waiting_time" name="In-flight fetches" content={
                                !isNaN(healthInfo?.task_max_waiting_in_queue_millis) ? healthInfo.task_max_waiting_in_queue_millis.toString() : "max task waiting time not provided"
                            }/>
                            <PropertyField key="active_shards_percentage" name="Active shards percentage" content={
                                !isNaN(healthInfo?.active_shards_percent_as_number) ? 
                                    parseFloat(healthInfo.active_shards_percent_as_number).toFixed(2).toString() + "%"
                                : 
                                    "active shards percentage not provided"
                            }/>
                        </>
                }
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}