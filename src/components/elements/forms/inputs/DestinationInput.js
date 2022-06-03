import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import React, {useEffect, useState} from "react";
import FlowNodeIcons from "../../../flow/FlowNodeIcons";
import {asyncRemote} from "../../../../remote_api/entrypoint";

export default function DestinationInput({value: initValue, onChange}) {

    const [destinations, setDestinations] = useState([]);
    const [destinationsDb, setDestionationsDb] = useState({})
    const [value, setValue] = useState(initValue)

    useEffect(()=> {
        let isSubscribed = true
        asyncRemote({
            url: '/destinations/entity'
        }).then((response) => {
            if(isSubscribed) {
                setDestinations(Object.values(response.data));
                setDestionationsDb(response.data);
            }

        }).catch(e => {
            if(isSubscribed) {
                console.error(e)
            }
        }).finally(() => {

        })

        return () => isSubscribed = false
    },[])

    const handleOnChange = (ev) => {
        const id = ev.target.value
        setValue(id)
        if(onChange && id in destinationsDb) {
            onChange(id, destinationsDb[id])
        }
    }

    return <TextField
        select
        variant="outlined"
        size="small"
        value={value}
        style={{width: 150}}
        onChange={handleOnChange}
    >
        {destinations.map((item) => {
            return <MenuItem value={item.id} key={item.id}>
                <div style={{display: "flex", alignItems:"center"}}><FlowNodeIcons icon={item.icon} /> <span style={{marginLeft: 10}}>{item.name}</span></div>
            </MenuItem>
        })}
    </TextField>

}