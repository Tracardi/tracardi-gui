import React from "react";
import { isEmptyObjectOrNull } from "../../misc/typeChecking";
import { TuiForm, TuiFormGroup, TuiFormGroupField, TuiFormGroupHeader, TuiFormGroupContent } from "../elements/tui/TuiForm";
import { CircularProgress, modalUnstyledClasses, TextField } from "@mui/material";
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
import EditAccountForm from "../elements/forms/EditAccountForm";

export default function UserAccount () {

    const [user, setUser] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [edit, setEdit] = React.useState(false);
    const [refresh, setRefresh] = React.useState(0);
    const [logoutProgress, setLogoutProgress] = React.useState(false);
    const [logoutError, setLogoutError] = React.useState(null);
    const mounted = React.useRef(false);
    const history = useHistory();
    
    const go = (url) => {
        return () => history.push(urlPrefix(url));
    }

    async function logout() {
        if (mounted.current) {
            setLogoutError(null);
            setLogoutProgress(true);
        }
        try {
            await asyncRemote({method: "post", url: "/logout"});
            go("/logout")();
        }
        catch (e) {
            if (mounted.current) setLogoutError(getError(e));
        }
        finally {
            if (mounted.current) setLogoutProgress(false);
        }
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
                                <Button icon={<AiOutlinePoweroff size={20}/>} label="Logout" onClick={logout} error={logoutError !== null} progress={logoutProgress}/>
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
                {edit && <EditAccountForm user={user} closeForm={() => setEdit(false)} forceRefresh={() => setRefresh(refresh + 1)}/>}
            </FormDrawer>
            {logoutError && <ErrorsBox errorList={logoutError}/>}
        </>
    );
}