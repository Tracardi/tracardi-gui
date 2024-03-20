import React, {useContext, useState} from "react";
import {FiMoreHorizontal} from "react-icons/fi";
import FormDrawer from "../drawers/FormDrawer";
import "./PropertyField.css";
import TuiTags from "../tui/TuiTags";
import {KeyCloakContext} from "../../context/KeyCloakContext";
import hasRoles from "../../authentication/hasRoles";

const PropertyField = ({
                           name,
                           content,
                           children,
                           drawerSize = 800,
                           underline = true,
                           whiteSpace = 'normal',
                           valueAlign = "flex-start",
                           labelWidth = 200,
                           detailsRoles = null
                       }
) => {

    const authContext = useContext(KeyCloakContext)
    const [displayDetails, setDisplayDetails] = useState(false)

    function isEmpty(value) {
        return value === "" || value === null || typeof value === "undefined" ||
            (typeof value === "object" && Object.keys(value).length === 0) ||
            (typeof value === "number" && isNaN(value));
    }


    return (
        <>
            <div className="PropertyRow" style={{borderBottom: underline ? "1px dashed rgba(128,128,128,0.5)" : 0}}>
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
                            isEmpty(content)
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
                    {children && hasRoles(authContext?.state?.roles, detailsRoles) &&
                    <FiMoreHorizontal size={18} className="FieldMore" onClick={() => setDisplayDetails(true)}/>
                    }
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