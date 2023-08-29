import React from "react";
import Tag from "./Tag";

export default function ActiveTag({active}) {
    return active
        ? <Tag backgroundColor="#00c853" color="white">true</Tag> :
        <Tag backgroundColor="rgb(173, 20, 87)" color="white">false</Tag>
}