import ActiveTag from "./ActiveTag";
import React from "react";

export default function ProfileMergeTag({profile}) {
    if (profile?.active) {
        return <ActiveTag active={profile.active}/>
    }
    return <span style={{display: "flex", alignItems: "center"}}>
        <ActiveTag
            active={profile?.active}
            style={{marginRight: 5}}
        /> {profile?.metadata?.merged_with && `Merged with {$profile.metadata.merged_with.substring(0, 12)}`}
    </span>
}