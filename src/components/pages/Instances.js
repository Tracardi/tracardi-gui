import { useEffect, useState } from "react";
import { request } from "../../remote_api/uql_api_endpoint";
import ObjectList from "../elements/lists/ObjectList";

export default function Instances() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(null);

  useEffect(() => {
    request(
      {
        url: "/instances",
        method: "GET",
      },
      (l) => {
        setLoading(l);
      }, // sets l=true when loading, l=false when ready
      (e) => {
        setErrors(e);
      }, // runs on error
      (response) => {
        // on response ready
        if (response) {
          console.log(response.data);
          setData(response.data);
        }
      }
    );
  }, [loading]);

  if (data) {
    return (
      <ObjectList
        data={data}
        label="INSTANCES"
        errors={errors}
        loading={loading}
        timeField={(row) => [row.timestamp]}
        timeFieldLabel="Timestamp"
      />
    );
  }

  if (errors) {
    return "ERROR";
  }

  return null;
}
