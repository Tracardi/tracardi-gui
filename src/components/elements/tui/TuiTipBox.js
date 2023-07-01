import React from "react";

export default function TuiTIpBox({children}) {
    return <p className="tipBox">
        <div style={{backgroundColor: "#ccc"}}>Tip</div>
        {children}
    </p>
}