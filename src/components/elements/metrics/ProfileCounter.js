import React from "react";
import Counter from "./Counter";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";
import {useFetch} from "../../../remote_api/remoteState";
import {getProfilesCount} from "../../../remote_api/endpoints/profile";
import storageValue from "../../../misc/localStorageDriver";

export default function ProfileCounter() {

    const {data: count, isLoading, error} = useFetch(
        ["profileCount"],
        getProfilesCount(),
        data => {
            new storageValue("profiles").save(data.count)
            return data.count
        }
    )

    if(error) {
        return <NoData header="Error">
            Could not load data.
        </NoData>
    }

    if(isLoading) {
        return <CenteredCircularProgress />
    }

    return <Counter label="Profiles" value={count} hint="Stored" width={160}/>
}