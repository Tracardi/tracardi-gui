import React, { useEffect } from "react";
import AutoLoadObjectList from "../elements/lists/AutoLoadObjectList";
import { connect, useDispatch } from "react-redux";
import { resetPage } from "../../redux/reducers/pagingSlice";

const Instances = () => {

  const dispatch = useDispatch();

  const onLoadRequest = {
    url: `/instances`,
    method: "GET",
    data: {}
  }

  useEffect(() => {
    dispatch(resetPage());
  }, [])

    return (
      <AutoLoadObjectList
        onLoadRequest={onLoadRequest}
        label="INSTANCES"
        timeField={(row) => [row.timestamp]}
        timeFieldLabel="Timestamp"
      />
    );
}

const mapState = state => {
  return {
    paging: state.pagingReducer
  }
}

export default connect(mapState)(Instances);
