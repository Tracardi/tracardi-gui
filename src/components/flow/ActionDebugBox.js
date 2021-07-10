import "./ActionDebugBox.css";
import React, {useEffect, useState} from "react";
import DebugBox from "./DebugBox";
import Button from "../elements/forms/Button";
import {AiOutlineNodeIndex} from "@react-icons/all-files/ai/AiOutlineNodeIndex";

export default function ActionDebugBox({calls, onConnectionDetails}) {

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

    const onConnectionClick = (call, index) => {
        setCall(call);
        setSelectedButton(index);
        if(onConnectionDetails) {
            onConnectionDetails(call?.edge?.id)
        }
    }

    const RenderConnections = ({calls}) => {
        if (calls && Array.isArray(calls)) {
            return calls.map((call, index) => {
                if(call.edge) {
                    return <Button
                        key={index}
                        selected={index===selectedButton}
                        icon={<AiOutlineNodeIndex size={20} style={{marginRight: 5}}/>}
                        label={"Connection: " + (index + 1)}
                        onClick={
                            () => onConnectionClick(call, index)
                        }
                    />
                }
                return ""

            });
        }
        return ""
    }

    return <div className="ActionDebugBox">
        <div style={{display: "flex"}}>
            <RenderConnections calls={calls}/>
        </div>
        {call && <DebugBox call={call}/>}
    </div>

}