import { Checkbox, FormControlLabel, Switch, TextField, Box, Typography, IconButton } from "@mui/material";
import React from "react";
import FormDrawer from "../elements/drawers/FormDrawer";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../elements/tui/TuiForm";
import Button from "../elements/forms/Button";
import { AiOutlineUserAdd } from "react-icons/ai";
import FilterAddForm from "../elements/forms/inputs/FilterAddForm";
import { FaUserAlt, FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { asyncRemote, getError } from "../../remote_api/entrypoint";
import { v4 as uuid4 } from "uuid";
import ErrorsBox from "../errors/ErrorsBox"; 
import { useConfirm } from "material-ui-confirm";


function NewUserForm({ refresh, setRefresh, closeForm }) {

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
                var rolesToSend = [];
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
                if (mounted.current) closeForm();
                setRefresh(refresh + 1);
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
                <TuiFormGroupHeader header="New user" description="Here you can create a new user."></TuiFormGroupHeader>
                <TuiFormGroupContent>
                    <TuiFormGroupField>
                        {errorMessage && <ErrorsBox errorList={errorMessage}/>}
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Email" description="Please type in the email address of the new user.">
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
                    <TuiFormGroupField header="Password" description="The password of the new user. This will be also used for logging in.">
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
                    <TuiFormGroupField header="Confirm password" description="Please type in the password for one more time.">
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

function EditUserForm({ user, refresh, setRefresh, closeForm }) {

    const [password, setPassword] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [fullName, setFullName] = React.useState(user.fullName);
    const [email, setEmail] = React.useState(user.email);
    const [admin, setAdmin] = React.useState(user.roles.includes("admin"));
    const [marketer, setMarketer] = React.useState(user.roles.includes("marketer"));
    const [developer, setDeveloper] = React.useState(user.roles.includes("developer"));
    const [enabled, setEnabled] = React.useState(!user.disabled);
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const mounted = React.useRef(false);

    const handleSave = async () => {
        if (password === confirmPassword && fullName && email) {
            setErrorMessage(null);
            setLoading(true);
            setError(false);
            try {
                var rolesToSend = [];
                if (admin) rolesToSend.push("admin");
                if (marketer) rolesToSend.push("marketer");
                if (developer) rolesToSend.push("developer");

                await asyncRemote({
                    url: `/users/${user.id}/edit`,
                    method: "POST",
                    data: {
                        password: password || user.password,
                        full_name: fullName,
                        email: email,
                        roles: rolesToSend,
                        disabled: !enabled
                    }
                })
                closeForm();
            }
            catch (error) {
                if (mounted.current) setErrorMessage(getError(error));
            }
            if (mounted.current) setLoading(false);
        }
        else {
            if (mounted.current) setError(true);
        }
        setRefresh(refresh + 1);
    }

    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])

    return (
        <TuiForm style={{ padding: 20 }}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Edit user" description="Here you can edit selected user."></TuiFormGroupHeader>
                <TuiFormGroupContent>
                    <TuiFormGroupField>
                        {errorMessage && <ErrorsBox errorList={errorMessage}/>}
                    </TuiFormGroupField>
                    <TuiFormGroupField header="New password" description="You can edit the password of this user.">
                        <TextField 
                            fullWidth
                            variant="outlined"
                            label="New password"
                            value={password}
                            onChange={event => setPassword(event.target.value)}
                            size="small"
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Confirm new password" description="Please type in the password for one more time.">
                        <TextField 
                            fullWidth
                            variant="outlined"
                            label="Confirm new password"
                            value={confirmPassword}
                            onChange={event => setConfirmPassword(event.target.value)}
                            size="small"
                            error={password !== confirmPassword && error}
                            helperText={password !== confirmPassword && error && "Passwords don't match"}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Full name" description="You can edit the full name of this user.">
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
                    <TuiFormGroupField header="Email" description="You can edit the email address of this user.">
                        <TextField 
                            fullWidth
                            variant="outlined"
                            label="Email"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            size="small"
                            error={!email && error}
                            helperText={!email && error && "Email address cannot be empty"}
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
            <Button label="Save" onClick={handleSave} progress={loading} style={{justifyContent: "center"}} error={error}/>
        </TuiForm>
    );
}


