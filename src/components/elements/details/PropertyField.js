import React, {useState} from "react";
import {isObject} from "../../../misc/typeChecking";
import {FiMoreHorizontal} from "react-icons/fi";
import FormDrawer from "../drawers/FormDrawer";
import "./PropertyField.css";

const PropertyField = ({name, content, children, drawerSize=800, underline=true, whiteSpace='normal'}) => {

    const [displayDetails, setDisplayDetails] = useState(false)

    return (
        <><div className="PropertyRow" style={{borderBottom: underline ? "1px dashed #bbb" : 0}}>
            {name && <div className="FieldName">
                <span>{name}</span>
            </div>}
            <div className="FieldValue">
                <div style={{display: "flex", gap: 2, alignItems: "center", whiteSpace: whiteSpace, textOverflow: "ellipsis", overflow: "hidden"}}>
                    {
                        typeof content !== "undefined" && React.isValidElement(content) ?
                            content
                            :
                            isObject(content) || content === "" || (typeof content !== "boolean" && !content) ?
                                '<empty>'
                                :
                                typeof content === "boolean" ? content.toString() : content
                    }
                </div>
                {children && <FiMoreHorizontal size={18} className="FieldMore" onClick={() => setDisplayDetails(true)}/>}
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