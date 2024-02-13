import React, {useCallback, useState} from "react";
import {useDispatch} from "react-redux";
import {resetPage} from '../../../redux/reducers/pagingSlice'
import Button from "./Button";
import "./ObjectFiltering.css";
import {AiOutlineFilter} from "react-icons/ai";
import PropTypes from 'prop-types';
import {external} from "../misc/linking"
import KqlAutoCompleteRange from "./KqlAutoCompleteRange";

export default function ObjectFiltering({type, initDate, onFilterClick, initRefresh, onRefreshChange}) {

    const [fromDate, setFromDate] = useState(initDate?.minDate);
    const [toDate, setToDate] = useState(initDate?.maxDate);
    const [query, setQuery] = useState(initDate?.where);

    const dispatch = useDispatch();

    const onSetDateFrom = useCallback((date) => {
        localStorage.setItem(type + "DateFrom", JSON.stringify(date));
        setFromDate(date);
    }, [type])

    const onSetDateTo = useCallback((date) => {
        localStorage.setItem(type + "DateTo", JSON.stringify(date));
        setToDate(date)
    }, [type]);

    function handleQueryChange(value) {
        setQuery(value);
    }

    function handleEnterPressed(ev) {
        if (ev.key === 'Enter') {
            handleReady()
        }
    }

    function handleReady() {
        console.log({
            from: fromDate,
            to: toDate,
            where: query,
        })
        localStorage.setItem(type + "Query", query);
        dispatch(resetPage());
        onFilterClick({
            from: fromDate,
            to: toDate,
            where: query,
        })
    }

    return <section className="ObjectFiltering">
        <div className="Input">
            <KqlAutoCompleteRange index={type}
                                  value={query}
                                  initDate={initDate}
                                  refreshInterval={initRefresh}
                                  onChange={handleQueryChange}
                                  onKeyPressCapture={handleEnterPressed}
                                  onSetDateFrom={onSetDateFrom}
                                  onSetDateTo={onSetDateTo}
                                  onRefreshChange={onRefreshChange}

            />
            <div style={{fontSize: 12}}>Do not know how to filter. Click <span style={{textDecoration: "underline", cursor: "pointer"}} onClick={external("http://docs.tracardi.com/running/filtering/", true)}>here</span> for information.</div>
        </div>
        <div className="Action">
            <Button label="Filter"
                    style={{margin:"0 0 0 5px", height: 48}}
                    onClick={handleReady}
                    icon={<AiOutlineFilter size={20} style={{marginRight: 5, height: 27}}/>}/>

        </div>
    </section>
}

ObjectFiltering.propTypes = {
    type: PropTypes.string,
    initDate: PropTypes.object,
    onFilterClick: PropTypes.func,
    initRefresh: PropTypes.number,
    onRefreshChange: PropTypes.func
}