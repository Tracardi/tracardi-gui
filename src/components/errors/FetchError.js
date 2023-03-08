import {VscError} from "react-icons/vsc";
import React from "react";
import "./FetchError.css";

export default function FetchError({error, fillWidth, style}) {

    const visual = (typeof fillWidth === "undefined") ? "FetchError NotFullErrorBox" : "FetchError";

    return <div className={visual} style={style}>
        <div style={{width: 40}}><VscError size={40}/></div>
        <div className="ErrorDetails">
            <div className="Header">The following errors occurred:</div>
            <table className="ErrorList">
                {error?.status && <tr>
                    <td>Status</td>
                    <td>{error.status}</td>
                </tr>}
                {error?.statusText && <tr>
                    <td>Message</td>
                    <td>{error.statusText}</td>
                </tr>}
                {error?.config?.url && <tr>
                    <td>Url</td>
                    <td>{error.config.url}</td>
                </tr>}
                {error?.data?.detail && <tr>
                    <td>Details</td>
                    <td>{error.data.detail}</td>
                </tr>}
            </table>
        </div>
    </div>
}