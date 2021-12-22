import React from "react";
import './EventStatusTag.css';

export default function EventStatusTag({label}) {
    if(label==='error')
        return <span className="EventStatusTag ErrorColor">{label}</span>
    if(label==='ok')
        return <span className="EventStatusTag OKColor">{label}</span>
    if(label==='warning')
        return <span className="EventStatusTag WarnColor">{label}</span>
    return <span className="EventStatusTag InfoColor">{label}</span>
}