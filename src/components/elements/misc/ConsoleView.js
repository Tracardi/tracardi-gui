import {ObjectInspector} from "react-inspector";
import theme from "../../../themes/inspector_light_theme";
import React from "react";

const ConsoleView = ({label, data}) => {
    return <form className="JsonForm">
        <div className="JsonFromGroup">
            <div className="JsonFromGroupHeader">
                <h2>{label}</h2>
            </div>
            <section>
                <ObjectInspector data={data} theme={theme} expandLevel={5}/>
            </section>
        </div>
    </form>
}

export default ConsoleView;

