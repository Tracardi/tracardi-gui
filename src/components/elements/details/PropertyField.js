import React from "react";
import {isObject} from "../../../misc/typeChecking";

const PropertyField = ({name, content}) => {
    return (
        <div
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
                minWidth: "330px",
            }}
            >
                {name}
            </div>
            <div>
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
        </div>
    );
}

export default PropertyField;