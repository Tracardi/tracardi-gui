import React from "react";
import "./DetailKeyValue.css";

const DetailKeyValue = ({label, value}) => {
    return <div className="DetailKeyValue">
        <div title={label} className="DetailKey">{label}</div>
        <div title={value} className='DetailValue'>{value}</div>
    </div>
}

export default DetailKeyValue;