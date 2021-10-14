import React, { useEffect } from "react";
import AutoLoadObjectList from "../elements/lists/AutoLoadObjectList";
import { connect, useDispatch } from "react-redux";
import { resetPage } from "../../redux/reducers/pagingSlice";

const Tasks = () => {

    const dispatch = useDispatch();

    const onLoadRequest = {
        url: `/tasks`,
        method: "GET"
    }

    useEffect(() => {
        dispatch(resetPage());
    }, [dispatch])

    return <div style={{overflow: "auto", height: "inherit"}}>
        <AutoLoadObjectList
            onLoadRequest={onLoadRequest}
            label="TASKS"
            timeField={(row) => [row.event.type]}
            timeFieldLabel="event.type"
        />
    </div>
}

const mapState = state => {
    return {
        paging: state.pagingReducer
    }
}

export default connect(mapState)(Tasks);
