import React from "react";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../elements/tui/TuiForm";
import Properties from "../elements/details/DetailProperties";

const NodeInfo = ({node}) => {

    return  <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Plug-in Information"/>
            <TuiFormGroupContent>
                <div style={{padding: "0 10px 20px 10px"}}>
                    {node?.data?.metadata?.desc}
                </div>
                <Properties properties={{
                    "Name": node?.data?.metadata?.name,
                    "Author":node?.data?.spec?.author,
                    "License":node?.data?.spec?.license,
                    "Version": node?.data?.spec?.version,
                }}/>
            </TuiFormGroupContent>
        </TuiFormGroup>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Plug-in Runtime Details"/>
            <TuiFormGroupContent>
                <Properties properties={{
                    id: node?.id,
                    "Start action": node?.data?.start ? "Yes" : "No",
                    "Node type": node?.type,
                    "Runs only in debug mode": node?.data?.debug ? "Yes" : "No",
                    "Inputs": node?.data?.spec?.inputs?.join(','),
                    "Outputs": node?.data?.spec?.outputs?.join(','),
                    "Visual node type": node?.type,
                    "Position": node?.position,
                    "Runs": {
                        "module": node?.data?.spec?.module,
                        "class": node?.data?.spec?.className
                    }
                }}/>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}

export default NodeInfo;