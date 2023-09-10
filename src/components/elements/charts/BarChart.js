import {BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar} from 'recharts';
import React, {useContext, useEffect} from "react";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import "./Chart.css";
import PropTypes from "prop-types";
import {useFetch} from "../../../remote_api/remoteState";
import {LocalDataContext} from "../../pages/DataAnalytics";


// todo onLoadRequest is a misleading name - it is an object with information on endpoint to call
// todo this needs to be refactored.
export default function BarChartElement({onLoadRequest: endpoint, refreshInterval, barChartColors}) {

    const [refresh, setRefresh] = React.useState(0);
    const [refreshing, setRefreshing] = React.useState(false);
    const [data, setData] = React.useState([]);

    const localContext = useContext(LocalDataContext)
    const barColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

    const {isLoading} = useFetch(
        ["getChartData", [endpoint, refresh, localContext]],
        endpoint,
        data => {
            setData(data)
        },
        { retry: 1}
        )

    useEffect(() => {
        let timer;
        let isSubscribed = true
        if (refreshInterval > 0) {
            setRefreshing(true)
            if (timer) {
                clearInterval(timer);
            }
            timer = setInterval(() => {
                setRefresh(Math.random())
            }, refreshInterval * 1000);
        } else {
            if (timer) {
                clearInterval(timer);
            }
        }

        return () => {
            if (timer) {
                clearInterval(timer);
                setRefreshing(false)
            }
            isSubscribed = false;
        };
    }, [refreshInterval, endpoint]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="ChartToolTip">
                    <p>{`Start time : ${label}`}</p>
                    <p>{`Time span : ${payload[0].payload.interval}`}</p>
                    <p>{`Value : ${payload.map((item) => item.value)}`}</p>
                </div>
            );
        }
        return null;
    }

    return (
        <div style={{height: 200, width: '100%'}}>
            {(!refreshing && isLoading === true)
                ? <CenteredCircularProgress/>
                : <ResponsiveContainer>
                <BarChart data={data?.result} margin={{top: 15, right: 20, bottom: 5, left: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip isAnimationActive={false} content={<CustomTooltip/>}/>
                    {data?.buckets?.map((column, index)=> {
                        return <Bar key={index}
                                    stackId="stack"
                                    dataKey={column}
                                    fill={barChartColors[column] ? barChartColors[column] : barColors[Math.floor(index%4)]}

                        />
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