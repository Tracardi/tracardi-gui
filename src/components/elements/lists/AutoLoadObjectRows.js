import { connect, useDispatch } from "react-redux";
import { increasePage } from "../../../redux/reducers/pagingSlice";
import {ObjectRow} from "./rows/ObjectRow";
import React from "react";

const AutoLoadObjectRows = ({ timeField, timeFieldWidth, filterFields, onDetails, onDetailsRequest, paging, rows }) => {
  const dispatch = useDispatch();
  const { shown, total, refreshOn } = paging;

  const buildRows = (rows) => {
    if (Array.isArray(rows)) {
      return rows.map((row, index) => {
        return (
          <ObjectRow
            key={index}
            row={row}
            timeField={timeField}
            timeFieldWidth={timeFieldWidth}
            filterFields={filterFields}
            onClick={() => {
              onDetails(row.id);
            }}
            displayDetailButton={typeof onDetailsRequest !== "undefined"}
          />
        );
      });
    }
  };

  const handleScroll = ({ target }) => {
    const bottom = target.scrollHeight - Math.ceil(target.scrollTop) - 1 <= target.clientHeight;

    if (bottom && shown < total && !refreshOn) {
      dispatch(increasePage());
    }
  };

  return (
    <div className="DataContent" onScroll={handleScroll}>
      {buildRows(rows)}
    </div>
  );
};

const mapState = (state) => {
  return {
    paging: state.pagingReducer,
  };
};

export default connect(mapState)(AutoLoadObjectRows);
