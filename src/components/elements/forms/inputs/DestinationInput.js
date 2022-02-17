import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import React, {useEffect, useState} from "react";
import FlowNodeIcons from "../../../flow/FlowNodeIcons";
import {asyncRemote} from "../../../../remote_api/entrypoint";

export default function DestinationInput({value, onChange}) {

    const [destinations, setDestinations] = useState([]);
    const [destinationsDb, setDestionationsDb] = useState({})

    useEffect(()=> {
        let isSubscribed = true
        asyncRemote({
            url: '/destinations/type'
        }).then((response) => {
            setDestinations(Object.values(response.data));
            setDestionationsDb(response.data);
        }).catch(e => {
            console.error(e)
        }).finally(() => {

        })

        return () => isSubscribed = false
    },[])

    const handleOnChange = (ev) => {
        if(onChange && ev.target.value in destinationsDb) {
            onChange(ev.target.value, destinationsDb[ev.target.value])
        }
    }

    return <TextField
        select
        variant="outlined"
        size="small"
        value={value || {}}
        style={{width: 150}}
        onChange={handleOnChange}
    >
        {destinations.map((item) => {
            return <MenuItem value={item.package} key={item.package}>
                <div style={{display: "flex", alignItems:"center"}}><FlowNodeIcons icon={item.icon} /> <span style={{marginLeft: 10}}>{item.name}</span></div>
            </MenuItem>
        })}
    </TextField>

}