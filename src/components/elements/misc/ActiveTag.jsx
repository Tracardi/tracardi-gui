import React from "react";
import Tag from "./Tag";

export default function ActiveTag({active, trueLabel="true", falseLabel="false"}) {
    return active
        ? <Tag backgroundColor="#00c853" color="white">{trueLabel}</Tag> :
        <Tag backgroundColor="rgb(173, 20, 87)" color="white">{falseLabel}</Tag>
}