import ObjectRow from "./rows/ObjectRow";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import { useEffect, useRef, useState } from "react";

const AutoLoadObjectList = ({
  data,
  allRows,
  loading,
  errors,
  label,
  timeField,
  timeFieldLabel,
  timeFieldWidth,
  filterFields,
  onLoadDetails,
  onDetails,
  setParentPageState,
  parentPageState,
  endOfData,
}) => {
  const objectListRef = useRef(null);

  const pageFilled = (rows) => {
    let totalHeight = 0;
    Array.from(rows).forEach((row) => {
      totalHeight += row.clientHeight;
    });

    const parentHeight = objectListRef.current.clientHeight;

    return totalHeight > parentHeight;
  };

  const [pageIsFilled, setPageIsFilled] = useState(false);

  useEffect(() => {
    setPageIsFilled(pageFilled(objectListRef.current.children));
    if (!pageIsFilled && !endOfData) {
      setParentPageState(parentPageState + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endOfData, pageIsFilled]);

  const handleScroll = ({ target }) => {
    const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;
    if (bottom && !endOfData) {
      setParentPageState(parentPageState + 1);
    }
  };

  const widthStyle =
    typeof timeFieldWidth !== "undefined"
      ? timeFieldWidth > 0
        ? { minWidth: timeFieldWidth, maxWidth: timeFieldWidth }
        : false
      : {};

  const header = (timeFieldLabel, data) => {
    return (
      <div className="Header">
        {widthStyle && <div className="Timestamp">{timeFieldLabel}</div>}
        <div className="Data">
          {label} - Total {data.total} records
        </div>
      </div>
    );
  };

  const rows = (timeField, filterFields, allRows, onDetailsRequest, onDetails) => {
    if (Array.isArray(allRows)) {
      return allRows.map((row, index) => {
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

  function render(data, loading, errors, timeField, timeFieldLabel, filterFields, onDetailsRequest) {
    if (errors !== false) {
      return <ErrorsBox errorList={errors} />;
    }

    if (loading === true) {
      return <CenteredCircularProgress />;
    } else {
      if (data) {
        return (
          <div className="ObjectList" style={{ overflow: "scroll" }} onScroll={handleScroll} ref={objectListRef}>
            {header(timeFieldLabel, data, onDetailsRequest)}
            {rows(timeField, filterFields, allRows, onDetailsRequest, onDetails)}
          </div>
        );
      } else {
        return "";
      }
    }
  }

  return render(data, loading, errors, timeField, timeFieldLabel, filterFields, onLoadDetails, onDetails);
};

export default AutoLoadObjectList;
