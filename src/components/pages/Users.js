import {Box, Typography, IconButton} from "@mui/material";
import React from "react";
import FormDrawer from "../elements/drawers/FormDrawer";
import {AiOutlineUserAdd} from "react-icons/ai";
import FilterAddForm from "../elements/forms/inputs/FilterAddForm";
import {FaUserAlt, FaRegEdit} from "react-icons/fa";
import {MdOutlineDelete} from "react-icons/md";
import {asyncRemote, getError} from "../../remote_api/entrypoint";
import ErrorsBox from "../errors/ErrorsBox";
import {useConfirm} from "material-ui-confirm";
import NewUserForm from "../elements/forms/NewUserForm";
import EditUserForm from "../elements/forms/EditUserForm";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupContent,
    TuiFormGroupField,
    TuiFormGroupHeader
} from "../elements/tui/TuiForm";
import {BsPersonCircle} from "react-icons/bs";
import AdvancedSquareCard from "../elements/lists/cards/AdvancedSquareCard";

function UserCards({users, setUserToEdit, onDelete}) {

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
        <div style={{margin: 15, display: "flex", flexDirection: "row", flexWrap: "wrap"}}>
            {users.map(user =>
                    <AdvancedSquareCard
                        key={user.email}
                        id={user.email}
                        status={!user.disabled}
                        name={user.fullName}
                        description={user.roles.map(role => role.charAt(0).toUpperCase() + role.slice(1)).join(", ")}
                        onClick={() => setUserToEdit(user)}
                        onEdit={() => setUserToEdit(user)}
                        onDelete={() => handleUserDelete(user)}
                        icon={<BsPersonCircle size={40}/>}
                    />
            )}
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
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        let isSubscribed = true
        setLoading(true)
        asyncRemote(
            {
                url: filter ? `/users/0/100?query=${filter}` : "users/0/100",
                method: "GET"
            }
        ).then(response => {
            if (isSubscribed) {
                setUsers(
                    response.data.map(user => {
                        return {...user, fullName: user.full_name}
                    }))
            }
        }).catch(error => {
            if (isSubscribed) setErrorMessage(getError(error))
        }).finally(() => {
            if (isSubscribed) setLoading(false);
        })
        return () => {
            isSubscribed = false;
        }
    }, [refresh, filter])

    return (
        <>
            <FilterAddForm
                style={{margin: 20, marginTop: 0}}
                buttonLabel="New user"
                buttonIcon={<AiOutlineUserAdd size={20} style={{marginRight: 10, marginLeft: 36}}/>}
                onFilter={filter => setFilter(filter)}
                onAdd={() => setNewUserFormOpened(true)}
                textFieldLabel="Type here to filter by user's full name"
            />
            {loading && <CenteredCircularProgress/>}
            {!loading && <TuiForm style={{margin: 20}}>
                <TuiFormGroup fitHeight={true}>
                    <TuiFormGroupHeader header="Users" description="List of users registered in the system."/>
                    <TuiFormGroupContent>
                        <TuiFormGroupField>

                            {errorMessage && <div style={{margin: 25}}><ErrorsBox errorList={errorMessage}/></div>}
                            {!errorMessage && <UserCards refresh={refresh} setUserToEdit={setUserToEdit} users={users}
                                                         onDelete={() => setRefresh(refresh + 1)}/>}
                        </TuiFormGroupField>
                    </TuiFormGroupContent>
                </TuiFormGroup>
            </TuiForm>}
            <FormDrawer
                open={newUserFormOpened}
                width={600}
                onClose={() => setNewUserFormOpened(false)}
            >
                <NewUserForm
                    onSubmit={() => {
                        setRefresh(refresh + 1);
                        setNewUserFormOpened(false);
                    }}
                />
            </FormDrawer>
            <FormDrawer
                open={userToEdit !== null}
                width={600}
                onClose={() => setUserToEdit(null)}
            >
                {userToEdit !== null && <EditUserForm onSubmit={() => {
                    setRefresh(refresh + 1);
                    setUserToEdit(null);
                }} user={userToEdit}/>}
            </FormDrawer>
        </>
    );

}