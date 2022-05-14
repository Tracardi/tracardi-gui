import React, {useState} from "react";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {EventData} from "./EventDetails";

export default function EventInfo({id}) {

    const [event,setEvent] = useState(null);
    const [error,setError] = useState(null);
    const [loading,setLoading] = useState(false);

    React.useEffect(() => {
        let isSubscribed = true;
        setError(null);
        setLoading(true);
        if (id) {
            asyncRemote({
                url: "/event/" + id
            })
                .then(response => {
                    if (isSubscribed && response?.data) {
                        setEvent(response.data?.event);
                    }
                })
                .catch(e => {
                    if (isSubscribed) setError(getError(e))
                })
                .finally(() => {
                    if (isSubscribed) setLoading(false)
                })
        }
        return () => isSubscribed = false;
    }, [id])

    if (error) {
        return <ErrorsBox errorList={error}/>
    }

    if (loading) {
        return <CenteredCircularProgress/>
    }

    return <EventData event={event}/>
}