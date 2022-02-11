import React, {useEffect, useState} from "react";
import {asyncRemote, getError} from "../../remote_api/entrypoint";
import TracardiProAvailableServicesList from "../elements/lists/TracardiProAvailableServicesList";
import TracardiProSignUpForm from "../elements/forms/TracardiProSignUpForm";
import FormDrawer from "../elements/drawers/FormDrawer";
import TracardiProServiceConfigForm from "../elements/forms/TracardiProServiceConfigForm";
import './TracardiPro.css';
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../elements/tui/TuiForm";
import CenteredCircularProgress from "../elements/progress/CenteredCircularProgress";
import ErrorsBox from "../errors/ErrorsBox";
import Button from "../elements/forms/Button";
import {BsStar, BsPlusCircle} from "react-icons/bs";
import {VscSignIn} from "react-icons/vsc";
import TracardiProSignInForm from "../elements/forms/TracardiProSignInForm";
import Resources from "./Resources";

export default function TracardiPro() {

    const [selectedService, setSelectedService] = useState(null);
    const [stage, setStage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [signIn, setSignIn] = useState(false);
    const [signUp, setSignUp] = useState(false);

    useEffect(() => {
        setLoading(true);
        asyncRemote({
            url: "/tpro/validate"
        }).then(
            (response) => {
                if (response.status === 200) {
                    if (response.data === true) {
                        setStage(3);
                    } else {
                        if (response.data === false) {
                            setSignIn(false);
                            setSignUp(true);
                        } else {
                            setSignIn(true);
                            setSignUp(false);
                        }
                        setStage(0);
                    }
                }
            }
        ).catch((e) => {
            if (e?.response?.status === 403) {

            } else {
                setError(getError(e))
            }
        }).finally(() => {
            setLoading(false);
        })

    }, [])


    const handleServiceAddClick = (service) => {
        setSelectedService(service)
    }

    const handleServiceSaveClick = async () => {
        setSelectedService(null);
    }

    const EntryPoint = () => {
        return <div style={{display: "flex", alignItems: "center", flexDirection: "column", padding: 30}}>
            <BsStar size={80} style={{color: "gray", margin: 20}}/>
            <header style={{fontSize: "150%", fontWeight: 300, maxWidth: 600, textAlign: "center"}}>Please join Tracardi
                Pro for more free and premium connectors and services. No credit card required. It is a free lifetime
                membership.
            </header>
            <nav style={{display: "flex", marginTop: 20}}>
                <Button label="Sign-in" icon={<VscSignIn size={20}/>} onClick={() => setStage(2)}
                        selected={signIn}></Button>
                <Button label="Sign-up" icon={<BsPlusCircle size={20}/>} onClick={() => setStage(1)}
                        selected={signUp}></Button>
            </nav>

        </div>
    }

    const handleSingIn = (data) => {
        if (data === true) {
            setStage(3);
        }
    }

    const route = () => {
        if (stage === null) {
            return ""
        } else if (stage === 0) {
            return <div style={{padding: 20}}><EntryPoint/></div>
        } else if (stage === 1) {
            return <div style={{padding: 20}}><TracardiProSignUpForm onSubmit={() => setStage(3)}
                                                                     onCancel={() => setStage(0)}/></div>
        } else if (stage === 2) {
            return <div style={{padding: 20}}><TracardiProSignInForm onSubmit={handleSingIn}
                                                                     onCancel={() => setStage(0)}/></div>
        } else if (stage === 3) {
            return <>
                <TuiForm style={{width: "100%", padding: 20}}>
                    <TuiFormGroup>
                        <TuiFormGroupHeader header="Premium services"/>
                        <TuiFormGroupContent>
                            <TracardiProAvailableServicesList onServiceClick={handleServiceAddClick}/>
                        </TuiFormGroupContent>
                    </TuiFormGroup>
                </TuiForm>
                <Resources/>
                <FormDrawer
                    width={550}
                    label="Configure"
                    onClose={() => setSelectedService(null)}
                    open={selectedService !== null}>

                    <div style={{padding: 20}}>
                        <TracardiProServiceConfigForm
                            service={selectedService}
                            onSubmit={handleServiceSaveClick}
                        />
                    </div>

                </FormDrawer></>
        }
    }

    return <div className="TracardiPro">
        {error && <ErrorsBox errorList={error}/>}
        {loading && <CenteredCircularProgress/>}
        {route()}
    </div>

}