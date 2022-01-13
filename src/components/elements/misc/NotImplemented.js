import {VscWarning} from "react-icons/vsc";
import React from "react";

const NotImplemented = ({children}) => {
    return <div style={{display: "flex", alignItems: 'center', backgroundColor: "orange", padding: 4, borderRadius: 4}}>
        <VscWarning style={{color: "white", marginRight: 5}} size={20} title="Incompatible backend version ."/> <span style={{color: "white"}}>{children}</span>
    </div>
}

export default NotImplemented;