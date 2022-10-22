import React from "react";
import {BsHash, BsPerson} from "react-icons/bs";

export default function ProfileLabel({label, size=20}) {
    return <><BsPerson size={size}/> {label}</>
}