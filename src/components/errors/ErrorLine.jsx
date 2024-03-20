import React from "react";

export default function ErrorLine({children, style}) {

    return <div style={{color: "red", fontSize: 12, ...style}}>
            {children}
    </div>
}