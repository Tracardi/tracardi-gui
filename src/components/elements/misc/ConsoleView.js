import {ObjectInspector} from "react-inspector";
import theme from "../../../themes/inspector_light_theme";
import React from "react";
import './ConsoleView.css';


const ConsoleView = ({label, data}) => {
    return <section className="ConsoleView">
        <div className="Title">
            {label}
        </div>
        <div className="Content">
            <ObjectInspector data={data} theme={theme} expandLevel={5}/>
        </div>
    </section>
}

export default ConsoleView;