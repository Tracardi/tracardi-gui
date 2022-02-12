import React, {useEffect, useRef, useState} from "react";
import {asyncRemote, covertErrorIntoObject, getError} from "../../../remote_api/entrypoint";
import TextField from "@mui/material/TextField";
import Button from "./Button";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupField, TuiFormGroupHeader} from "../tui/TuiForm";
import TuiColumnsFlex from "../tui/TuiColumnsFlex";
import TuiTopHeaderWrapper from "../tui/TuiTopHeaderWrapper";
import ErrorsBox from "../../errors/ErrorsBox";
import {MenuItem} from "@mui/material";
import {BsXCircle, BsArrowRightCircle, BsArrowLeftCircle} from "react-icons/bs";

export default function TracardiProSignUpForm({onSubmit, onCancel}) {

    const [step, setStep] = useState(1);
    const [data, setData] = useState({
        host: "",
        type: "",
        name: "",
        username: "",
        password: "",
    });
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState({})
    const [hosts, setHosts] = useState([]);

    const mounted = useRef(false);

    useEffect(() => {
        mounted.current = true;
        asyncRemote({
            url: "/tpro/available_hosts"
        }).then((response) => {
            if (response.data?.hosts) {
                setHosts(response.data.hosts);
            }
        }).catch((e) => {

        }).finally(() => {

        })
        return () => {
            mounted.current = false;
        };
    }, []);

    const handleRegisterTracardiPro = async () => {
        try {
            setFieldErrors({});
            setError(false);
            setLoading(true);
            const response = await asyncRemote({
                url: '/tpro/sign_up',
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
                setFieldErrors(covertErrorIntoObject(errors));
                setError(errors);
            }
        } finally {
            if (mounted.current) {
                setLoading(false);
            }
        }
    }

    const step1 = () => <TuiForm style={{maxWidth: 500}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Tracardi Pro Registration" description="Sing-up to Tracardi Pro services."/>
            {error && <ErrorsBox errorList={error} style={{borderRadius: 0}}/>}
            <TuiFormGroupContent>
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Registration type"
                                       description="Please select if you register company or private person.">
                        <TextField
                            select
                            label="Who registers"
                            value={data.type}
                            onChange={(ev) => {
                                setData({...data, type: ev.target.value})
                            }}
                            size="small"
                            variant="outlined"
                            required={true}
                            error={"type" in fieldErrors}
                            helperText={"type" in fieldErrors && fieldErrors['type']}
                            style={{marginTop: 10, width: 160}}
                        >
                            <MenuItem value="company">Company</MenuItem>
                            <MenuItem value="person">Person</MenuItem>
                        </TextField>
                    </TuiFormGroupField>
                    <TuiFormGroupField header="Company name or your name"
                                       description="Please type company name or you name.">
                        <TextField
                            label="Company or your name"
                            value={data.name}
                            onChange={(ev) => {
                                setData({...data, name: ev.target.value})
                            }}
                            size="small"
                            variant="outlined"
                            required={true}
                            error={"name" in fieldErrors}
                            helperText={"name" in fieldErrors && fieldErrors['name']}
                            fullWidth
                            style={{marginTop: 10}}
                        />
                    </TuiFormGroupField>
                </TuiFormGroupContent>

            </TuiFormGroupContent>

        </TuiFormGroup>
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <Button label="Cancel" onClick={onCancel}
                    style={{padding: "6px 10px", justifyContent: "center"}}
                    icon={<BsXCircle size={20}/>}
            />
            <Button label="Next" onClick={() => setStep(2)}
                    style={{padding: "6px 10px", justifyContent: "center"}}
                    icon={<BsArrowRightCircle size={20}/>}
            />
        </div>
    </TuiForm>

    const step2 = () => <TuiForm style={{maxWidth: 500}}>
        <TuiFormGroup>
            <TuiFormGroupHeader header="Tracardi Pro Registration" description="Sing-up to Tracardi Pro services."/>
            {error && <ErrorsBox errorList={error} style={{borderRadius: 0}}/>}
            <TuiFormGroupContent>
                <TuiFormGroupContent>
                    <TuiFormGroupField header="Service Host" description="Please any of the available service Hosts.">
                        <TextField
                            label="Tracardi Pro Server Host"
                            value={data.host}
                            onChange={(ev) => {
                                setData({...data, host: ev.target.value})
                            }}
                            size="small"
                            variant="outlined"
                            required={true}
                            error={"host" in fieldErrors}
                            helperText={"host" in fieldErrors && fieldErrors['host']}
                            select
                            fullWidth
                            style={{marginTop: 10}}
                        >
                            {hosts.map((host, index) => <MenuItem value={host} key={index}>{host}</MenuItem>)}
                        </TextField>
                    </TuiFormGroupField>
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
        <div style={{display: "flex", justifyContent: "space-between"}}>
            <Button label="Back" onClick={() => setStep(1)}
                    style={{padding: "6px 10px", justifyContent: "center"}}
                    icon={<BsArrowLeftCircle size={20}/>}
            />
            <Button label="Sign-up" onClick={handleRegisterTracardiPro}
                    style={{padding: "6px 10px", justifyContent: "center"}}
                    progress={loading}
            />
        </div>


    </TuiForm>

    return (step === 1) ? step1() : step2();
}
