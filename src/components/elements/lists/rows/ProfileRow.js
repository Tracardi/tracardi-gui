import PropertyField from "../../details/PropertyField";
import {profileName} from "../../../../misc/formaters";
import ProfileDetails from "../../details/ProfileDetails";
import {isEmptyObject, isNotEmptyArray} from "../../../../misc/typeChecking";
import JsonStringify from "../../misc/JsonStingify";
import React, {useState} from "react";
import ProfileCardInfo from "../../details/ProfileCardInfo";
import TuiTags from "../../tui/TuiTags";
import Button from "../../forms/Button";
import {VscJson} from "react-icons/vsc";
import DataTreeDialog from "../../dialog/DataTreeDialog";

export default function ProfileRow({profile, filterFields}) {

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
            <ProfileCardInfo profile={profile}/>
        </div>
        <div style={{flex: "2 1 0", width: "100%", paddingLeft: 15, display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
            <div>
                <div style={{paddingRight: 15, marginBottom: 10}}>
                    <PropertyField content={<span style={{fontSize: "110%", fontWeight: 500}}>{profileName(profile)}</span>} drawerSize={1320} underline={false}>
                        <ProfileDetails profile={profile}/>
                    </PropertyField>
                </div>
                <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0}}>
                    <legend>Public traits</legend>
                    {!isEmptyObject(profile.traits?.public) ?
                        <JsonStringify data={profile.traits} filterFields={filterFields}/> : "No traits"}
                </fieldset>
                {!isEmptyObject(profile.traits?.private) && <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0}}>
                    <legend>Private traits</legend>
                    <JsonStringify data={profile.traits?.private} filterFields={filterFields}/>
                </fieldset>}

                {isNotEmptyArray(profile.segments) && <fieldset style={{borderWidth: "1px 0 0 0", borderRadius: 0, marginTop: 10}}>
                    <legend>Segments</legend>
                    <div className="flexLine" style={{gap: 5}}><TuiTags tags={profile.segments} size="small"/></div>
                </fieldset>}
            </div>
            <div>
                <Button label="Json" size="small" icon={<VscJson size={20}/>} onClick={() => handleJsonClick(profile)}/>
            </div>
        </div>
    </div></>
}