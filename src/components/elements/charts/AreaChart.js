import {CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area} from 'recharts';
import React from "react";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import "./Chart.css";
import PropTypes from "prop-types";
import {useFetch} from "../../../remote_api/remoteState";
import useTheme from "@mui/material/styles/useTheme";


export default function AreaChartDisplay({endpoint, barChartColors}) {

    const [data, setData] = React.useState([]);

    const theme = useTheme()

    const barColors = theme.palette.charts.pie

    const {isLoading} = useFetch(
        ["getChartData", [endpoint]],
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
                <AreaChart data={data?.result} margin={{top: 15, right: 20, bottom: 5, left: 0}}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,.3)"/>
                    <Tooltip isAnimationActive={false} content={<CustomTooltip/>}/>
                    {data?.buckets?.map((column, index) => {
                        return <Area key={index}
                                     stackId="stack"
                                     dataKey={column}
                                     type="monotone"
                                     strokeWidth={1}
                                     fill={barChartColors[column] ? barChartColors[column] : barColors[Math.floor(index % 4)]}
                                     stroke={barChartColors[column] ? barChartColors[column] : barColors[Math.floor(index % 4)]}

                        />
                    })}

                    <XAxis dataKey="date" style={{fontSize:"80%"}}/>
                    <YAxis style={{fontSize:"90%"}}/>

                </AreaChart>
            </ResponsiveContainer>}
        </div>
    );
}

AreaChartDisplay.propTypes = {
    barChartColors: PropTypes.array,
    endpoint: PropTypes.object,
  };