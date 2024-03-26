import {BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Bar} from 'recharts';
import React, {useEffect} from "react";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import "./Chart.css";
import PropTypes from "prop-types";
import {useFetch} from "../../../remote_api/remoteState";
import useTheme from "@mui/material/styles/useTheme";
import Slider from "@mui/material/Slider";
import DateRangeSlider from "../datepickers/DateRangeSlider";


// todo onLoadRequest is a misleading name - it is an object with information on endpoint to call
// todo this needs to be refactored.
export default function BarChartElement({onLoadRequest: endpoint, refreshInterval, barChartColors, rangeValue, onRangeChange}) {

    const theme = useTheme()

    const [refresh, setRefresh] = React.useState(0);
    const [data, setData] = React.useState([]);

    const barColors = [theme.palette.primary.main, '#00C49F', '#FFBB28', '#FF8042']

    const {isLoading} = useFetch(
        ["getChartData", [endpoint, refresh]],
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
        <div style={{height: 250, paddingTop: 20, width: '100%'}}>
            <div style={{width: "100%", height: 160}}>
                <ResponsiveContainer>
                    <BarChart data={data?.result} margin={{top: 20, right: 80, bottom: 0, left: 0}}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,.5)"/>
                        <Tooltip isAnimationActive={false} content={<CustomTooltip/>}/>
                        {data?.buckets?.map((column, index) => {
                            return <Bar key={index}
                                        stackId="stack"
                                        dataKey={column}
                                        fill={barChartColors[column] ? barChartColors[column] : barColors[Math.floor(index % 4)]}

                            />
                        })}
                        <XAxis dataKey="date" style={{fontSize: "80%"}}/>
                        <YAxis style={{fontSize: "90%"}}/>

                    </BarChart>
                </ResponsiveContainer>
                <DateRangeSlider value={rangeValue} onChange={onRangeChange}/>
            </div>
        </div>
    );
}

BarChartElement.propTypes = {
    columns: PropTypes.array,
    onLoadRequest: PropTypes.object,
  };