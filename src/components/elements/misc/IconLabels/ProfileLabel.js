import React from "react";
import FlowNodeIcons from "../../../flow/FlowNodeIcons";

export default function ProfileLabel({label, profileLess = false, profileIcon = 'profile', profileLessIcon = 'profile-less', size = 20}) {
    return <><span style={{marginRight: 5}}>{profileLess ? <FlowNodeIcons icon={profileLessIcon} size={size}/> :
        <FlowNodeIcons icon={profileIcon} size={size}/>}</span> {label}</>
}