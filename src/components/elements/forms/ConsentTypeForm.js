import React, { useState } from "react";
import { TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader } from "../tui/TuiForm";
import TuiFormError from "../tui/TuiFormError";

import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import BoolInput from "./BoolInput";

import { request } from "../../../remote_api/uql_api_endpoint";
import { v4 as uuid4 } from "uuid";
import Button from "./Button";

export default function ConsentTypeForm({ init }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [revokable, setRevokable] = useState(false);
  const [grantDeny, setGrantDeny] = useState("deny");

  const handleSubmit = async () => {
    const payload = {
      id: uuid4(),
      name: name,
      description: description,
      revokable: revokable,
      default_value: grantDeny,
    };

    request(
      {
        url: "/consent/type",
        method: "post",
        data: payload,
      },
      setLoading,
      (e) => {
        if (e) {
          setError(e[0].msg);
          console.log(e);
        }
      },
      (response) => {
        console.log(response);
      }
    );
  };

  return (
    <div>
      <TuiForm>
        <TuiFormGroup>
          <TuiFormGroupHeader header="Add Consent Type" />
          <TuiFormGroupContent>
            <TuiFormGroupField header="Name">
              <TextField
                id="name"
                label="Enter name"
                value={name}
                onChange={(ev) => {
                  setName(ev.target.value);
                }}
                size="small"
                variant="outlined"
                fullWidth
              />
            </TuiFormGroupField>
            <TuiFormGroupField header="Description">
              <TextField
                value={description}
                label="Enter description"
                multiline
                rows={3}
                onChange={(ev) => {
                  setDescription(ev.target.value);
                }}
                variant="outlined"
                fullWidth
              />
            </TuiFormGroupField>
            <TuiFormGroupField header="Revokable?">
              <BoolInput
                label="Revokable Yes/No"
                value={revokable}
                onChange={() => {
                  setRevokable(!revokable);
                }}
              />
            </TuiFormGroupField>
            <TuiFormGroupField header="Set Default Value">
              <TextField
                label="Default Value"
                select
                variant="outlined"
                size="small"
                value={grantDeny}
                style={{ width: 130, marginRight: 5 }}
                onChange={(ev) => setGrantDeny(ev.target.value)}
              >
                <MenuItem value={"grant"} selected>
                  Grant
                </MenuItem>
                <MenuItem value={"deny"}>Deny</MenuItem>
              </TextField>
            </TuiFormGroupField>
            <TuiFormGroupField>
              {error && <TuiFormError message={error} />}
              <Button
                label="Add Consent Type"
                style={{ justifyContent: "center", marginTop: 20 }}
                progress={loading}
                onClick={handleSubmit}
              />
            </TuiFormGroupField>
          </TuiFormGroupContent>
        </TuiFormGroup>
      </TuiForm>
    </div>
  );
}
