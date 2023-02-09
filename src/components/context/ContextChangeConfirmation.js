import {BsHddNetwork} from "react-icons/bs";
import PaperBox from "../elements/misc/PaperBox";
import React from "react";

export default function ContextChangeConfirmation({context}) {
    return <PaperBox>
        <BsHddNetwork size={50} style={{color: "#666"}}/>
        <h1 style={{fontWeight: 300, textAlign: "center"}}>You are now connected to {context} server</h1>
        <p>Please continue as usual.</p>
    </PaperBox>
}