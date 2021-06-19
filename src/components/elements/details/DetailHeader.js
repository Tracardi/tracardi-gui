import React from "react";
import "./DetailHeader.css";


const DetailHeader = ({label}) => {
    return <div className="DetailHeader">
            <div className="DetailLabel">{label}</div>
        </div>
}

export default DetailHeader;