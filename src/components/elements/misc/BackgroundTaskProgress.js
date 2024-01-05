import LinearProgress from "@mui/material/LinearProgress";
import React, {useEffect, useState} from "react";
import {getError} from "../../../remote_api/entrypoint";
import {useRequest} from "../../../remote_api/requestClient";

export default function BackgroundTaskProgress({taskId, refreshInterval = 5}) {

    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);

    const {request} = useRequest()

    useEffect(() => {
        let timer;

        request({url: `/import/task/${taskId}/status`})
            .then(response => {
                setStatus(response.data);
                setError(null);
                if (response?.data?.status !== "running" || response?.data?.status !== "pending") {
                    clearInterval(timer);
                } else {
                    timer = setInterval(() => {
                        request({url: `/import/task/${taskId}/status`})
                            .then(response => {
                                setStatus(response.data);
                                setError(null);
                                if (response?.data?.status !== "running" || response?.data?.status !== "pending") {
                                    clearInterval(timer);
                                }
                            })
                            .catch(e => {
                                if (timer) setError(getError(e))
                            })
                    }, refreshInterval * 1000);
                }
            })
            .catch(e => {
                setError(getError(e))
            })

        return () => {
            if (timer) clearInterval(timer);
        };

    }, [taskId, refreshInterval])

    if(error) {
        return <>Connection lost<LinearProgress color={"secondary"}/></>
    }

    const normalizeProgress = () => {
        let current = status?.progress ? status.progress : 0;
        return Math.floor(current);
    }

    if (status?.progress) {

        const progress = normalizeProgress();

        return <>
            {status?.status.toUpperCase()}
            <LinearProgress
            variant="determinate"
            value={progress}
        /></>
    }

    if(status?.status === "finished") {
        return <>
            {status?.status.toUpperCase()}
            <LinearProgress
                variant="determinate"
                value={100}
                color="primary"
            /></>
    }

    if(status?.status === "pending") {
        return <>
            {status?.status.toUpperCase()}
            <LinearProgress
                variant="determinate"
                value={0}
                color="primary"
            /></>
    }

    return status?.status.toUpperCase() || <>Connecting...<LinearProgress color={"primary"}/></>

}