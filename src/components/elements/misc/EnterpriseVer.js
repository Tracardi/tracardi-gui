import React from "react";
import {Case, SwitchCase} from "./SwitchCase";

export default function EnterpriseVer({children, toggle}) {
    if(typeof toggle === "undefined") {
        toggle = "1";
    }
    return <SwitchCase caseId={process.env.REACT_APP_ENTERPRISE_VERSION}>
        <Case id={toggle}>
            {children}
        </Case>
    </SwitchCase>
}