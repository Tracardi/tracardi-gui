import { Checkbox, FormControlLabel, Switch, TextField, Box, Typography, IconButton, Button as MuiButton} from "@mui/material";
import React from "react";
import FormDrawer from "../elements/drawers/FormDrawer";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../elements/tui/TuiForm";
import Button from "../elements/forms/Button";
import { AiOutlineUserAdd } from "react-icons/ai";
import FilterAddForm from "../elements/forms/inputs/FilterAddForm";
import { FaUserAlt, FaRegEdit } from "react-icons/fa";
import { MdOutlineDelete } from "react-icons/md";
import { CgClose } from "react-icons/cg";
import { RiCloseCircleLine } from "react-icons/ri";
import { asyncRemote } from "../../remote_api/entrypoint";
import { v4 as uuid4 } from "uuid";

function NewUserForm({ refresh, setRefresh, closeForm }) {

    const [username, setUsername] = React.useState("");
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
    const mounted = React.useRef(false);

    const handleSave = async () => {
        if (username && password && confirmPassword === password && fullName && email) {
            setError(false);
            setLoading(true);
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
                        username: username,
                        roles: rolesToSend,
                        disabled: !enabled,
                        full_name: fullName,
                        email: email
                    }
                })
                if (mounted.current) closeForm();
                await asyncRemote({
                    url: "/user/refresh",
                    method: "GET"
                })
                setRefresh(refresh + 1);
            }
            catch (error) {
                console.log(error) // TODO ERROR HANDLING
            }
            setLoading(false);
        }
        else setError(true);
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
                    <TuiFormGroupField header="Username" description="The username of the new user. This will be used for logging in.">
                        <TextField 
                            fullWidth
                            variant="outlined"
                            label="Username"
                            value={username}
                            onChange={event => setUsername(event.target.value)}
                            size="small"
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
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Email" description="Please type in the email address of the new user.">
                        <TextField 
                            fullWidth
                            variant="outlined"
                            label="Email"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            size="small"
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
    const mounted = React.useRef(false);

    const handleSave = async () => {
        if (password === confirmPassword && fullName && email) {
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
                await asyncRemote({
                    url: "/user/refresh",
                    method: "GET"
                })
            }
            catch (error) {
                console.log(error); // TODO ERROR HANDLING
            }
            if (mounted.current) setLoading(false);
        }
        else {
            setError(true);
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
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Email" description="You can edit the email of this user.">
                        <TextField 
                            fullWidth
                            variant="outlined"
                            label="Email"
                            value={email}
                            onChange={event => setEmail(event.target.value)}
                            size="small"
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


function UserCards({ users, setUserToEdit, setUserToDelete }) {

    return (
        <div style={{ margin: 15, display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
            {users.map( user =>  <UserCard 
                                    key={user.username} 
                                    fullName={user.fullName} 
                                    email={user.email} 
                                    roles={user.roles.map(role => role.charAt(0).toUpperCase() + role.slice(1)).join(", ")} 
                                    enabled={!user.disabled} 
                                    setUserToEdit={() => setUserToEdit(user)}
                                    setUserToDelete={() => setUserToDelete(user)}
                                    /> )}
        </div>
    );
}

function UserDeleteForm({ userToDelete, clearUserToDelete, refresh, setRefresh }) {

    const [deleting, setDeleting] = React.useState(false);
    const deleteFormMounted = React.useRef(false);

    const deleteUser = async () => {
        setDeleting(true);
        try {
            await asyncRemote({
                url: `/user/${userToDelete.id}`,
                method: "DELETE"
            })
            await asyncRemote({
                url: "/user/refresh",
                method: "GET"
            })
        }
        catch (error) {
            console.log(error); // TODO ERROR HANDLING
        } 
        if (deleteFormMounted.current) setDeleting(false);
        clearUserToDelete();
        setRefresh(refresh + 1);
    }

    React.useEffect(() => {
        deleteFormMounted.current = true;
        return () => deleteFormMounted.current = false;
    }, [])

    return (
        <Box style={{ position: "absolute", top: 0, left: 0, background: "rgba(0 , 0, 0, 50%)", width: "100vw", height: "100vh", zIndex: 1 }}>
            <Box 
                style={{ 
                    position: "absolute", 
                    bottom: "50vh", 
                    right: "50vw", 
                    background: "#ffffff", 
                    width: 700, 
                    height: 200, 
                    transform: "translate(50%, 0%)",
                    borderRadius: 15
                }}
            >
                <IconButton style={{ position: "absolute", right: 0, marginLeft: 10, marginBottom: 10 }} onClick={clearUserToDelete}>
                    <CgClose />
                </IconButton>
                <Typography variant="h6" fontSize={24} style={{ margin: 20, color: "#444444" }}>{`Do you really want to delete user ${userToDelete.fullName}?`}</Typography>
                <Typography variant="h6" fontSize={18} style={{ marginLeft: 22, color: "#555555" }}>This action cannot be undone.</Typography>
                <Box style={{position: "absolute", bottom: 10, right: 10, display: "flex", gap: 5}}>
                    <Button variant="outlined" size="large" onClick={clearUserToDelete} label="Cancel" icon={<RiCloseCircleLine size={20}/>}></Button>
                    <Button variant="outlined" size="large" onClick={deleteUser} label="OK" progess={deleting}></Button>
                </Box>
            </Box>
        </Box>
    );
}

export default function Users() {

    const [newUserFormOpened, setNewUserFormOpened] = React.useState(false);
    const [userToEdit, setUserToEdit] = React.useState(null);
    const [refresh, setRefresh] = React.useState(0);
    const [filter, setFilter] = React.useState("");
    const [userToDelete, setUserToDelete] = React.useState(null);
    const [users, setUsers] = React.useState([]);

    React.useEffect(() => {
        asyncRemote(
            {
                url: filter ? `/users/0/100?query=${filter}` : "users/0/100",
                method: "GET"
            }
        ).then(response => setUsers(response.data.map(user => { return {...user, fullName: user.full_name} })))
        .catch(error => console.log(error)) // TODO ERROR HANDLING
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
            <UserCards refresh={refresh} setUserToEdit={setUserToEdit} setUserToDelete={setUserToDelete} users={users}/>
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
            {userToDelete !== null && <UserDeleteForm userToDelete={userToDelete} clearUserToDelete={() => setUserToDelete(null)} refresh={refresh} setRefresh={setRefresh}/>}
        </div>
    );

}