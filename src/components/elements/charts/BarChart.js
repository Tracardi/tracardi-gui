import {BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar} from 'recharts';
import React, {useContext, useEffect} from "react";
import {request} from "../../../remote_api/uql_api_endpoint";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import "./Chart.css";
import PropTypes from "prop-types";
import NoDataError from "../../errors/NoDataError";
import {LoadingContext} from "../../pages/DataAnalytics";


// todo onLoadRequest is a misleading name - it is an object with information on endpoint to call
// todo this needs to be refactored.
export default function BarChartElement({onLoadRequest, columns}) {

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(false);
    const [ready, setReady] = React.useState(false);

    const loadingContext = useContext(LoadingContext);

    useEffect(() => {
        let isSubscribed = true
        if(loadingContext) {
            setLoading(true);
        } else if(loading === true) {
            setLoading(false)
        }
        request(
            onLoadRequest,
            (value)=> {if(isSubscribed && loadingContext) setLoading(value);},
            (value) => {if(isSubscribed) setError(value);},
            (value) => {if(isSubscribed) setReady(value);}
        );
        return () => isSubscribed = false
    }, [onLoadRequest])

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="ChartToolTip">
                    <p>{`Start time : ${label}`}</p>
                    <p>{`Time span : ${payload[0].payload.interval}`}</p>
                    <p>{`Value : ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    }

    return (
        <div style={{height: 200, width: '100%'}}>
            {loading === true && <CenteredCircularProgress/>}
            {error !== false && loading === false && <NoDataError msg="Data is unavailable"/>}
            {ready !== false && loading === false && <ResponsiveContainer>
                <BarChart data={ready.data.result} margin={{top: 15, right: 20, bottom: 5, left: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip isAnimationActive={false} content={<CustomTooltip/>}/>
                    {columns.map((column, index)=> {
                        return <Bar key={index} stackId={column.stackId ? column.stackId : "stack"} dataKey={column.label} fill={column.color ? column.color : "#ffa000"}/>
                    })}

                    <XAxis dataKey="date" style={{fontSize:"80%"}}/>
                    <YAxis style={{fontSize:"90%"}}/>

                </BarChart>
            </ResponsiveContainer>}
        </div>
    );
}

BarChartElement.propTypes = {
    columns: PropTypes.array,
    onLoadRequest: PropTypes.object,
  };