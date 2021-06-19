import React, {useState} from "react";
import Button from "./Button";
import TextField from "@material-ui/core/TextField";
import {v4 as uuid4} from 'uuid';
import FormDescription from "../misc/FormDescription";
import ElevatedBox from "../misc/ElevatedBox";
import FormSubHeader from "../misc/FormSubHeader";
import Rows from "../misc/Rows";
import Columns from "../misc/Columns";
import Form from "../misc/Form";
import FormHeader from "../misc/FormHeader";

export default function MysqlSourceConfigForm({source, init, onSubmit}) {

    if(!init) {
        init = {
            port: 3006,
            host: "localhost",
            username: "",
            password: ""
        }
    }

    const [host, setHost] = useState(init.host);
    const [port, setPort] = useState(init.port);
    const [username, setUsername] = useState(init.username);
    const [password, setPassword] = useState(init.password);

    const _onSubmit = () => {
        const properties = {
            id: !(init?.id) ? uuid4() : init.id,
            host: host,
            port: port,
            username: username,
            password: password
        };

        source = {properties, ...source}

        onSubmit(source)
    }

    return <Form>
        <Columns>
            <FormHeader>Mysql connection data</FormHeader>
            <ElevatedBox>

                <FormSubHeader>Host</FormSubHeader>
                <FormDescription>Type mysql host address or ip.</FormDescription>
                <TextField
                    label={"Host address"}
                    value={host}
                    onChange={(ev) => {
                        setHost(ev.target.value)
                    }}
                    size="small"
                    variant="outlined"
                    fullWidth
                />

                <FormSubHeader>Port</FormSubHeader>
                <FormDescription>Type mysql port number.</FormDescription>
                <TextField
                    label={"Port"}
                    value={port}
                    onChange={(ev) => {
                        setPort(ev.target.value)
                    }}
                    size="small"
                    variant="outlined"
                    fullWidth
                />

                <FormSubHeader>User name</FormSubHeader>
                <FormDescription>Type mysql user name.</FormDescription>
                <TextField
                    label={"User name"}
                    value={username}
                    onChange={(ev) => {
                        setUsername(ev.target.value)
                    }}
                    size="small"
                    variant="outlined"
                    fullWidth
                />

                <FormSubHeader>User password</FormSubHeader>
                <FormDescription>Type mysql password.</FormDescription>
                <TextField
                    label={"User name"}
                    value={password}
                    onChange={(ev) => {
                        setPassword(ev.target.value)
                    }}
                    size="small"
                    variant="outlined"
                    fullWidth
                />

            </ElevatedBox>

        </Columns>
        <Rows style={{paddingLeft: 30}}>
            <Button label="Save" onClick={_onSubmit}/>
        </Rows>
    </Form>
}

