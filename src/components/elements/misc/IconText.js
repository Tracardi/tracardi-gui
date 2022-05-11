import React from "react";

const IconText = ({icon, color, children}) => {
    return <div style={{display: "flex", alignItems: 'center', backgroundColor: color, padding: "2px 10px", borderRadius: 4}}>
        {icon} <span style={{color: "white"}}>{children}</span>
    </div>
}

export default IconText;