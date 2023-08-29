import PropertyField from "../../details/PropertyField";
import {isEmptyObject} from "../../../../misc/typeChecking";
import JsonStringify from "../../misc/JsonStingify";
import React, {useState} from "react";
import SessionDetails from "../../details/SessionDetails";
import Button from "../../forms/Button";
import {VscJson} from "react-icons/vsc";
import DataTreeDialog from "../../dialog/DataTreeDialog";
import SessionRowCardInfo from "../../details/SessionRowCardInfo";
import Tag from "../../misc/Tag";
import {capitalizeString} from "../../misc/EventTypeTag";

export default function SessionRow({session, filterFields}) {

    const displayContext = window?.CONFIG?.session?.display?.row?.context
    const [jsonData, setJsonData] = useState(null);

    const handleJsonClick = (data) => {
        setJsonData(data)
    }

    return <>
        {jsonData && <DataTreeDialog open={jsonData !== null}
                                     data={jsonData}
                                     onClose={() => setJsonData(null)}/>}
        <div style={{display: "flex"}}>
            <div style={{flex: "1 1 0", minWidth: 540, borderRight: "solid 1px #ccc", paddingRight: 17}}>
                <SessionRowCardInfo session={session} displayContext={false}/>
            </div>
            <div style={{flex: "2 1 0", width: "100%", paddingLeft: 15, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
                <div>
                    <div style={{paddingRight: 15, marginBottom: 10}}>
                        <PropertyField content={<><span style={{fontSize: "110%", fontWeight: 500}}>{session.id}</span> {session.metadata.status && <Tag style={{fontSize: 13, marginLeft: 10}}>{capitalizeString(session.metadata.status)}</Tag>}</>}
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