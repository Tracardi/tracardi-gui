import React, {useEffect, useState} from "react";
import {asyncRemote, getError} from "../../../remote_api/entrypoint";
import ErrorsBox from "../../errors/ErrorsBox";
import CenteredCircularProgress from "../../elements/progress/CenteredCircularProgress";
import ProEntryPoint from "./ProEntryPoint";
import TracardiProSignUpForm from "../../elements/forms/pro/TracardiProSignUpForm";
import TracardiProSignInForm from "../../elements/forms/pro/TracardiProSignInForm";
import ProServiceList from "./ProServiceList";
import './ProRouter.css';

export default function ProRouter() {

    const [stage, setStage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        let isSubscribed = true;
        asyncRemote({
            url: "/tpro/validate"
        }).then(
            (response) => {
                if (response.status === 200 && isSubscribed === true) {
                    if (response.data === true) {
                        setStage(3);
                    } else {
                        setStage(0);
                    }
                }
            }
        ).catch((e) => {
            if (isSubscribed === true) {
                if (e?.response?.status === 403) {

                } else {
                    setError(getError(e))
                }
            }

        }).finally(() => {
            if (isSubscribed === true) setLoading(false);
        })

        return () => {
            isSubscribed = false
        }

    }, [])


    const handleSingIn = (data) => {
        if (data === true) {
            setStage(3);
        }
    }

    const Wrapper = ({children}) => {
        return <div className="TracardiPro">
            {children}
        </div>
    }

    const TracardiProRoute = () => {

        if (error) return <ErrorsBox errorList={error}/>
        if (loading) return <CenteredCircularProgress/>

        if (stage === 0) {
            return <ProEntryPoint onClick={(value) => setStage(value)}/>
        } else if (stage === 1) {
            return <TracardiProSignUpForm onSubmit={() => setStage(3)}
                                          onCancel={() => setStage(0)}/>
        } else if (stage === 2) {
            return <TracardiProSignInForm onSubmit={handleSingIn}
                                          onCancel={() => setStage(0)}/>
        } else if (stage === 3) {
            return <ProServiceList/>
        } else {
            return ""
        }
    }

    return <Wrapper><TracardiProRoute/></Wrapper>
}