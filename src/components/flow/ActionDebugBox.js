import "./ActionDebugBox.css";
import React, {useEffect, useState} from "react";
import DebugBox from "./DebugBox";
import Button from "../elements/forms/Button";
import {AiOutlineNodeIndex} from "@react-icons/all-files/ai/AiOutlineNodeIndex";

export default function ActionDebugBox({debugging, onConnectionDetails}) {

    const [call, setCall] = useState(null);
    const [selectedButton, setSelectedButton] = useState(null);

    useEffect(() => {
        if (debugging?.node && Array.isArray(debugging.node.calls) && debugging.node.calls.length > 0) {
            setCall(debugging.node.calls[0]);
            setSelectedButton(0);
        } else {
            setCall(null);
            setSelectedButton(null);
        }

    }, [debugging])

    const onConnectionClick = (call, index) => {
        setCall(call);
        setSelectedButton(index);
        if (onConnectionDetails) {
            onConnectionDetails(call?.input?.edge?.id)
        }
    }

    const onTabSelect = (tabId) => {}

    const RenderConnections = ({node}) => {
        if (node && Array.isArray(node?.calls)) {
            return node?.calls.map((call, index) => {
                if (call.input?.edge) {
                    return <Button
                        key={index}
                        selected={index === selectedButton}
                        icon={<AiOutlineNodeIndex size={20} style={{marginRight: 5}}/>}
                        label={"Connection - " + (index + 1)}
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
        <div style={{display: "flex", flexFlow: "wrap"}}>
            <RenderConnections node={debugging?.node}/>
        </div>
        {call && <DebugBox call={call}
                           onTabSelect={onTabSelect}/>}
    </div>

}