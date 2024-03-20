import {ObjectInspector} from "react-inspector";
import theme from "../../../themes/inspector_light_theme";
import React from "react";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";

const ConsoleView = ({label, data}) => {
    return <TuiForm>
        <TuiFormGroup>
            <TuiFormGroupHeader header={label}/>
            <TuiFormGroupContent>
                <ObjectInspector data={data} theme={theme} expandLevel={5}/>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}

export default ConsoleView;

