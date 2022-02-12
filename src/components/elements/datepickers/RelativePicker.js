import React, {useEffect, useState} from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import PropTypes from "prop-types";

export default function RelativePicker({type, onDateSelect, datetime}) {

    const defaultType = type==="FromDate" ? "minus" : "plus";
    const [periodType, setPeriodType] = useState((datetime?.delta?.type) ? datetime.delta.type : defaultType);
    const [period, setPeriod] = useState((datetime?.delta?.value) ? datetime.delta.value : 15  * ((defaultType==="minus") ? -1 : 1));
    const [periodEntity, setPeriodEntity] = useState((datetime?.delta?.entity) ? datetime.delta.entity : "minute");

    useEffect(() => {
        const date = {
            absolute: null,
            delta: {
                type: periodType,
                value: period * ((periodType==="minus" && period > 0) ? -1 : 1),
                entity: periodEntity
            },
            now: null
        }
        onDateSelect(date);
    }, [periodType, period, periodEntity, onDateSelect])

    return <div className="PeriodPicker">
        <div className="PeriodHeader">
            Select period
        </div>
        <div className="PeriodForm">

            <span style={{margin: 10, fontSize: "1.5em", textTransform: "uppercase"}}>{defaultType}</span>

            <TextField
                id="standard-number"
                type="number"
                variant="outlined"
                size="small"
                value={period}
                onChange={(ev) => setPeriod(ev.target.value)}
                InputLabelProps={{
                    shrink: true,
                }}
                InputProps={{
                    inputProps: {
                        [periodType==='minus' ? 'max' : 'min']: 0
                    }
                }}
                style={{width: 100, margin: 2}}
            />
            <TextField
                select
                variant="outlined"
                size="small"
                value={periodEntity}
                style={{width: 150}}
                onChange={(ev) => setPeriodEntity(ev.target.value)}
            >
                <MenuItem value={"minute"} selected>Minutes</MenuItem>
                <MenuItem value={"hour"}>Hours</MenuItem>
                <MenuItem value={"day"}>Days</MenuItem>
                <MenuItem value={"week"}>Weeks</MenuItem>
                <MenuItem value={"month"}>Months</MenuItem>
                <MenuItem value={"year"}>Years</MenuItem>
            </TextField>
        </div>
        <div className="PeriodsList">
            <div>
                <div><span onClick={() => {
                    setPeriodType(defaultType);
                    setPeriodEntity('minute');
                    setPeriod(15)
                }}>{defaultType} 15 minutes</span></div>
                <div><span onClick={() => {
                    setPeriodType(defaultType);
                    setPeriodEntity('minute');
                    setPeriod(30)
                }}>{defaultType} 30 minutes</span></div>
                <div><span onClick={() => {
                    setPeriodType(defaultType);
                    setPeriodEntity('hour');
                    setPeriod(1)
                }}>{defaultType} 1 hour</span></div>
                <div><span onClick={() => {
                    setPeriodType(defaultType);
                    setPeriodEntity('hour');
                    setPeriod(3)
                }}>{defaultType} 3 hours</span></div>
                <div><span onClick={() => {
                    setPeriodType(defaultType);
                    setPeriodEntity('hour');
                    setPeriod(8)
                }}>{defaultType} 8 hours</span></div>
                <div><span onClick={() => {
                    setPeriodType(defaultType);
                    setPeriodEntity('hour');
                    setPeriod(12)
                }}>{defaultType} 12 hours</span></div>
            </div>
            <div>
                <div><span onClick={() => {
                    setPeriodType(defaultType);
                    setPeriodEntity('day');
                    setPeriod(1)
                }}>{defaultType} day</span></div>
                <div><span onClick={() => {
                    setPeriodType(defaultType);
                    setPeriodEntity('day');
                    setPeriod(2)
                }}>{defaultType} 2 days</span></div>
                <div><span onClick={() => {
                    setPeriodType(defaultType);
                    setPeriodEntity('week');
                    setPeriod(1)
                }}>{defaultType} week</span></div>
                <div><span onClick={() => {
                    setPeriodType(defaultType);
                    setPeriodEntity('week');
                    setPeriod(2)
                }}>{defaultType} 2 weeks</span></div>
                <div><span onClick={() => {
                    setPeriodType(defaultType);
                    setPeriodEntity('month');
                    setPeriod(1)
                }}>{defaultType} month</span></div>
                <div><span onClick={() => {
                    setPeriodType(defaultType);
                    setPeriodEntity('year');
                    setPeriod(1)
                }}>{defaultType} year</span></div>
            </div>
        </div>

    </div>
}

RelativePicker.propTypes = {
    datetime: PropTypes.object,
    onDateSelect: PropTypes.func,
    type: PropTypes.string,
  };