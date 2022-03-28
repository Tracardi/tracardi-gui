import React from "react";
import { isEmptyObjectOrNull } from "../../misc/typeChecking";
import { TuiForm, TuiFormGroup, TuiFormGroupField, TuiFormGroupHeader, TuiFormGroupContent } from "../elements/tui/TuiForm";
import { CircularProgress, TextField } from "@mui/material";
import { asyncRemote } from "../../remote_api/entrypoint";
import { getError } from "../../remote_api/entrypoint";
import ErrorsBox from "../errors/ErrorsBox";
import { BsPersonCircle } from "react-icons/bs";
import { FiEdit3 } from "react-icons/fi";
import { Box } from "@mui/material";
import { AiOutlinePoweroff } from "react-icons/ai";
import Button from "../elements/forms/Button";
import {useHistory} from "react-router-dom";
import urlPrefix from "../../misc/UrlPrefix";
import FormDrawer from "../elements/drawers/FormDrawer";
import PasswordInput from "../elements/forms/inputs/PasswordInput";


function UserSelfEditForm ({ user, closeForm, forceRefresh }) {

    const [userToSend, setUserToSend] = React.useState({...user, password: ""});
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [errors, setErrors] = React.useState(null);
    const [error, setError] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const mounted = React.useRef(false);

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
                await asyncRemote({
                    url: "/user-account",
                    method: "POST",
                    data: {
                        password: userToSend.password || user.password,
                        full_name: userToSend.full_name
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
                            value={userToSend.full_name}
                            onChange={event => setUserToSend({...userToSend, full_name: event.target.value})}
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


export default function UserSelfInspect () {

    const mounted = React.useRef(false);
    const [user, setUser] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [edit, setEdit] = React.useState(false);
    const [refresh, setRefresh] = React.useState(0);
    const history = useHistory();
    
    const go = (url) => {
        return () => history.push(urlPrefix(url));
    }

    React.useEffect(() => {

        mounted.current = true;
        if (mounted.current) setError(null);

        asyncRemote({
            url: "/user-account",
            method: "GET"
        })
        .then(response => {
            if (mounted.current) setUser(response.data);
        })
        .catch(e => { 
            if (mounted.current) setError(getError(e));
        })

        return () => mounted.current = false;
    }, [refresh])

    if (isEmptyObjectOrNull(user) && error === null) {
        return <CircularProgress 
                sx={{
                    position: "absolute",
                    top: "calc(50% - 40px)",
                    left: "calc(50% + 40px)",
                }}
            />;
    }

    if (error !== null) {
        return <ErrorsBox errorList={error} />;
    }

    return (
        <>
            <TuiForm style={{margin: 20}}>
                <TuiFormGroup>
                    <TuiFormGroupHeader header={`Hello ${user.full_name}`} description="Here you can see and edit your account."/>
                    <TuiFormGroupField style={{margin: 20}}>
                        <div style={{display: "flex", flexDirection: "column" }}>
                            <div style={{
                                    display: "flex",
                                    alignSelf: "flex-start",
                                    flexDirection: "row",
                                    margin: 50,
                                    gap: 30,
                                    alignItems: "flex-start"
                                }}
                            >
                                <div>
                                    <BsPersonCircle color="#444" size={100} />
                                    <Box sx={{backgroundColor: user?.disabled ? "#d81b60" : "#00c853", height: 10, width: 100}}/>
                                </div>
                                <div>
                                    <p style={{
                                            fontSize: "40px",
                                            margin: 0,
                                            fontWeight: 400,
                                            color: "#444",
                                            textTransform: "none"
                                        }}
                                    >
                                        {user.full_name}
                                    </p>
                                    <h3 style={{margin: 0, marginTop: 20}}>Roles</h3>
                                    <div>{user?.roles && Array.isArray(user?.roles) && user?.roles.map(role => role.charAt(0).toUpperCase() + role.slice(1)).join(", ")}</div>
                                    <h3 style={{margin: 0, marginTop: 20}}>Email address</h3>
                                    <div>{user?.email}</div>
                                </div>
                            </div>
                            <div style={{display: "flex", alignSelf: "flex-end", flexDirection: "row"}}>
                                <Button label="Edit account" onClick={() => setEdit(true)} icon={<FiEdit3 size={20}/>}/>
                                <Button icon={<AiOutlinePoweroff size={20} />} label="Logout" onClick={go("/logout")}/>                            
                            </div>
                        </div>
                    </TuiFormGroupField>
                </TuiFormGroup>
            </TuiForm>
            <FormDrawer
                open={edit}
                width={600}
                onClose={() => setEdit(false)}
            >
                {edit && <UserSelfEditForm user={user} closeForm={() => setEdit(false)} forceRefresh={() => setRefresh(refresh + 1)}/>}
            </FormDrawer>
        </>
    );
}