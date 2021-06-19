import React, {useState} from "react";
import TextField from "@material-ui/core/TextField";
import Button from "./Button";
import "./ObjectFiltering.css";
import {AiOutlineFilter} from "@react-icons/all-files/ai/AiOutlineFilter";
import DataTimePicker from "../datepickers/DateTimePicker";
import MenuItem from "@material-ui/core/MenuItem";

export default function ObjectFiltering({type, initDate, onFilterClick, initRefresh, onRefreshChange}) {

    const [fromDate, setFromDate] = useState(initDate.minDate);
    const [toDate, setToDate] = useState(initDate.maxDate);
    const [query, setQuery] = useState(initDate.where);

    function setRefreshRate(rate) {
        onRefreshChange(rate);
    }

    function onSetDateFrom(date) {
        localStorage.setItem(type+"DateFrom", JSON.stringify(date));
        setFromDate(date)
    }

    function onSetDateTo(date) {
        localStorage.setItem(type+"DateTo", JSON.stringify(date));
        setToDate(date)
    }

    function setQueryChange(ev) {
        setQuery(ev.target.value);
    }

    function onEnterPressed(ev) {
        if (ev.key === 'Enter') {
            onReady()
        }
    }

    function onReady() {
        localStorage.setItem(type+"Query", query);
        onFilterClick({
            from: fromDate,
            to: toDate,
            where: query
        })
    }

    return <section className="ObjectFiltering">
        <div>
            <TextField
                select
                variant="outlined"
                size="small"
                value={initRefresh}
                style={{width: 130, marginRight:5}}
                onChange={(ev) => setRefreshRate(ev.target.value)}
            >
                <MenuItem value={0} selected>No refresh</MenuItem>
                <MenuItem value={5}>5 seconds</MenuItem>
                <MenuItem value={15}>15 seconds</MenuItem>
                <MenuItem value={30}>30 seconds</MenuItem>
                <MenuItem value={60}>1 minute</MenuItem>
            </TextField>
        </div>
        <div className="Input">
            <TextField id="search-input" label="Filter"
                       value={query}
                       onKeyPressCapture={onEnterPressed}
                       onChange={setQueryChange}
                       size="small"
                       variant="outlined"
                       fullWidth
            />
        </div>
        <div className="Date">
            <DataTimePicker type="FromDate" datetime={fromDate} onDatetimeSelect={onSetDateFrom}/>
        </div>
        <div className="Date">
            <DataTimePicker type="ToDate" datetime={toDate} onDatetimeSelect={onSetDateTo}/>
        </div>
        <div className="Action">
            <Button label="Filter"
                    style={{padding: "8px 14px"}}
                    onClick={onReady}
                    icon={<AiOutlineFilter size={20} style={{marginRight: 5}}/>}/>
        </div>
    </section>
}