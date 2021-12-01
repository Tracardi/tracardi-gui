import React from "react";

export default function TuiTopHeaderWrapper({children, header, description, gap = 10, descHeight = 70}) {

    return <div style={{display: "flex", gap: gap, flexDirection: "column"}}>
            <div>
                <h3>{header}</h3>
                {description &&<p style={{height: descHeight, textOverflow: "ellipsis", overflow: "hidden"}}>{description}</p>}
            </div>
            <div>
                {children}
            </div>
    </div>
}