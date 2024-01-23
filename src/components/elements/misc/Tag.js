import React, {useState} from "react";

export default function Tag({children, style, tip, backgroundColor="#ccc", color="#000"}) {
    style = {backgroundColor, color, display: "inline-flex", alignItems: "center", padding: "2px 10px", fontSize:"90%", borderRadius: 5, marginRight: 5, marginTop: 2, whiteSpace: "nowrap", ...style}
    if(tip) {
        style = {...style, cursor: "help"}
    }
    return <span
        title={tip}
        style={style}>
        {children}
</span>
}

export function OnOverTag({on, off, onClick, style, tip, backgroundColor="#ccc", color="#000"}) {

    const [onOver, setOnOver] = useState(false)

    style = {backgroundColor, color, display: "inline-flex", cursor: "pointer", alignItems: "center", padding: "2px 10px", fontSize:"90%", borderRadius: 5, marginRight: 5, marginTop: 2, whiteSpace: "nowrap", ...style}
    if(tip) {
        style = {...style, cursor: "help"}
    }
    return onOver ? <span
        onMouseOver={()=>setOnOver(true)}
        onMouseOut={()=>setOnOver(false)}
        onClick={onClick}
        title={tip}
        style={style}>
        {on}
</span> : <span
        onMouseOver={()=>setOnOver(true)}
        onMouseOut={()=>setOnOver(false)}
        title={tip}
        style={style}>
        {off}
</span>
}