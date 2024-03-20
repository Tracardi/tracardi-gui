import FormDrawer from "./FormDrawer";
import React, {useState} from "react";
import NoData from "../misc/NoData";
import {IoHelpOutline} from "react-icons/io5";

export default function DocsLink({children, src, style, icon=false}) {

    const [show, setShow] = useState(false)

    return <>
        <span onClick={() => setShow(!show)} style={{
            textDecoration: "underline",
            margin: "0 5px",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            backgroundColor: "rgba(200,200,200,.2)",
            padding: "1px 7px",
            ...style
        }}>{icon && <IoHelpOutline size={20} style={{marginRight: 5}}/>}{children}</span>
        <FormDrawer width={800} anchor="left" open={show} onClose={() => setShow(false)}>
            {src ? <iframe src={src} width="100%" height="100%" frameBorder={0} title="Documentation"/> :
                <NoData header="No documentation source defined."/>}
        </FormDrawer>
    </>
}