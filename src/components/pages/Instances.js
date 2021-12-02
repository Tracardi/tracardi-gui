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

const Instances = () => {

    const dispatch = useDispatch();

    const onLoadRequest = {
        url: `/instances`,
        method: "GET"
    }

    useEffect(() => {
        dispatch(resetPage());
    }, [dispatch])

    return <TuiForm style={{margin: 20, width: "calc(100% - 40px)", height: "calc(100% - 40px)"}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Running instances of Tracardi" description="List of running workers of tracardi API."/>
            <TuiFormGroupContent>
                <TuiFormGroupField>
                    <div style={{overflow: "auto", height: "inherit"}}>
                        <AutoLoadObjectList
                            onLoadRequest={onLoadRequest}
                            label="INSTANCES"
                            timeField={(row) => [row.timestamp]}
                            timeFieldLabel="Timestamp"
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

export default connect(mapState)(Instances);
