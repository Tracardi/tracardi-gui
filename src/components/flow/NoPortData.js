import React from "react";
import AlertBox from "../errors/AlertBox";

export function NoPortData({input}) {
    if(input === true) {
        return <AlertBox>Port output has no data. It means that this node will not execute and the incoming connection is inactive.</AlertBox>
    }
    return <AlertBox>Port has no data. This means that next nodes will not execute.</AlertBox>
}