function UserCard({ fullName, email, roles, enabled, setUserToEdit, setUserToDelete }) {

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                width: 250,
                height: 250,
                margin: 2,
                borderRadius: 10,
                boxShadow: 3,
                background: "#ffffff"
            }}
        >
            <FaUserAlt color="#dddddd" size={90} style={{marginBottom: 5, marginTop: 30}}/>
            <Box sx={{ height: 5, width: 90, background: enabled ? "#08cc54" : "#e01c64", borderRadius: 2, marginBottom: 0.5 }} />
            <Typography variant="h6" color="#444444">{fullName}</Typography>
            <Typography variant="p" color="#555555" fontSize={12}>{email}</Typography>
            <Typography variant="p" color="#555555" fontSize={13} marginTop={0.5}>{roles || "No roles"}</Typography>
            <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", width: 200 }}>
                <IconButton onClick={() => setUserToEdit()}>
                    <FaRegEdit color="#2074d4"/>
                </IconButton>
                <IconButton onClick={() => setUserToDelete()}>
                    <MdOutlineDelete color="#ff3333"/>
                </IconButton>
            </Box>
        </Box>
    );
}


function UserCards({ users, setUserToEdit, onDelete }) {
    
    const confirm = useConfirm();

    const handleUserDelete = user => {
        confirm({title: `Do you want to delete user ${user.fullName}?`, description: "This action can not be undone."})
            .then(async () => {
                    try {
                        await asyncRemote({
                            url: '/user/' + user.id,
                            method: "delete"
                        })
                        if (onDelete) onDelete();
                    } catch (e) {
                        console.error(e);
                    }
                }
            )
    }

    return (
        <div style={{ margin: 15, display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
            {users.map( user =>  <UserCard 
                                    key={user.email} 
                                    fullName={user.fullName} 
                                    email={user.email} 
                                    roles={user.roles.map(role => role.charAt(0).toUpperCase() + role.slice(1)).join(", ")} 
                                    enabled={!user.disabled} 
                                    setUserToEdit={() => setUserToEdit(user)}
                                    setUserToDelete={() => handleUserDelete(user)}
                                    /> )}
        </div>
    );
}

export default function Users() {

    const [newUserFormOpened, setNewUserFormOpened] = React.useState(false);
    const [userToEdit, setUserToEdit] = React.useState(null);
    const [refresh, setRefresh] = React.useState(0);
    const [filter, setFilter] = React.useState("");
    const [users, setUsers] = React.useState([]);
    const [errorMessage, setErrorMessage] = React.useState(null);
    const mounted = React.useRef(false);

    React.useEffect(() => {
        mounted.current = true;
        asyncRemote(
            {
                url: filter ? `/users/0/100?query=${filter}` : "users/0/100",
                method: "GET"
            }
        ).then(response => setUsers(response.data.map(user => { return {...user, fullName: user.full_name} })))
        .catch(error => { if (mounted.current) setErrorMessage(getError(error)) } )
        return () => {
            mounted.current = false;
        }
    }, [refresh, filter])

    return (
        <div>
            <FilterAddForm 
                style={{ marginLeft: 15, marginRight: 15 }}
                buttonLabel="New user"
                buttonIcon={<AiOutlineUserAdd size={20} style={{marginRight: 10, marginLeft: 36}}/>}
                onFilter={filter => setFilter(filter)}
                onAdd={() => setNewUserFormOpened(true)}
                textFieldLabel="Type here to filter by user's full name"
            />
            { errorMessage ?
                <div style={{ margin: 25 }}><ErrorsBox errorList={errorMessage}/></div>
                    :
                <UserCards refresh={refresh} setUserToEdit={setUserToEdit} users={users} onDelete={() => setRefresh(refresh + 1)}/>
            }
            <FormDrawer
                open={newUserFormOpened}
                width={600}
                onClose={() => setNewUserFormOpened(false)}
            >
                <NewUserForm 
                    refresh={refresh}
                    setRefresh={setRefresh}
                    closeForm={() => setNewUserFormOpened(false)}
                />
            </FormDrawer>
            <FormDrawer
                open={userToEdit !== null}
                width={600}
                onClose={() => setUserToEdit(null)}
            >
                {userToEdit !== null && <EditUserForm refresh={refresh} setRefresh={setRefresh} user={userToEdit} closeForm={() => setUserToEdit(null)}/>}
            </FormDrawer>
        </div>
    );

}