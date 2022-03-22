import React from "react";
import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupContent,
    TuiFormGroupHeader,
    TuiFormGroupField
} from "../elements/tui/TuiForm";
import TuiTagger from "../elements/tui/TuiTagger";
import KeyValueDesc from "../elements/misc/KeyValueDesc";
import {BsXCircle} from "react-icons/bs";
import {FiEdit3} from "react-icons/fi";
import {IconButton} from "@mui/material";
import {asyncRemote, getError} from "../../remote_api/entrypoint";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import ErrorsBox from "../errors/ErrorsBox";
import {useConfirm} from "material-ui-confirm";
import FormDrawer from "../elements/drawers/FormDrawer";
import Button from "../elements/forms/Button";
import TuiTags from "../elements/tui/TuiTags";
import FilterAddForm from "../elements/forms/inputs/FilterAddForm";
import {IoIosAddCircleOutline} from "react-icons/io";
import TuiSelectEventType from "../elements/tui/TuiSelectEventType";
import NoData from "../elements/misc/NoData";


function Actions({tagsObj, handleTagsDelete, handleTagsEdit}) {

    return (
        <div style={{display: "flex", flexDirection: "row", gap: "40px", alignSelf: "flex-start"}}>
            <IconButton onClick={() => handleTagsEdit(tagsObj)}>
                <FiEdit3 size={25} style={{color: "#1976d2"}}/>
            </IconButton>
            <IconButton onClick={() => handleTagsDelete(tagsObj)}>
                <BsXCircle size={25} style={{color: "crimson"}}/>
            </IconButton>
        </div>
    );
}

function EditTagsForm({tagsObj, forceRefresh, closeForm}) {

    const [tagsToSend, setTagsToSend] = React.useState(tagsObj.tags);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const mounted = React.useRef(false);

    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])

    const handleSave = async () => {
        try {
            if (mounted.current) setError(null);
            if (mounted.current) setLoading(true);
            await asyncRemote({
                url: "/event/tag/replace",
                method: "POST",
                data: {...tagsObj, tags: tagsToSend}
            });
            forceRefresh();
            closeForm();
        } catch (e) {
            if (mounted.current) setError(e);
        } finally {
            if (mounted.current) setLoading(false);
        }
    }

    return (
        <TuiForm style={{margin: "20px"}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Edit tags"
                                    description={`Here you can edit tags for event type '${tagsObj.type}'.`}/>
                <TuiFormGroupContent>
                    {error && <ErrorsBox errorList={getError(error)}/>}
                    <TuiFormGroupField header="Tags" description="These are the tags for your selected event type.">
                        <TuiTagger
                            label="Tags"
                            tags={tagsObj.tags}
                            onChange={value => setTagsToSend(value)}
                        />
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <Button label="SAVE" style={{justifyContent: "center"}} error={error} progress={loading}
                    onClick={handleSave}/>
        </TuiForm>
    );
}

function NewTagsForm({closeForm, forceRefresh}) {

    const [objToSend, setObjToSend] = React.useState({type: null, tags: []});
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [errorMessage, setErrorMessage] = React.useState("");
    const mounted = React.useRef(false);

    React.useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    }, [])

    const handleSave = async () => {
        try {
            if (mounted.current) setError(null);
            if (mounted.current) setLoading(true);
            if (mounted.current) setErrorMessage("");
            if (objToSend.type) {
                await asyncRemote({
                    url: "/event/tag/add",
                    method: "POST",
                    data: {...objToSend, type: objToSend.type.id}
                });
                forceRefresh();
                closeForm();
            } else if (mounted.current) setErrorMessage("Event type cannot be empty.");
        } catch (e) {
            if (mounted.current) setError(e);
        } finally {
            if (mounted.current) setLoading(false);
        }
    }

    return (
        <TuiForm style={{margin: "20px"}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Add new tags"
                                    description="Here you can add new tags to selected event type."/>
                <TuiFormGroupContent>
                    {error && <ErrorsBox errorList={getError(error)}/>}
                    <TuiFormGroupField header="Event type" description="Select event type to be tagged.">
                        <TuiSelectEventType
                            onSetValue={value => setObjToSend({...objToSend, type: value})}
                            errorMessage={errorMessage}
                            value={objToSend.type}
                        />
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Tags" description="These are the tags for your selected event type.">
                        <TuiTagger
                            label="Tags"
                            tags={objToSend.tags}
                            onChange={value => setObjToSend({...objToSend, tags: value})}
                        />
                    </TuiFormGroupField>
                </TuiFormGroupContent>
            </TuiFormGroup>
            <Button label="SAVE" style={{justifyContent: "center"}} error={error} progress={loading}
                    onClick={handleSave}/>
        </TuiForm>
    );
}

