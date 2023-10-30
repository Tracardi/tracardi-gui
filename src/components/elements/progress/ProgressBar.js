import React from "react";
import { getError } from "../../../remote_api/entrypoint";
import {useRequest} from "../../../remote_api/requestClient";


export default function ProgressBar({ taskId, setTaskIdNull = null }) {

    const [progress, setProgress] = React.useState(null);
    const [error, setError] = React.useState(null);
    const mounted = React.useRef(false);

    const {request} = useRequest()

    React.useEffect(() => {
        mounted.current = true;
        if (taskId) {
            const interval = setInterval(() => {
                request({url: "/task/" + taskId + "/progress"})
                .then(response => {if (mounted.current) {
                    setProgress(response.data);
                    if (response.data >= 1) {
                        setProgress(1);
                        clearInterval(interval);
                        if (setTaskIdNull !== null) setTaskIdNull();
                    }
                }})
                .catch(e => {if (mounted.current) setError(getError(e)); clearInterval(interval)})
            }, 400)
            return () => {mounted.current = false; clearInterval(interval)};
        } else {
            return () => mounted.current = false;
        }
    }, [taskId, setTaskIdNull])

    return <div style={{minWidth: "300px", maxWidth: "300px", minHeight: "10px", maxHeight: "10px", borderRadius: "5px", backgroundColor: "lightgrey", display: "flex"}}>
            <div 
                style={{
                    minWidth: "10px",
                    maxWidth: "300px", 
                    minHeight: "10px",
                    maxHeight: "10px", 
                    borderRadius: "5px", 
                    alignSelf: "flex-start", 
                    backgroundColor: error ? "#d81b60" : "#006db3",
                    width: error ? "100%" : `${Math.ceil(100 * progress)}%`
                }}
            />
    </div>
}