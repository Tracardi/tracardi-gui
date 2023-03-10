import {VscError} from "react-icons/vsc";
import React from "react";
import "./FetchError.css";

function ErrorDetails({error}) {
    return <table className="ErrorList">
        {error?.status && <tr>
            <td>Status</td>
            <td>{error.status}</td>
        </tr>}
        {error?.statusText && <tr>
            <td>Message</td>
            <td>{error.statusText} {error.status===422 && " [Some data seem to be incorrect.]"}</td>
        </tr>}
        {error?.config?.url && <tr>
            <td>Url</td>
            <td>{error.config.url}</td>
        </tr>}
        {Array.isArray(error?.data?.detail)
            ? error?.data?.detail.map((e, index) => {
                return <tr key={index}>
                    <td valign="top">Details</td>
                    <td>
                        {e.type && <div><b>Type</b>: {e.type}</div>}
                        {e.msg && <div><b>Message</b>: {e.msg}</div>}
                        {e.loc && <div><b>Invalid data located at</b>: {e.loc.join(".")}</div>}
                    </td>
                </tr>
            })
            : <tr>
                <td valign="top">Details</td>
                <td>{error?.data?.detail}</td>
            </tr>
        }
    </table>
}

export default function FetchError({error, fillWidth, style}) {

    const visual = (typeof fillWidth === "undefined") ? "FetchError NotFullErrorBox" : "FetchError";

    return <div className={visual} style={style}>
        <div style={{width: 40}}><VscError size={40}/></div>
        <div className="ErrorDetails">
            <div className="Header">The following errors occurred:</div>
            <ErrorDetails error={error}/>
        </div>
    </div>
}