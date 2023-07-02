import React, {useState} from "react";
import {isEmptyObject} from "../../../misc/typeChecking";
import {FiMoreHorizontal} from "react-icons/fi";
import FormDrawer from "../drawers/FormDrawer";
import "./PropertyField.css";
import TuiTags from "../tui/TuiTags";

const PropertyField = ({name, content, children, drawerSize = 800, underline = true, whiteSpace = 'normal', valueAlign="flex-start", labelWidth = 200}) => {

    const [displayDetails, setDisplayDetails] = useState(false)
    return (
        <>
            <div className="PropertyRow" style={{borderBottom: underline ? "1px dashed #bbb" : 0}}>
                {name && <div className="FieldName" style={{width: labelWidth}}>
                    <span>{name}</span>
                </div>}
                <div className="FieldValue">
                    <div style={{
                        display: "flex",
                        gap: 2,
                        alignItems: "center",
                        whiteSpace: whiteSpace,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        flexWrap: "wrap",
                        justifyContent: valueAlign,
                        width: "100%"
                    }}>
                        {
                            content === "" || content === null || typeof content === "undefined" || isEmptyObject(content)
                                ? '<empty>'
                                : typeof content === "number"
                                    ? content.toString()
                                    : typeof content === "boolean"
                                        ? content.toString()
                                        : Array.isArray(content)
                                            ? <TuiTags tags={content} size="small"/>
                                            : content
                        }
                    </div>
                    {children &&
                    <FiMoreHorizontal size={18} className="FieldMore" onClick={() => setDisplayDetails(true)}/>}
                </div>
            </div>
            <FormDrawer
                width={drawerSize}
                onClose={() => {
                    setDisplayDetails(false)
                }}
                open={displayDetails}
            >
                {displayDetails && children}
            </FormDrawer>
        </>
    );
}

export default PropertyField;