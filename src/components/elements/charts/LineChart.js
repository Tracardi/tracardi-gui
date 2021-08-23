import {
  AreaChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
} from "recharts";
import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { request } from "../../../remote_api/uql_api_endpoint";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";
import "./Chart.css";

export default function LineChartElement({ onLoadRequest, columns }) {
  const [loading, setLoading] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  useEffect(() => {
    request(
      onLoadRequest,
      (value) => {
        setLoading(value);
      },
      () => {},
      (value) => {
        setReady(value);
      }
    );
  }, [onLoadRequest]);

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
  };

  return (
    <div style={{ height: 200, width: "100%" }}>
      {loading === true && <CenteredCircularProgress />}
      {ready !== false && (
        <ResponsiveContainer>
          <AreaChart
            data={ready.data.result}
            margin={{ top: 15, right: 20, bottom: 5, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip isAnimationActive={false} content={<CustomTooltip />} />
            {columns.map((column, index) => {
              return (
                <Area
                  type="monotone"
                  key={index}
                  strokeWidth={2}
                  stackId={column.stackId ? column.stackId : "stack"}
                  dataKey={column.label}
                  fill={column.color ? column.color : "#4fc3f7"}
                />
              );
            })}

            <XAxis dataKey="time" style={{ fontSize: "80%" }} />
            <YAxis style={{ fontSize: "90%" }} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

LineChartElement.propTypes = {
  columns: PropTypes.array,
  onLoadRequest: PropTypes.func,
};
