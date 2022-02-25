import React from "react";
import './EventStatusTag.css';

export default function EventStatusTag({label}) {
    if(label==='error' || label==='invalid')
        return <span className="EventStatusTag ErrorColor">{label}</span>
    if(label==='processed')
        return <span className="EventStatusTag OKColor">{label}</span>
    if(label==='warning')
        return <span className="EventStatusTag WarnColor">{label}</span>
    return <span className="EventStatusTag InfoColor">{label}</span>
}