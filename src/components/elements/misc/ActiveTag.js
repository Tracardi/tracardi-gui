import {BsCheckCircle, BsXSquare} from "react-icons/bs";
import React from "react";

export default function ActiveTag({active}) {
    return active
        ? <BsCheckCircle size={20} color="#00c853"/> :
        <BsXSquare size={20} color="#d81b60"/>
}