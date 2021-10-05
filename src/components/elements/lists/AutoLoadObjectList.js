import { useState } from "react";
import AutoLoadObjectRows from "./AutoLoadObjectRows";

const AutoLoadObjectList = ({
  label,
  timeField,
  timeFieldLabel,
  timeFieldWidth,
  filterFields,
  onLoadDetails,
  onDetails,
  onLoadRequest,
}) => {
  const [shown, setShown] = useState(0);
  const [total, setTotal] = useState(0);

  // useEffect(() => {
  //   }, [onLoadRequest])

  const endOfData = () => {
    return shown >= total;
  };

  const widthStyle =
    typeof timeFieldWidth !== "undefined"
      ? timeFieldWidth > 0
        ? { minWidth: timeFieldWidth, maxWidth: timeFieldWidth }
        : false
      : {};

  const header = (timeFieldLabel) => {
    return (
      <div className="Header">
        {widthStyle && <div className="Timestamp">{timeFieldLabel}</div>}
        <div className="Data">
          {label} - Showing {shown} of {total} total records
        </div>
      </div>
    );
  };

  function render(timeField, timeFieldLabel, filterFields, onDetailsRequest) {
    return (
      <div className={!endOfData() ? "ObjectList" : "ObjectList EndOfList"}>
        {header(timeFieldLabel)}
        <AutoLoadObjectRows
          timeField={timeField}
          filterFields={filterFields}
          onDetails={onDetails}
          onDetailsRequest={onDetailsRequest}
          shown={shown}
          setShown={setShown}
          setTotal={setTotal}
          onLoadRequest={onLoadRequest}
          endOfData={endOfData}
        />
      </div>
    );
  }
  return render(timeField, timeFieldLabel, filterFields, onLoadDetails, onDetails);
};

export default AutoLoadObjectList;
