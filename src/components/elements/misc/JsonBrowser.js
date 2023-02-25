import theme from "../../../themes/inspector_light_theme";
import {ObjectInspector} from "react-inspector";
import React, {useState} from "react";
import Button from "../forms/Button";
import 'react-json-pretty/themes/monikai.css';
import JSONPretty from "react-json-pretty";

export default function JsonBrowser({data}) {
    const [tree, setTree] = useState(true)
    return <>
        <div style={{marginBottom: 20}}>
            <Button label="tree" style={{padding: 2}}  onClick={() => setTree(true)} selected={tree}/>
            <Button label="raw" style={{padding: 2}} onClick={() => setTree(false)} selected={!tree}/>
        </div>
        {tree
            ? <ObjectInspector data={data} theme={theme} expandLevel={5}/>
            : <JSONPretty data={data} style={{fontSize: 13}}
                          mainStyle="background-color:white; margin: 0;color: rgb(187, 187, 187);"
                          keyStyle="color: #444"
                          valueStyle="color: rgb(0, 170, 0)"
                          stringStyle="color: rgb(0, 105, 192)"
            ></JSONPretty>}
        </>
}