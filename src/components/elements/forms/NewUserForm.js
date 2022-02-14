import React from "react";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import {v4 as uuid4} from "uuid";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import ErrorsBox from "../../errors/ErrorsBox";
import {Checkbox, FormControlLabel, Switch, TextField} from "@mui/material";
import Button from "./Button";

export default function NewUserForm({ onSubmit}) {

    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [fullName, setFullName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [admin, setAdmin] = React.useState(false);
    const [marketer, setMarketer] = React.useState(false);
    const [developer, setDeveloper] = React.useState(false);
    const [enabled, setEnabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const mounted = React.useRef(false);

    const handleSave = async () => {
        if (password && confirmPassword === password && fullName && email) {
            setLoading(true);
            setErrorMessage(null);
            setError(false);
            try {
                let rolesToSend = [];
                if (admin) rolesToSend.push("admin");
                if (marketer) rolesToSend.push("marketer");
                if (developer) rolesToSend.push("developer");
                await asyncRemote({
                    url: "/user",
                    method: "POST",
                    data: {
                        id: uuid4(),
                        password: password,
                        roles: rolesToSend,
                        disabled: !enabled,
                        full_name: fullName,
                        email: email
                    }
                })

                if(onSubmit) {
                    onSubmit();
                }
            }
            catch (error) {
                if (mounted.current) setErrorMessage(getError(error));
            }
            if (mounted.current) setLoading(false);
        }
        else if (mounted.current) { setError(true) }
    }

    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])

    return (
        <TuiForm style={{ padding: 20 }}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="New user" description="Here you can create a new user."/>
                {errorMessage && <ErrorsBox errorList={errorMessage}/>}
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Email" description="Please type the email address of the new user.">
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Email"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            size="small"
                            error={!email && error}
                            helperText={!email && error && "Email cannot be empty"}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Password" description="Type new user's password.">
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            size="small"
                            error={!password && error}
                            helperText={!password && error && "Password cannot be empty"}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Confirm password" description="Please retype the password for confirmation that it is correct.">
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Confirm password"
                            value={confirmPassword}
                            onChange={event => setConfirmPassword(event.target.value)}
                            size="small"
                            error={(!confirmPassword || confirmPassword !== password) && error}
                            helperText={(!confirmPassword || confirmPassword !== password) && error && (confirmPassword !== password ? "Passwords don't match" : "This field cannot be empty")}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Full name" description="Please type in the full name of the new user.">
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Full name"
                            value={fullName}
                            onChange={event => setFullName(event.target.value)}
                            size="small"
                            error={!fullName && error}
                            helperText={!fullName && error && "Full name cannot be empty"}
                        />
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Roles" description="You can edit the roles of this user."/>
                <TuiFormGroupField>
                    <FormControlLabel style={{padding: 10, marginLeft: 10}} control={<Checkbox size="medium" checked={admin} onChange={() => setAdmin(!admin)}/>} label="Admin"/>
                    <FormControlLabel style={{padding: 10, marginLeft: 10}} control={<Checkbox size="medium" checked={marketer} onChange={()=> setMarketer(!marketer)}/>} label="Marketer"/>
                    <FormControlLabel style={{padding: 10, marginLeft: 10}} control={<Checkbox size="medium" checked={developer} onChange={() => setDeveloper(!developer)}/>} label="Developer"/>
                </TuiFormGroupField>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Enabled" description="You can disable this user if you want."/>
                <TuiFormGroupField>
                    <FormControlLabel style={{padding: 10, marginLeft: 10}} control={<Switch size="medium" checked={enabled} onChange={() => setEnabled(!enabled)}/>} label="Enable user"/>
                </TuiFormGroupField>
            </TuiFormGroup>
            <Button label="Save" onClick={handleSave} progress={loading} style={{justifyContent: "center"}} error={error || errorMessage}/>
        </TuiForm>
    );
}
