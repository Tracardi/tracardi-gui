import React from "react";
import './TuiTopHeaderWrapper.css';

export default function TuiTopHeaderWrapper({children, header, description, style}) {

    return <div className="TuiTopHeaderWrapper" style={style}>
            <div>
                <div className="Title">{header}</div>
                {description &&<div style={{textOverflow: "ellipsis", overflow: "hidden"}}>{description}</div>}
            </div>
            <div>
                {children}
            </div>
    </div>
}