export default function EventTags() {

    const confirm = useConfirm();
    const [refresh, setRefresh] = React.useState(0);
    const [loading, setLoading] = React.useState(true);
    const [tags, setTags] = React.useState([]);
    const [error, setError] = React.useState(null);
    const [tagsToEdit, setTagsToEdit] = React.useState(null);
    const [newTagsFormOpened, setNewTagsFormOpened] = React.useState(false);
    const [filter, setFilter] = React.useState("");

    React.useEffect(() => {
        let isSubscribed = true;
        setLoading(true);
        asyncRemote({
            url: `/event/tag/get${filter ? `?query=${filter}` : ""}`,
            method: "GET"
        })
            .catch(error => {
                if (error && isSubscribed) setError(error)
            })
            .then(response => {
                if (response && isSubscribed) {
                    setTags(response.data);
                }
            }).finally(() => {
                if (isSubscribed) setLoading(false);
            })
        return () => isSubscribed = false
    }, [refresh, filter])


    const handleTagsDelete = tagsObj => {
        confirm({
            title: `Do you want to delete all tags for event type ${tagsObj.type}?`,
            description: "This action can not be undone."
        })
            .then(async () => {
                    try {
                        setLoading(true);
                        await asyncRemote({
                            url: `/event/tag/delete/${tagsObj.id}`,
                            method: "DELETE"
                        });
                        setRefresh(refresh + 1);
                    } catch (e) {
                        console.error(e);
                    } finally {
                        setLoading(false);
                    }
                }
            )
    };

    const handleTagsEdit = async tagsObj => {
        setTagsToEdit(tagsObj);
    }

    return (
        <div>
            <FilterAddForm
                style={{
                    marginLeft: "20px"
                }}
                textFieldLabel="Type here to filter tags by event type"
                buttonLabel="New tags"
                buttonIcon={<IoIosAddCircleOutline size={23} style={{marginRight: "10px", marginLeft: "20px"}}/>}
                onAdd={() => setNewTagsFormOpened(true)}
                onFilter={filter => setFilter(filter)}
            />
            {tags.length === 0 &&
            <NoData header="There is no data here."><p>Please click New Tags button in the upper right corner.</p>
            </NoData>}
            {tags.length !== 0 && <TuiForm style={{margin: 20}}>
                <TuiFormGroup>
                    <TuiFormGroupHeader header="Event tags"
                                        description="Here you can see configuration of tagging incoming events."/>
                    <TuiFormGroupContent>
                        {
                            loading ?
                                <div style={{height: 300}}><CenteredCircularProgress/></div>
                                :
                                tags.map(
                                    (tagsObj, index) => <KeyValueDesc
                                        key={index}
                                        label={tagsObj.type}
                                        description={<TuiTags tags={tagsObj.tags}/>}
                                        value={
                                            <Actions
                                                tagsObj={tagsObj}
                                                handleTagsDelete={handleTagsDelete}
                                                handleTagsEdit={handleTagsEdit}
                                            />
                                        }
                                    />
                                )
                        }
                        {error && <ErrorsBox errorList={getError(error)}/>}
                    </TuiFormGroupContent>
                </TuiFormGroup>
            </TuiForm>}
            <FormDrawer
                width={600}
                onClose={() => setTagsToEdit(null)}
                open={tagsToEdit !== null}
            >
                <EditTagsForm tagsObj={tagsToEdit} forceRefresh={() => setRefresh(refresh + 1)}
                              closeForm={() => setTagsToEdit(null)}/>
            </FormDrawer>
            <FormDrawer
                width={600}
                onClose={() => setNewTagsFormOpened(false)}
                open={newTagsFormOpened}
            >
                <NewTagsForm forceRefresh={() => setRefresh(refresh + 1)}
                             closeForm={() => setNewTagsFormOpened(false)}/>
            </FormDrawer>
        </div>
    );
}