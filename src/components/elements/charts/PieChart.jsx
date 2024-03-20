import React, {PureComponent} from 'react';
import {PieChart, Pie, Sector, ResponsiveContainer, Cell} from 'recharts';
import {abbreviateNumber} from "../../../misc/converters";
import CenteredCircularProgress from "../progress/CenteredCircularProgress";

const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 20) * cos;
    const my = cy + (outerRadius + 20) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 5;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
        <g>
            <text x={cx} y={cy} dy={6} textAnchor="middle" fill={fill} style={{fontSize: 9}}>
                {payload.name}
            </text>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333" style={{fontSize: 12}}>{abbreviateNumber(value)}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={12} textAnchor={textAnchor} fill="#999" style={{fontSize: 8}}>
                {`(${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    );
};


export class TuiPieChart extends PureComponent {

    state = {
        activeIndex: 0,
    };

    onPieEnter = (_, index) => {
        this.setState({
            activeIndex: index,
        });
    };

    render() {
        return (
            <ResponsiveContainer width="100%" height="100%">
                <PieChart width={200} height={200}>
                    <Pie
                        stroke="rgba(128,128,128, .4)"
                        activeIndex={this.state.activeIndex}
                        activeShape={renderActiveShape}
                        data={this.props.data}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        dataKey="value"
                        onMouseEnter={this.onPieEnter}
                    >
                        {this.props?.data && this.props.data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={(!this.props?.colors) ? "#0088FE" : this.props.colors[index % this.props.colors.length]} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>
        );
    }
}

export function LoadablePieChart ({loading, data, header, subHeader = null, fill = "#1976d2", colors, paddingTop = 20}) {
    return <div style={{paddingTop: paddingTop}}>
        {header && <header style={{display: "flex", justifyContent: "center",  fontSize: "130%", fontWeight: 400}}>{header}</header>}
        {subHeader &&
        <header style={{display: "flex", justifyContent: "center", fontSize: "90%"}}>{subHeader}</header>}
        <div style={{width: "100%", height: 200}}>
            {!loading && <TuiPieChart data={data} fill={fill} colors={colors}/>}
            {loading && <CenteredCircularProgress/>}
        </div>
    </div>

}