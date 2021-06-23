import React, {Suspense, useEffect} from "react";
import "../lists/cards/SourceCard.css";
import "./SourceDetails.css";
import "./Details.css";
import FormHeader from "../misc/FormHeader";
import ElevatedBox from "../misc/ElevatedBox";
import FormSubHeader from "../misc/FormSubHeader";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import {request} from "../../../remote_api/uql_api_endpoint";
import FormDescription from "../misc/FormDescription";
import {ObjectInspector} from "react-inspector";


export default function CredentialDetails({id}) {

    const [data, setData] = React.useState(null);
    const [loading, setLoading] = React.useState(false);



    useEffect(() => {
        setLoading(true);
        request(
            {
                url: '/source/' + id,
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
        <FormHeader>Credentials / Configuration</FormHeader>
        <ElevatedBox>
            <FormSubHeader>Credentials or Access tokens</FormSubHeader>
            <FormDescription>This json data is part of source. If you want to EDIT it go to source section.</FormDescription>
            <div style={{border: "solid 1px #ddd", padding: 10, borderRadius: 5}}>
                <ObjectInspector data={data.config} expandLevel={10}/>
            </div>
        </ElevatedBox>

    </>

    return <div className="Box10">
        {loading && <CenteredCircularProgress/>}
        {data && <Details/>}
    </div>

}