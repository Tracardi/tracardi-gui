import Button from "../forms/Button";
import {MdUnfoldLess, MdUnfoldMore} from "react-icons/md";
import LinearProgress from "@mui/material/LinearProgress";
import React from "react";

export default function ShowHide({label, children, style, loading=false}) {

    const [display, setDisplay] = React.useState(false);

    return <>
        <div style={{...style, display: "flex", justifyContent: "flex-end"}}>
            {!display
                ? <Button label={`Display ${label}`}
                          icon={<MdUnfoldMore size={20}/>}
                          onClick={() => setDisplay(true)}/>
                : <Button label={`Hide ${label}`}
                          icon={<MdUnfoldLess size={20}/>}
                          onClick={() => {
                              setDisplay(false);
                          }}/>}
        </div>
        {loading && <div style={{marginTop: 10}}><LinearProgress/></div>}
        {display &&  children}
    </>
}