import "./ActionDebugBox.css";
import React, {useEffect, useState} from "react";
import DebugBox from "./DebugBox";
import Button from "../elements/forms/Button";
import {AiOutlineNodeIndex} from "@react-icons/all-files/ai/AiOutlineNodeIndex";

export default function ActionDebugBox({debugging, onConnectionDetails}) {

    const [call, setCall] = useState(null);
    const [selectedButton, setSelectedButton] = useState(null);
    const [selectedTab, setSelectedTab] = useState(0);

    useEffect(() => {
        if (debugging && Array.isArray(debugging.calls) && debugging.calls.length > 0) {
            setCall(debugging.calls[0]);
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

    const onTabSelect = (tabId) => {
        setSelectedTab(tabId);
        if (tabId !== 0) {
            onConnectionDetails(null)
        }
    }

    const RenderConnections = ({debugging}) => {
        if (debugging && Array.isArray(debugging.calls)) {
            return debugging.calls.map((call, index) => {
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
            <RenderConnections debugging={debugging}/>
        </div>
        {call && <DebugBox call={call} onTabSelect={
            onTabSelect
        }/>}
    </div>

}