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
                if (response?.data?.status !== "PROGRESS") {
                    clearInterval(timer);
                } else {
                    timer = setInterval(() => {
                        request({url: `/import/task/${taskId}/status`})
                            .then(response => {
                                setStatus(response.data);
                                setError(null);
                                if (response?.data?.status !== "PROGRESS") {
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
        let current = status?.progress?.current ? status.progress.current : 0;
        let total = status?.progress?.total ? status.progress.total : 100;
        return Math.floor(current * 1.0 / total * 100);
    }

    if (status?.progress?.current) {

        const progress = normalizeProgress();

        return <>
            {status?.status}
            <LinearProgress
            variant="determinate"
            value={progress}
        /></>
    }

    if(status?.status === "SUCCESS") {
        return <>
            {status?.status}
            <LinearProgress
                variant="determinate"
                value={100}
                color="primary"
            /></>
    }

    if(status?.status === "PENDING") {
        return <>
            {status?.status}
            <LinearProgress
                variant="determinate"
                value={0}
                color="primary"
            /></>
    }

    return status?.status || <>Connecting...<LinearProgress color={"primary"}/></>

}