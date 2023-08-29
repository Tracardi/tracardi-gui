import React from "react";
import {BsInfoCircle} from "react-icons/bs";

export default function TuiTIpBox({children}) {
    return <p className="tipBox">
        <div className="flexLine tipHeader"><BsInfoCircle size={20} style={{marginRight: 10}}/><span style={{fontSize: 15, fontWeight: 600}}>Tip</span></div>
        <div className="tipBody">{children}</div>
    </p>
}