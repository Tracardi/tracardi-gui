import React, { useEffect, useState } from "react";
import { FixedSizeList as List } from "react-window";
import TextField from "@mui/material/TextField";
import { TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader } from "../tui/TuiForm";
import TuiFormError from "../tui/TuiFormError";
import CenteredCircularProgress from "../../elements/progress/CenteredCircularProgress";
import { request } from "../../../remote_api/uql_api_endpoint";
import { VscTrash } from "react-icons/vsc";
import "./ConsentTypeList.css";

const ConsentTypeList = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [results, setResults] = useState([]);
  const [limit, setLimit] = useState(25);
  const [starting, setStarting] = useState(1);

  const refreshData = () => {
    request(
      {
        url: `/consents/type/${starting}/${limit}`,
        method: "get",
      },
      setLoading,
      (e) => {
        if (e) {
          setError(e[0].msg);
          console.log(e);
        }
      },
      (response) => {
        setResults(response?.data?.result);
      }
    );
  };

  useEffect(() => {
    refreshData();
  }, [limit, starting]);

  const handleDelete = (id) => {
    request(
      {
        url: `/consent/type/${id}`,
        method: "delete",
      },
      setLoading,
      (e) => {
        if (e) {
          setError(e[0].msg);
        }
      },
      (response) => {
        setResults(results.filter((r) => r.id !== id));
      }
    );
  };

  return (
    <TuiForm>
      <TuiFormGroup>
        <TuiFormGroupHeader header="Consent Types" />
        <TuiFormGroupContent>
          <TuiFormGroupField>
            <TextField
              type="number"
              inputProps={{ min: 1 }}
              label="Limit"
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              style={{ marginRight: 20 }}
            />
            <TextField
              type="number"
              label="Starting from"
              inputProps={{ min: 1 }}
              value={starting}
              onChange={(e) => setStarting(e.target.value)}
            />
            {error && <TuiFormError message={error} />}
          </TuiFormGroupField>
          <TuiFormGroupField header="Manage Consent Types">
            {loading ? (
              <CenteredCircularProgress />
            ) : (
              <List
                className="List"
                innerElementType="ul"
                itemData={results}
                itemCount={results?.length}
                itemSize={40}
                height={200}
                width={700}
              >
                {({ data, index, style }) => {
                  return (
                    <li style={style} className={`${index % 2 ? "ListItemEven" : "ListItemOdd"}`}>
                      {data[index].name}
                      <VscTrash
                        size={20}
                        onClick={() => {
                          handleDelete(data[index].id);
                        }}
                        className="Button DeleteButton"
                        style={{ cursor: "pointer" }}
                      />
                    </li>
                  );
                }}
              </List>
            )}
          </TuiFormGroupField>
        </TuiFormGroupContent>
      </TuiFormGroup>
    </TuiForm>
  );
};

export default ConsentTypeList;
