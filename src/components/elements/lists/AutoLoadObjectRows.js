import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { request } from "../../../remote_api/uql_api_endpoint";
import ObjectRow from "./rows/ObjectRow";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

const AutoLoadObjectRows = ({
  timeField,
  timeFieldWidth,
  filterFields,
  onDetails,
  onLoadRequest,
  setTotal,
  shown,
  setShown,
  onDetailsRequest,
  endOfData,
}) => {
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [rows, setRows] = useState([]);
  const [scrollPos, setScrollPos] = useState(0);
  const rowsContainer = useRef(null);

  useEffect(() => {
    const rebuildUrl = (url) => {
      const urlToArr = url.split("/");
      urlToArr.length = 4;
      return `${urlToArr.join("/")}/page/${page}`;
    };
    onLoadRequest.url = rebuildUrl(onLoadRequest.url);
    request(onLoadRequest, setLoading, setError, (response) => {
      if (response) {
        setTotal(response.data.total);
        setShown(shown + response.data.result.length);
        setRows([...rows, ...response.data.result]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useLayoutEffect(() => {
    rowsContainer.current.scrollTop = scrollPos;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    } else {
      return setError("Incorrect Data Format");
    }
  };

  const handleScroll = ({ target }) => {
    const bottom = target.scrollHeight - Math.ceil(target.scrollTop) - 1 <= target.clientHeight;

    if (bottom && !endOfData()) {
      setPage(page + 1);
      setScrollPos(target.scrollTop);
    }
  };

  if (loading) {
    return <CenteredCircularProgress />;
  }

  if (error) {
    return <ErrorsBox errorList={error} />;
  }

  return (
    <div style={{ overflow: "scroll" }} onScroll={handleScroll} ref={rowsContainer}>
      {rows.length > 0 && buildRows(rows)}
    </div>
  );
};

export default AutoLoadObjectRows;
