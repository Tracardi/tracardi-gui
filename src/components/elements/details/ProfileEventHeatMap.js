import React, {useEffect, useState} from "react";
import HeatMap from "@uiw/react-heat-map";
import {request} from "../../../remote_api/uql_api_endpoint";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

export default function ProfileEventHeatMap({profileId=null}) {

    const [loading, setLoading] = useState(false)
    const [events, setEvents] = useState(false)

    useEffect(()=>{
        setLoading(true);
        request({
                url: (profileId!== null) ? '/events/heatmap/profile/' + profileId : '/events/heatmap',
                method: "get"
            },
            setLoading,
            ()=>{},
            (response)=>{
                if(response) {
                    setEvents(response.data)
                }
            },
        )
    }, [profileId])

    const startDate = () => {
        let date = new Date()
        date.setFullYear(date.getFullYear() - 1)
        return date
    }

    return <div style={{height:180}}>
        {loading && <CenteredCircularProgress/>}
        {events && <HeatMap value={events}
                    startDate={startDate()}
                    width={1080}
                    height={180}
                    rectSize={15}
                    rectProps={{
                        rx: 8
                    }}
                    panelColors={{
                        0: '#eee',
                        2: '#00a9a4',
                        4: '#00a9a4',
                        10: '#0288d1',
                        20: '#1976d2',
                        30: '#0d47a1',
                        50: '#103171',
                        100: '#002171'
                    }}
                    space = {3}
                    legendRender={()=>{}}

        />}
    </div>
}