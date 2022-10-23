import React from "react";
import {BsPersonX, BsPerson} from "react-icons/bs";

export default function ProfileLabel({label, profileLess = false, size = 20}) {
    return <>{profileLess ? <BsPersonX size={size} style={{marginRight: 5}}/> :
        <BsPerson size={size} style={{marginRight: 5}}/>} {label}</>
}