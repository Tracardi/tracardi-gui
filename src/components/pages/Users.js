import React from "react";
import FormDrawer from "../elements/drawers/FormDrawer";
import {AiOutlineUserAdd} from "react-icons/ai";
import FilterAddForm from "../elements/forms/inputs/FilterAddForm";
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
import {isEmptyObjectOrNull} from "../../misc/typeChecking";
import NoData from "../elements/misc/NoData";

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
                    description={user?.roles && Array.isArray(user?.roles) && user?.roles.map(role => role.charAt(0).toUpperCase() + role.slice(1)).join(", ")}
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

    const Content = () => {
        if (loading) {
            return <div style={{height: 300}}><CenteredCircularProgress/></div>
        }

        if (isEmptyObjectOrNull(users) || (Array.isArray(users) && users.length === 0)) {
            return <NoData header="There is no data here.">
                <p>Please click create button in the upper right corner.</p>
            </NoData>
        }

        return <TuiForm style={{margin: 20}}>

            <TuiFormGroup fitHeight={true}>
                <TuiFormGroupHeader header="Users" description="List of users registered in the system. Active user accounts have a green dash."/>
                <TuiFormGroupContent>
                    <TuiFormGroupField>

                        {errorMessage && <div style={{margin: 25}}><ErrorsBox errorList={errorMessage}/></div>}
                        {!errorMessage && <UserCards refresh={refresh} setUserToEdit={setUserToEdit} users={users}
                                                     onDelete={() => setRefresh(refresh + 1)}/>}
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
    }


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

            <Content/>

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