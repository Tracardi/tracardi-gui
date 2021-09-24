import React, { useEffect, useState } from "react";
import { request } from "../../remote_api/uql_api_endpoint";
import ErrorsBox from "../errors/ErrorsBox";
import AutoLoadObjectList from "../elements/lists/AutoLoadObjectList";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";

export default function Instances() {
  const [data, setData] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);
  const [page, setPage] = useState(0);
  const [endOfData, setEndOfData] = useState(false);

  useEffect(() => {
    !endOfData &&
      request(
        {
          url: `/instances/page/${page}`,
          method: "GET",
        },
        setLoading,
        (e) => {
          setErrors(e);
        },
        (response) => {
          if (response) {
            if (response.data.result.length === 0) {
              setEndOfData(true);
            }
            setData(response.data);
            setRows([...rows, ...response.data.result]);
          }
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  if (loading) {
    return <CenteredCircularProgress />;
  }

  if (data) {
    return (
      <AutoLoadObjectList
        data={data}
        allRows={rows}
        label="INSTANCES"
        errors={errors}
        loading={loading}
        timeField={(row) => [row.timestamp]}
        timeFieldLabel="Timestamp"
        setParentPageState={setPage}
        parentPageState={page}
        endOfData={endOfData}
      />
    );
  }

  if (errors) {
    return <ErrorsBox errorList={errors} />;
  }

  return null;
}
