import {ObjectInspector} from "react-inspector";
import theme from "../../../themes/inspector_light_theme";
import React from "react";
import './ConsoleView.css';
import {Typography} from "@material-ui/core";

const ConsoleView = ({label, data}) => {
    return <section className="ConsoleView">
        <div className="Title">
            <Typography color={"textPrimary"}>{label}</Typography>
        </div>
        <div className="Content">
            <ObjectInspector data={data} theme={theme} expandLevel={5}/>
        </div>
    </section>
}

export default ConsoleView;

