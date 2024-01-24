import React from "react";
import {getError} from "../../../remote_api/entrypoint";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import ErrorsBox from "../../errors/ErrorsBox";
import {Checkbox, FormControlLabel, Switch, TextField} from "@mui/material";
import Button from "./Button";
import PasswordInput from "./inputs/PasswordInput";
import ErrorLine from "../../errors/ErrorLine";
import {useRequest} from "../../../remote_api/requestClient";

export default function NewUserForm({ onSubmit}) {

    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [fullName, setFullName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [admin, setAdmin] = React.useState(false);
    const [marketer, setMarketer] = React.useState(false);
    const [developer, setDeveloper] = React.useState(false);
    const [dataAdmin, setDataAdmin] = React.useState(false);
    const [enabled, setEnabled] = React.useState(true);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const mounted = React.useRef(false);
    const {request} = useRequest()

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
                if (dataAdmin) rolesToSend.push("maintainer");
                await request({
                    url: "/user",
                    method: "POST",
                    data: {
                        password: password,
                        roles: rolesToSend,
                        enabled: enabled,
                        full_name: fullName,
                        email: email,
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
                <TuiFormGroupHeader header="New system user" description="Create a new user."/>
                {errorMessage && <ErrorsBox errorList={errorMessage}/>}
                <TuiFormGroupContent>
                    <TuiFormGroupField header="E-mail" description="Please type the e-mail address of the new user.">
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="E-mail"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            size="small"
                            error={!email && error}
                            helperText={!email && error && <ErrorLine>Email cannot be empty</ErrorLine>}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Password" description="Type new user's password.">
                        <PasswordInput
                            fullWidth
                            variant="outlined"
                            label="Password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            error={!password && error}
                            helperText={!password && error && <ErrorLine>Password cannot be empty</ErrorLine>}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Confirm password" description="Please retype the password for confirmation that it is correct.">
                        <PasswordInput
                            fullWidth
                            variant="outlined"
                            label="Confirm password"
                            value={confirmPassword}
                            onChange={event => setConfirmPassword(event.target.value)}
                            size="small"
                            error={(!confirmPassword || confirmPassword !== password) && error}
                            helperText={(!confirmPassword || confirmPassword !== password) && error && <ErrorLine>{(confirmPassword !== password ? "Passwords don't match" : "This field cannot be empty")}</ErrorLine>}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Full name" description="Please type in the name and surname of the new user.">
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Full name"
                            value={fullName}
                            onChange={event => setFullName(event.target.value)}
                            size="small"
                            error={!fullName && error}
                            helperText={!fullName && error && <ErrorLine>Full name cannot be empty</ErrorLine>}
                        />
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Roles in the system"/>
                <TuiFormGroupContent>
                <TuiFormGroupField>
                    <FormControlLabel style={{marginLeft: 10}} control={<Checkbox size="medium" checked={admin} onChange={() => setAdmin(!admin)}/>} label="Admin"/>
                    <FormControlLabel style={{marginLeft: 10}} control={<Checkbox size="medium" checked={marketer} onChange={()=> setMarketer(!marketer)}/>} label="Marketer"/>
                    <FormControlLabel style={{marginLeft: 10}} control={<Checkbox size="medium" checked={developer} onChange={() => setDeveloper(!developer)}/>} label="Developer"/>
                    <FormControlLabel style={{marginLeft: 10}} control={<Checkbox size="medium" checked={dataAdmin} onChange={() => setDataAdmin(!dataAdmin)}/>} label="Maintainer"/>
                </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Activate user account" description="User account can be turned off with this switch. The account information will not be erased."/>
                <TuiFormGroupContent>
                <TuiFormGroupField>
                    <FormControlLabel style={{padding: 10, marginLeft: 10}} control={<Switch size="medium" checked={enabled} onChange={() => setEnabled(enabled)}/>} label="Activate user account"/>
                </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <Button label="Save" onClick={handleSave} progress={loading} style={{justifyContent: "center"}} error={error || errorMessage}/>
        </TuiForm>
    );
}
