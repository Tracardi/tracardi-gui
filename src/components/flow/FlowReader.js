import React from "react";
import {useParams} from "react-router-dom";
import FlowDisplay from "./FlowDetails";

export default function FlowReader() {
    let {id} = useParams();
    return <FlowDisplay id={id}/>
}
