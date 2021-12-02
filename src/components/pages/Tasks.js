import React, {useEffect} from "react";
import AutoLoadObjectList from "../elements/lists/AutoLoadObjectList";
import {connect, useDispatch} from "react-redux";
import {resetPage} from "../../redux/reducers/pagingSlice";
import {
    TuiForm,
    TuiFormGroup,
    TuiFormGroupContent,
    TuiFormGroupField,
    TuiFormGroupHeader
} from "../elements/tui/TuiForm";

const Tasks = () => {

    const dispatch = useDispatch();

    const onLoadRequest = {
        url: `/tasks`,
        method: "GET"
    }

    useEffect(() => {
        dispatch(resetPage());
    }, [dispatch])

    return <TuiForm style={{margin: 20, width: "calc(100% - 40px)"}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Scheduled tasks"
                                description="List of scheduled tasks."/>
            <TuiFormGroupContent>
                <TuiFormGroupField>
                    <div style={{overflow: "auto", height: "inherit"}}>
                        <AutoLoadObjectList
                            onLoadRequest={onLoadRequest}
                            label="TASKS"
                            timeField={(row) => [row.event.type]}
                            timeFieldLabel="event.type"
                        />
                    </div>
                </TuiFormGroupField>
            </TuiFormGroupContent>
        </TuiFormGroup>
    </TuiForm>
}

const mapState = state => {
    return {
        paging: state.pagingReducer
    }
}

export default connect(mapState)(Tasks);
