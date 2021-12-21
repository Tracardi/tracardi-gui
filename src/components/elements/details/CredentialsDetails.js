import React, {useEffect} from "react";
import "../lists/cards/SourceCard.css";
import "./ResourceDetails.css";
import "./Details.css";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {request} from "../../../remote_api/uql_api_endpoint";
import {ObjectInspector} from "react-inspector";
import PropTypes from "prop-types";
import {TuiForm, TuiFormGroup, TuiFormGroupContent, TuiFormGroupHeader} from "../tui/TuiForm";

export default function CredentialDetails({id}) {

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        setLoading(true);
        request(
            {
                url: '/resource/' + id,
                method: "GET"
            },
            setLoading,
            () => {
            },
            (response) => {
                if (response) {
                    setData(response.data)
                }
            }
        )
    }, [id])

    const Details = () => <>
        <TuiForm>
            <TuiFormGroup>
                <TuiFormGroupHeader header="Credentials or Access tokens"
                                    description="This json data is part of source. If you want to EDIT it go to source section."/>
                <TuiFormGroupContent>
                    <fieldset style={{padding: 10}}>
                        <legend>Credentials</legend>
                        <ObjectInspector data={data.config} expandLevel={10}/>
                    </fieldset>
                </TuiFormGroupContent>
            </TuiFormGroup>
        </TuiForm>
    </>

    return <div className="Box10" style={{height: "100%"}}>
        {loading && <CenteredCircularProgress/>}
        {data && <Details/>}
    </div>

}

CredentialDetails.propTypes = {
    id: PropTypes.string,
  };