import React from 'react';
import { useFetch } from "../../../remote_api/remoteState";
import {getProfileMergeCount} from "../../../remote_api/endpoints/profile";
import EventStatusTag from "../misc/EventStatusTag";

export function ProfileMergePendingDetails({ id }) {
    const { isLoading, data, error } = useFetch(
        [`ProfileMerge-${id}`, [id]],
        getProfileMergeCount(id),
        data => data,
        { retry: 0 }
    );

    if (isLoading) {
        return <EventStatusTag label="Loading..."/>
    }

    if (error) {
        return <EventStatusTag label="Merge pending"/>;
    }

    return <EventStatusTag label={`Merge pending ~${data} records`}/>
}

export default function ProfileMergeDetails({profile}) {
    if(profile?.metadata?.system?.aux?.auto_merge) {
        return <ProfileMergePendingDetails id={profile?.id}/>
    }
    return <EventStatusTag label="Merged"
                           defaultSuccessLabel="Merged"
                           title="Merge status"/>
}
