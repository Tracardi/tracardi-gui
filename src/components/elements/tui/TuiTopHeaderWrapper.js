import React from "react";
import './TuiTopHeaderWrapper.css';

export default function TuiTopHeaderWrapper({children, header, description, style, descHeight = 70}) {

    return <div className="TuiTopHeaderWrapper" style={style}>
            <div>
                <div className="Title">{header}</div>
                {description &&<div style={{height: descHeight, textOverflow: "ellipsis", overflow: "hidden"}}>{description}</div>}
            </div>
            <div>
                {children}
            </div>
    </div>
}