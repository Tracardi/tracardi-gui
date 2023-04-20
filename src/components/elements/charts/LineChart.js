import {CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar, LineChart, Line} from 'recharts';
import React, {useContext} from "react";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import "./Chart.css";
import PropTypes from "prop-types";
import {useFetch} from "../../../remote_api/remoteState";
import {LocalDataContext} from "../../pages/DataAnalytics";


export default function LineChartDisplay({endpoint, barChartColors}) {

    const [data, setData] = React.useState([]);

    const localContext = useContext(LocalDataContext)
    const barColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

    const {isLoading} = useFetch(
        ["getChartData", [endpoint, localContext]],
        endpoint,
        data => {
            setData(data)
        })

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
            {(isLoading === true)
                ? <CenteredCircularProgress/>
                : <ResponsiveContainer>
                <LineChart data={data?.result} margin={{top: 15, right: 20, bottom: 5, left: 0}}>
                    <CartesianGrid strokeDasharray="3 3"/>
                    <Tooltip isAnimationActive={false} content={<CustomTooltip/>}/>
                    {data?.buckets?.map((column, index) => {
                        return <Line key={index}
                                     stackId="stack"
                                     dataKey={column}
                                     type="monotone"
                                     strokeWidth={2}
                                     stroke={barChartColors[column] ? barChartColors[column] : barColors[Math.floor(index % 4)]}

                        />
                    })}

                    <XAxis dataKey="date" style={{fontSize:"80%"}}/>
                    <YAxis style={{fontSize:"90%"}}/>

                </LineChart>
            </ResponsiveContainer>}
        </div>
    );
}

LineChartDisplay.propTypes = {
    barChartColors: PropTypes.array,
    endpoint: PropTypes.object,
  };