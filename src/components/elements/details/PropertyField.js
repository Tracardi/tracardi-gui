import React, {useState} from "react";
import {isObject} from "../../../misc/typeChecking";
import {FiMoreHorizontal} from "react-icons/fi";
import FormDrawer from "../drawers/FormDrawer";

const PropertyField = ({name, content, children, drawerSize=800}) => {

    const [displayDetails, setDisplayDetails] = useState(false)

    return (
        <><div
            style={{
                overflowWrap: "anywhere",
                overflow: "none",
                paddingTop: "12px",
                paddingBottom: "2px",
                borderBottom: "1px solid #ccc",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                fontSize: 15,
                fontWeight: 400
            }}
        >
            <div style={{
                fontSize: 16,
                fontWeight: 600,
                maxWidth: "330px",
                whiteSpace: "nowrap",
                minWidth: "150px",
                textOverflow: "ellipsis",
                overflow: "hidden"
            }}
            >
                {name}
            </div>
            <div style={{display: "flex", alignItems: "center", justifyContent:"space-between", width: "100%"}}>
                <div style={{display: "flex", gap: 2, alignItems: "center"}}>
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
                {children && <FiMoreHorizontal size={18} style={{cursor: "pointer"}} onClick={() => setDisplayDetails(true)}/>}
            </div>
        </div>
            <FormDrawer
                width={drawerSize}
                label="Edit event source"
                onClose={() => {
                    setDisplayDetails(false)
                }}
                open={displayDetails}
            >
                {children}
            </FormDrawer>
        </>
    );
}

export default PropertyField;