import ObjectRow from "./rows/ObjectRow";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

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
}) => {
  const handleScroll = ({ target }) => {
    const bottom = target.scrollHeight - target.scrollTop === target.clientHeight;
    if (bottom) {
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
          <div className="ObjectList" style={{ overflow: "scroll" }} onScroll={handleScroll}>
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
