import LinearProgress from "@mui/material/LinearProgress";
import React, {useEffect, useState} from "react";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";

export default function ImportProgress({taskId, refreshInterval = 5}) {

    const [status, setStatus] = useState(null);
    const [error, setError] = useState(null);


    useEffect(() => {
        let timer;

        asyncRemote({url: `/import/task/${taskId}/status/`})
            .then(response => {
                setStatus(response.data);
                setError(null);
                if (response?.data?.status !== "PROGRESS") {
                    clearInterval(timer);
                } else {
                    timer = setInterval(() => {
                        asyncRemote({url: `/import/task/${taskId}/status/`})
                            .then(response => {
                                setStatus(response.data);
                                setError(null);
                                if (response?.data?.status !== "PROGRESS") {
                                    clearInterval(timer);
                                }
                            })
                            .catch(e => {
                                setError(getError(e))
                            })
                    }, refreshInterval * 1000);
                }
            })
            .catch(e => {
                if (timer) setError(getError(e))
            })

        return () => {
            if (timer) clearInterval(timer);
        };

    }, [taskId, refreshInterval])

    if(error) {
        return <>Connection lost<LinearProgress color={"secondary"}/></>
    }

    if (status?.progress?.current) {
        return <>
            {status?.status}
            <LinearProgress
            variant="determinate"
            value={status?.progress?.current || 0}
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