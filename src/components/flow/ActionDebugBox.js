import "./ActionDebugBox.css";
import React, {useEffect, useState} from "react";
import DebugBox from "./DebugBox";
import Button from "../elements/forms/Button";
import {AiOutlineNodeIndex} from "@react-icons/all-files/ai/AiOutlineNodeIndex";

export default function ActionDebugBox({calls}) {

    const [call,setCall] = useState(null);
    const [selectedButton,setSelectedButton] = useState(null);

    useEffect(()=>{
        if(calls && Array.isArray(calls) && calls.length > 0) {
            setCall(calls[0]);
            setSelectedButton(0);
        } else {
            setCall(null);
            setSelectedButton(null);
        }

    }, [calls])

    const RenderActions = ({calls}) => {
        if (calls && Array.isArray(calls)) {
            return calls.map((call, index) => {
                if(call.edge) {
                    return <Button
                        selected={index===selectedButton}
                        icon={<AiOutlineNodeIndex size={20} style={{marginRight: 5}}/>}
                        label={"Connection: " + (index + 1)}
                        onClick={()=>{setCall(call); setSelectedButton(index)}}
                    />
                }
                return ""

            });
        }
        return ""
    }

    return <div className="ActionDebugBox">
        <div style={{display: "flex"}}>
            <RenderActions calls={calls}/>
        </div>
        {call && <DebugBox call={call}/>}
    </div>

}