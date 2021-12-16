import React, {useState} from "react";
import {asyncRemote} from "../../../remote_api/entrypoint";
import TextField from "@material-ui/core/TextField";
import Button from "./Button";

export default function TracardiProForm({value, onSubmit}) {

    console.log(value, value?.username || "")


    const [data, setData] = useState(value || {});

    const handleRegisterTracardiPro = async () => {
        try {
            const response = await asyncRemote({
                url: '/tracardi/pro',
                method: "POST",
                data: {
                    ...data,
                    id: "0"
                }
            })

            if (onSubmit) {
                onSubmit()
            }
        } catch (e) {

        }
    }

    return <div>
        <TextField
            label="Event source URL"
            value={data.url}
            onChange={(ev) => {
                setData({...data, url: ev.target.value})
            }}
            size="small"
            variant="outlined"
            fullWidth
        />
        <TextField
            label="Token"
            value={data.token}
            onChange={(ev) => {
                setData({...data, token: ev.target.value})
            }}
            size="small"
            variant="outlined"
            style={{marginRight: 10}}
        />
        <TextField
            label="User name"
            value={data.username}
            onChange={(ev) => {
                setData({...data, username: ev.target.value})
            }}
            size="small"
            variant="outlined"
            style={{marginRight: 10}}
        />
        <TextField
            label="Password"
            value={data.password}
            type="password"
            onChange={(ev) => {
                setData({...data, password: ev.target.value})
            }}
            size="small"
            variant="outlined"
        />
        <div>
            <Button label="Register" onClick={handleRegisterTracardiPro}
                    style={{width: 160, padding: "6px 10px", justifyContent: "center"}}/>
        </div>
    </div>
}
