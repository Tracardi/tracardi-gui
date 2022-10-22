import {BsPersonX} from "react-icons/bs";
import React from "react";

export function profileName(profile) {
    if(!profile) {
        return <><BsPersonX size={18} style={{marginRight: 8}}/> profileless</>
    }else if(profile?.pii?.name || profile?.pii?.last_name) {
        return `${profile?.pii?.name || ""} ${profile?.pii?.last_name || ""} ${profile?.pii?.email || ""}`
    } else {
        return `anonymous ${profile?.pii?.email || ""}`
    }
}