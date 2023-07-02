import React from "react";
import SessionStepper from "../steppers/SessionStepper";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import "./SessionSlider.css";
import {Slider} from "@mui/material";
import NoData from "../misc/NoData";
import {useFetch} from "../../../remote_api/remoteState";
import {getProfileSession} from "../../../remote_api/endpoints/profile";
import FetchError from "../../errors/FetchError";
import SessionDeviceCard from "../details/SessionDeviceCard";
import SessionCardInfo from "../details/SessionCardInfo";
import Tabs, {TabCase} from "../tabs/Tabs";

export default function SessionSlider({profileId, onEventSelect}) {

    const [offset, setOffset] = React.useState(0);

    const {isLoading, data: session, error} = useFetch(
        ["getProfileSession",[profileId, offset]],
        getProfileSession(profileId, offset),
        (data) => {return data}
    )

    if (error) {
        return <FetchError error={error} style={{marginTop: 20}}/>
    }

    return (
        <div className="SessionSlider">
            <div style={{
                display: 'flex',
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                alignContent: "space-between",
                padding: 15
            }}>
                <header style={{display: "flex", alignItems: "center"}}>Session offset</header>
                <Slider
                    size="small"
                    defaultValue={0}
                    marks
                    valueLabelDisplay="auto"
                    min={-10}
                    max={0}
                    onChangeCommitted={(_, value) => setOffset(value)}
                />
            </div>
            {isLoading && <CenteredCircularProgress/>}
            {!isLoading && session === null && <div style={{
                height: "inherit",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <NoData header="No data found for defined session offset" fontSize="16px"/>
            </div>}

            {!isLoading && session !== null && <>
                <div style={{width: "100%", borderRadius: 10, border: "solid 1px #ccc"}}>
                    <Tabs tabs={["Metadata", "Location & Device"]}>
                        <TabCase id={0}>
                            <div style={{padding: 20}}>
                                <SessionCardInfo session={session}/>
                            </div>

                        </TabCase>
                        <TabCase id={1}>
                            <div style={{padding: 20}}>
                                <SessionDeviceCard session={session}/>
                            </div>
                        </TabCase>
                    </Tabs>
                </div>
                <SessionStepper
                    profileId={profileId}
                    session={session}
                    onEventSelect={onEventSelect}
                />
            </>
            }
        </div>
    );
}