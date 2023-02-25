import PropertyField from "../../details/PropertyField";
import {isEmptyObject} from "../../../../misc/typeChecking";
import JsonStringify from "../../misc/JsonStingify";
import React, {useState} from "react";
import SessionDetails from "../../details/SessionDetails";
import SessionCardInfo from "../../details/SessionCardInfo";
import ResponsiveDialog from "../../dialog/ResponsiveDialog";
import Button from "../../forms/Button";
import {BsXCircle} from "react-icons/bs";
import {VscJson} from "react-icons/vsc";
import JsonBrowser from "../../misc/JsonBrowser";

export default function SessionRow({session, filterFields}) {

    const displayContext = window?.CONFIG?.session?.display?.row?.context
    const [jsonData, setJsonData] = useState(null);

    const handleJsonClick = (data) => {
        setJsonData(data)
    }

    return <>
        {jsonData && <ResponsiveDialog title="Session JSON"
                                       open={jsonData !== null}
                                       button={<Button label="Close"
                                                       icon={<BsXCircle size={20}/>}
                                                       onClick={() => setJsonData(null)}/>}>
            <JsonBrowser data={jsonData}/>
        </ResponsiveDialog>}
        <div style={{display: "flex"}}>
            <div style={{flex: "1 1 0", minWidth: 540, borderRight: "solid 1px #ccc", paddingRight: 17}}>
                <SessionCardInfo session={session} displayContext={false}/>
            </div>
            <div style={{flex: "2 1 0", width: "100%", paddingLeft: 15, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <div>
                    <div style={{paddingRight: 15, marginBottom: 10}}>
                        <PropertyField content={<span style={{fontSize: "110%", fontWeight: 500}}>{session.id}</span>}
                                       drawerSize={1300} underline={false}>
                            <SessionDetails data={session}/>
                        </PropertyField>
                    </div>
                    {displayContext && <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0}}>
                        <legend>Context</legend>
                        {!isEmptyObject(session.context) ?
                            <JsonStringify data={session.context} filterFields={filterFields}/> : "No context"}
                    </fieldset>}
                </div>
                <div>
                    <Button label="Json" size="small" icon={<VscJson size={20}/>} onClick={() => handleJsonClick(session)}/>
                </div>
            </div>
        </div>
    </>
}