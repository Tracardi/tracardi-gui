import PropertyField from "./PropertyField";
import DateValue from "../misc/DateValue";
import React, {useState} from "react";
import IdLabel from "../misc/IconLabels/IdLabel";
import {profileName} from "../../../misc/formaters";
import {BsGlobe, BsPhone} from "react-icons/bs";
import IconLabel from "../misc/IconLabels/IconLabel";
import FlowNodeIcons from "../../flow/FlowNodeIcons";
import {ProfileImage} from "./ProfileImage";
import DataTreeDialog from "../dialog/DataTreeDialog";
import Button from "../forms/Button";
import {VscJson} from "react-icons/vsc";
import ProfileDetails from "./ProfileDetails";
import {displayLocation} from "../../../misc/location";

export default function ProfileCardInfo({profile, displayDetails=false}) {

    const labelWidth = 180
    const profileFullName = profileName(profile)

    const [jsonData, setJsonData] = useState(null);

    const handleJsonClick = (data) => {
        setJsonData(data)
    }


    return <>
        {jsonData && <DataTreeDialog open={jsonData !== null}
                                     data={jsonData}
                                     onClose={() => setJsonData(null)}/>}
        <div style={{display: "flex", gap: 20}}>
            <div style={{
                flex: "2 1 0",
                maxWidth: 140,
                paddingLeft: 15,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}>
                <ProfileImage profile={profile}/>
                <Button label="Json" size="small" icon={<VscJson size={20}/>} onClick={() => handleJsonClick(profile)}/>
            </div>

            <div style={{width: "100%"}}>
                {window?.CONFIG?.profile?.display?.row?.id === "name" && <div style={{marginBottom: 20}}><PropertyField
                    content={<span style={{fontSize: "150%", fontWeight: 500, padding: 5}}>{profileFullName}</span>}
                    drawerSize={1320} underline={false}>
                    {displayDetails && <ProfileDetails profile={profile}/>}
                </PropertyField></div>}
                <PropertyField labelWidth={labelWidth} name="Id" content={<IdLabel label={profile.id}/>}/>
                {window?.CONFIG?.profile?.display?.row?.id === "id" &&
                <PropertyField labelWidth={labelWidth} name={window?.CONFIG?.profile?.id || "Profile id"}
                               content={<IconLabel
                                   icon={<span style={{marginRight: 5}}><FlowNodeIcons
                                       icon={window?.CONFIG?.profile?.icon1 || "profile"} size={20}/></span>}
                                   value={profile.id}/>}
                />}
                <PropertyField labelWidth={labelWidth} name="First seen"
                               content={<DateValue date={profile.metadata?.time?.insert}/>}/>
                <PropertyField labelWidth={labelWidth} name="Session start" content={<>
                    <DateValue date={profile?.metadata?.time?.visit?.current}/>
                    {profile?.metadata?.time?.visit?.tz && <IconLabel
                        value={profile?.metadata.time.visit.tz}
                        style={{marginLeft: 5}}
                        icon={<BsGlobe size={20} style={{marginRight: 5}}/>}
                    />}
                </>}/>
                {profile?.data?.devices?.last?.geo?.country && <PropertyField labelWidth={labelWidth}
                                                                           name="Last Location" content={
                    <IconLabel
                        value={displayLocation(profile?.data?.devices?.last?.geo)}
                        icon={<BsGlobe size={20} style={{marginRight: 5}}/>}
                    />}/>}
                <PropertyField labelWidth={labelWidth} name="All visits"
                               content={profile?.metadata?.time?.visit.count}/>
            </div>

        </div>
    </>
}