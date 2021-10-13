import React from "react";

export default function ErrorLine({children}) {

    return <div style={{color: "red", fontSize: 12}}>
            {children}
    </div>
}