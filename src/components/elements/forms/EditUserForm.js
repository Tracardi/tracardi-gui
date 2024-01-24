import React from "react";
import {getError} from "../../../remote_api/entrypoint";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import ErrorsBox from "../../errors/ErrorsBox";
import {Checkbox, FormControlLabel, Switch, TextField} from "@mui/material";
import Button from "./Button";
import ErrorLine from "../../errors/ErrorLine";
import {useRequest} from "../../../remote_api/requestClient";
import {useFetch} from "../../../remote_api/remoteState";
import {getUser} from "../../../remote_api/endpoints/user";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

export default function EditUserForm({ id, onSubmit}) {

    const [user, setUser] = React.useState(null);
    const [roles, setRoles] = React.useState([]);

    const {isLoading} = useFetch(
        ['systemUser'],
        getUser(id),
        data => {
            setUser(data)
            setRoles(data?.roles ? data.roles.split(',') : [])
        }
    )

    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);

    const mounted = React.useRef(false);
    const {request} = useRequest()

    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])

    const handleSave = async () => {
        if (password === confirmPassword && user?.full_name && user?.email) {
            setErrorMessage(null);
            setLoading(true);
            setError(false);
            try {
                await request({
                    url: `/user/${user.id}`,
                    method: "POST",
                    data: {
                        password: password || user.password,
                        full_name: user?.full_name,
                        email: user?.email,
                        roles: roles,
                        enabled: user?.enabled,
                    }
                })

                if(onSubmit) {
                    onSubmit();
                }

            }
            catch (error) {
                if (mounted.current) {
                    setError(true);
                    setErrorMessage(getError(error));
                }
            }
            if (mounted.current) setLoading(false);
        }
        else {
            if (mounted.current) setError(true);
        }
    }

    const handleUserChange = (field, value) => {
        setUser({...user, [field]: value})
    }

    const handleUserRoleChange = (role, flag) => {
        if(flag) {
            setRoles(roles.concat(role))
        } else {
            setRoles(roles.filter(item => item !== role))
        }

    }

    if (isLoading) {
        return <CenteredCircularProgress/>
    }

    return (
        <TuiForm style={{ padding: 20 }}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Edit user" description="Here you can edit selected user."/>
                {errorMessage && <ErrorsBox errorList={errorMessage}/>}
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Edit password" description="Type new user password.">
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="New password"
                            value={password || ""}
                            onChange={event => setPassword(event.target.value)}
                            size="small"
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Confirm new password" description="Please retype the new password .">
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Confirm new password"
                            value={confirmPassword}
                            onChange={event => setConfirmPassword(event.target.value)}
                            size="small"
                            error={password !== confirmPassword && error}
                            helperText={password !== confirmPassword && error && <ErrorLine>Passwords don't match</ErrorLine>}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Full name" description="User's name and surname.">
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Full name"
                            value={user?.full_name || ""}
                            onChange={event => handleUserChange('full_name', event.target.value)}
                            size="small"
                            error={!user?.full_name && error}
                            helperText={!user?.full_name && error && <ErrorLine>Full name cannot be empty</ErrorLine>}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="E-mail">
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="E-mail"
                            value={user?.email || ""}
                            onChange={event => handleUserChange('email', event.target.value)}
                            size="small"
                            error={!user?.email && error}
                            helperText={!user?.email && error && <ErrorLine>E-mail address cannot be empty</ErrorLine>}
                        />
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Roles in the system"/>
                <TuiFormGroupContent>

                    <TuiFormGroupField>
                        <FormControlLabel style={{marginLeft: 10}}
                                          control={<Checkbox size="medium" checked={roles?.includes("admin")}
                                                             onChange={e => handleUserRoleChange('admin', e.target.checked)}/>}
                                          label="Admin"/>
                        <FormControlLabel style={{marginLeft: 10}}
                                          control={<Checkbox size="medium" checked={roles?.includes("marketer")}
                                                             onChange={e => handleUserRoleChange('marketer', e.target.checked)}/>}
                                          label="Marketer"/>
                        <FormControlLabel style={{marginLeft: 10}}
                                          control={<Checkbox size="medium" checked={roles?.includes("developer")}
                                                             onChange={e => handleUserRoleChange('developer', e.target.checked)}/>}
                                          label="Developer"/>
                        <FormControlLabel style={{marginLeft: 10}}
                                          control={<Checkbox size="medium"
                                                             checked={roles?.includes("maintainer")}
                                                             onChange={e => handleUserRoleChange('maintainer', e.target.checked)}/>}
                                          label="Maintainer"/>
                    </TuiFormGroupField>
                </TuiFormGroupContent>

            </TuiFormGroup>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Active user account" description="User account can be turned off with this switch."/>
                <TuiFormGroupContent>
                    <TuiFormGroupField>
                        <FormControlLabel style={{padding: 10, marginLeft: 10}}
                                          control={<Switch size="medium"
                                                           checked={user?.enabled}
                                                           onChange={e=>handleUserChange('enabled', e.target.checked)}/>}
                                          label="Activate user account"/>
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <Button label="Save" onClick={handleSave} progress={loading} style={{justifyContent: "center"}} error={error}/>
        </TuiForm>
    );
}