import React, {useContext} from "react";
import Counter from "./Counter";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import NoData from "../misc/NoData";
import {useFetch} from "../../../remote_api/remoteState";
import {getProfilesCount} from "../../../remote_api/endpoints/profile";
import storageValue from "../../../misc/localStorageDriver";
import {DataContext} from "../../AppBox";

export default function ProfileCounter({width=200}) {
    const dataContext = useContext(DataContext)


    const {data: count, isLoading, error} = useFetch(
        ["profileCount",[dataContext]],
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

    return <Counter label="Profiles" value={count} hint="Stored" width={width}/>
}