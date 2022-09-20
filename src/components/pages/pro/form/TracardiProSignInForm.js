import React, {useEffect, useRef, useState} from "react";
import {asyncRemote, covertErrorIntoObject, getError} from "../../../../remote_api/entrypoint";
import TextField from "@mui/material/TextField";
import Button from "../../../elements/forms/Button";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../../../elements/tui/TuiForm";
import TuiColumnsFlex from "../../../elements/tui/TuiColumnsFlex";
import TuiTopHeaderWrapper from "../../../elements/tui/TuiTopHeaderWrapper";
import ErrorsBox from "../../../errors/ErrorsBox";
import {BsArrowLeftCircle} from "react-icons/bs";
import AlertBox from "../../../errors/AlertBox";
import {VscSignIn} from "react-icons/vsc";
import PasswordInput from "../../../elements/forms/inputs/PasswordInput";

export default function TracardiProSignInForm({onSubmit, onCancel}) {

    const [data, setData] = useState({
        url: "",
        username: "",
        password: "",
    });
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})
    const [accessDenied, setAccessDenied] = useState(false);

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        return () => {
            mounted.current = false;
        };
    }, []);

    const handleSignIn = async () => {
        try {
            setFieldErrors({});
            setError(false);
            setLoading(true);
            const response = await asyncRemote({
                url: '/tpro/sign_in',
                method: "POST",
                data: data
            })

            if (response.status === 200 && mounted.current) {
                if (onSubmit) {
                    onSubmit(response.data)
                }
            }

        } catch (e) {
            if (mounted.current) {
                const errors = getError(e);
                if(e?.request?.status  === 403) {
                    console.warn(errors[0].msg);
                    setAccessDenied(true);
                } else {
                    setFieldErrors(covertErrorIntoObject(errors));
                    setError(errors);
                }
            }
        } finally {
            if (mounted.current) {
                setLoading(false);
            }
        }
    }

    return <TuiForm style={{maxWidth: 500}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Tracardi Pro Sign In" description="Sing-in to Tracardi Pro services."/>
            {error && <ErrorsBox errorList={error} style={{borderRadius: 0}}/>}
            {accessDenied && <AlertBox>Access denied. Please check your e-mail and password.</AlertBox>}
            <TuiFormGroupContent>
                <TuiFormGroupContent>
                    <TuiFormGroupField>
                        <TuiColumnsFlex width={200} style={{marginTop: 20}}>
                            <TuiTopHeaderWrapper header="E-mail"
                                                 description="Please type e-mail."
                                                 descHeight={40}
                            >
                                <TextField
                                    label="E-mail"
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
                                                 description="Please type password."
                                                 descHeight={40}
                            >
                                <PasswordInput
                                    label="Password"
                                    value={data.password}
                                    onChange={(ev) => {
                                        setData({...data, password: ev.target.value})
                                    }}
                                    error={"password" in fieldErrors}
                                    helperText={"password" in fieldErrors && fieldErrors['password']}
                                    required={true}
                                />
                            </TuiTopHeaderWrapper>
                        </TuiColumnsFlex>

                    </TuiFormGroupField>
                </TuiFormGroupContent>

            </TuiFormGroupContent>

        </TuiFormGroup>
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <Button label="Cancel" onClick={onCancel}
                    style={{padding: "6px 10px", justifyContent: "center"}}
                    icon={<BsArrowLeftCircle size={20}/>}
            />
            <Button label="Sign-in" onClick={handleSignIn}
                    style={{padding: "6px 10px", justifyContent: "center"}}
                    progress={loading}
                    icon={<VscSignIn size={20}/>}
            />
        </div>


    </TuiForm>

}
