import React, {useState} from "react";
import {asyncRemote, covertErrorIntoObject, getError} from "../../../remote_api/entrypoint";
import TextField from "@material-ui/core/TextField";
import Button from "./Button";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TuiColumnsFlex from "../tui/TuiColumnsFlex";
import TuiTopHeaderWrapper from "../tui/TuiTopHeaderWrapper";
import ErrorsBox from "../../errors/ErrorsBox";

export default function TracardiProForm({value, onSubmit}) {

    const [data, setData] = useState(value || {});
    const [error, setError] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})

    const handleRegisterTracardiPro = async () => {
        try {
            setFieldErrors({});
            setError(false);
            const response = await asyncRemote({
                url: '/tracardi-pro',
                method: "POST",
                data: {
                    ...data,
                    id: "0"
                }
            })

            if(response.status === 200) {
                if (onSubmit) {
                    onSubmit(response.data)
                }
            }

        } catch (e) {
            const errors = getError(e);
            setFieldErrors(covertErrorIntoObject(errors));
            setError(errors);
        }
    }

    return <TuiForm style={{maxWidth: 500}}>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Tracardi Pro Registration" description="Authorize Tracardi in Tracardi Pro service to get commercial services abailable." />
                {error && <ErrorsBox errorList={error} style={{borderRadius: 0}}/> }
                <TuiFormGroupContent>
                    <TuiFormGroupContent>
                        <TuiFormGroupField header="Service URL" description="Please copy and paste the service URL you received while purchasing the service.
                        This is the server Tracardi will connect to when commercial services are executed.">
                            <TextField
                                label="Tracardi Pro Server URL"
                                value={data.url}
                                onChange={(ev) => {
                                    setData({...data, url: ev.target.value})
                                }}
                                size="small"
                                variant="outlined"
                                required={true}
                                error={"url" in fieldErrors}
                                helperText={"url" in fieldErrors && fieldErrors['url']}
                                fullWidth
                                style={{marginTop: 10}}
                            />
                        </TuiFormGroupField>
                        <TuiFormGroupField header="Token" description="Please copy and paste the token you received while purchasing the service. ">
                            <TextField
                                label="Token"
                                value={data.token}
                                onChange={(ev) => {
                                    setData({...data, token: ev.target.value})
                                }}
                                size="small"
                                variant="outlined"
                                error={"token" in fieldErrors}
                                helperText={"token" in fieldErrors && fieldErrors['token']}
                                style={{marginTop: 10}}
                                required={true}
                            />
                        </TuiFormGroupField>
                        <TuiFormGroupField>
                            <TuiColumnsFlex width={200} style={{marginTop: 20}}>
                                <TuiTopHeaderWrapper header="User name"
                                                     description="Please type username to Tracardi Pro Server"
                                                     descHeight={40}
                                >
                                    <TextField
                                        label="User name"
                                        value={data.username}
                                        onChange={(ev) => {
                                            setData({...data, username: ev.target.value})
                                        }}
                                        size="small"
                                        error={"username" in fieldErrors}
                                        helperText={"username" in fieldErrors && fieldErrors['username']}
                                        variant="outlined"
                                        required={true}
                                    />
                                </TuiTopHeaderWrapper>
                                <TuiTopHeaderWrapper header="Password"
                                                     description="Please type password to Tracardi Pro Server"
                                                     descHeight={40}
                                >
                                    <TextField
                                        label="Password"
                                        value={data.password}
                                        type="password"
                                        onChange={(ev) => {
                                            setData({...data, password: ev.target.value})
                                        }}
                                        size="small"
                                        error={"password" in fieldErrors}
                                        helperText={"password" in fieldErrors && fieldErrors['password']}
                                        variant="outlined"
                                        required={true}
                                    />
                                </TuiTopHeaderWrapper>
                            </TuiColumnsFlex>

                        </TuiFormGroupField>
                    </TuiFormGroupContent>

                </TuiFormGroupContent>

            </TuiFormGroup>

            <Button label="Register" onClick={handleRegisterTracardiPro}
                    style={{ padding: "6px 10px", justifyContent: "center"}}/>

        </TuiForm>
}
