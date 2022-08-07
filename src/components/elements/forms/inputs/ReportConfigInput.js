import React from "react";
import { asyncRemote, getError } from "../../../../remote_api/entrypoint";
import AutoComplete from "../AutoComplete";
import { JsonInput } from "../JsonFormComponents";
import CenteredCircularProgress from "../../progress/CenteredCircularProgress";
import ErrorLine from "../../../errors/ErrorLine";
import ErrorsBox from "../../../errors/ErrorsBox";


export default function ReportConfigInput({value, onChange, errorMessage, endpoint}) {

    const [report, setReport] = React.useState(value?.report || {id: "", name: ""});
    const [params, setParams] = React.useState(value?.params ? typeof value?.params === "string" ? value?.params : JSON.stringify(value?.params, null, "  ") : "{}");
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const mounted = React.useRef(false);

    React.useEffect(() => {
        mounted.current = true;
        
        if (!report?.id) {setParams("{}");}
        if (params === "{}") {
            if (endpoint && report?.id) {
                setLoading(true);
                setError(null);
                asyncRemote({
                    ...endpoint,
                    data: report
                })
                .catch(e => {if (mounted.current) setError(getError(e)); })
                .then(response => {if (mounted.current) setParams(JSON.stringify(response.data, null, '  '))})
                .finally(() => {if (mounted.current) setLoading(false)});
            } else {setParams(JSON.stringify({}));}
        }

        return () => mounted.current = false;
    }, [report?.id, endpoint])

    const handleReportChange = value => {
        setReport(report);
        onChange({report: value, params});
    }

    const handleParamsChange = value => {
        setParams(value);
        onChange({report, params: value})
    }

    return <>
        <AutoComplete
            placeholder="Report"
            endpoint={{url: "/reports/entities", method: "GET"}}
            initValue={report}
            onChange={handleReportChange}
            onSetValue={handleReportChange}
        />
        <div style={{height: loading ? 330 : 320 }}>
            {!loading && 
                <JsonInput
                    value={params}
                    onChange={handleParamsChange}
                />
            }
            {loading && <CenteredCircularProgress />}
            {error && <ErrorsBox errorList={error}/>}
        </div>
        <div style={{height: 10}}>
            {errorMessage && <ErrorLine>{errorMessage}</ErrorLine>}
        </div>
    </>
}