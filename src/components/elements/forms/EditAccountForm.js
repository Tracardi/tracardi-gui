import React from "react";
import { TuiForm, TuiFormGroup, TuiFormGroupField, TuiFormGroupHeader, TuiFormGroupContent } from "../tui/TuiForm";
import { TextField } from "@mui/material";
import { getError } from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import Button from "./Button";
import PasswordInput from "./inputs/PasswordInput";
import {useRequest} from "../../../remote_api/requestClient";

export default function EditAccountForm ({ user, closeForm, forceRefresh }) {

    const [userToSend, setUserToSend] = React.useState({...user, password: ""});
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [errors, setErrors] = React.useState(null);
    const [error, setError] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const mounted = React.useRef(false);
    const {request} = useRequest()

    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, []);

    const handleSave = async () => {
        if (confirmPassword === userToSend.password) {
            setLoading(true);
            setErrors(null);
            setError(false);
            try {
                await request({
                    url: "/user-account",
                    method: "POST",
                    data: {
                        password: userToSend.password || user.password,
                        name: userToSend.name
                    }
                })
                closeForm();
                forceRefresh();
            }
            catch (e) {
                if (mounted.current) setErrors(getError(e));
            }
            if (mounted.current) setLoading(false);
        }
        else if (mounted.current) { setError(true) }
    }

    return (
        <TuiForm style={{margin: 20}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Edit account" 
                    description="Here you can edit some of your account data. If you want to edit data that is not present below, please contact Tracardi admin."
                />
                {errors && <ErrorsBox errorList={errors}/>}
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Full name" description="Here you can edit your full name.">
                        <TextField 
                            fullWidth
                            variant="outlined"
                            label="Full name"
                            value={userToSend.name}
                            onChange={event => setUserToSend({...userToSend, name: event.target.value})}
                            size="small"
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Password" description="Here you can edit your password.">
                        <PasswordInput 
                            fullWidth
                            variant="outlined"
                            label="Password"
                            value={userToSend.password}
                            onChange={event => setUserToSend({...userToSend, password: event.target.value})}
                            size="small"
                            error={error && userToSend.password !== confirmPassword}
                            helperText={error && userToSend.password !== confirmPassword && <p style={{color: "#ff1744", margin: 0}}>Given passwords do not match</p>}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Confirm password" description="Please type in the password one more time.">
                        <PasswordInput 
                            fullWidth
                            variant="outlined"
                            label="Confirm password"
                            value={confirmPassword}
                            onChange={event => setConfirmPassword(event.target.value)}
                            size="small"
                            error={error && userToSend.password !== confirmPassword}
                            helperText={error && userToSend.password !== confirmPassword && <p style={{color: "#ff1744", margin: 0}}>Given passwords do not match</p>}
                        />
                    </TuiFormGroupField>
                </TuiFormGroupContent>
                <Button label="SAVE" style={{display: "flex", alignItems: "center", justifyContent: "center"}} error={errors || error} onClick={handleSave} progress={loading}/>
            </TuiFormGroup>
        </TuiForm>
    );
}
