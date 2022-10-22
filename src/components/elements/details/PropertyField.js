import React, {useState} from "react";
import {isObject} from "../../../misc/typeChecking";
import {FiMoreHorizontal} from "react-icons/fi";
import FormDrawer from "../drawers/FormDrawer";
import "./PropertyField.css";

const PropertyField = ({name, content, children, drawerSize=800, underline=true}) => {

    const [displayDetails, setDisplayDetails] = useState(false)

    return (
        <><div className="PropertyField" style={{borderBottom: underline ? "1px dashed #bbb" : 0}}>
            {name && <div className="PropertyFieldName">
                {name}
            </div>}
            <div style={{display: "flex", alignItems: "center", justifyContent:"space-between", width: "100%"}}>
                <div style={{display: "flex", gap: 2, alignItems: "center", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>
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
                {children && <FiMoreHorizontal size={18} className="PropertyFieldMore" onClick={() => setDisplayDetails(true)}/>}
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