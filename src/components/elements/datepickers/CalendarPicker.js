import React, {useEffect, useState} from "react";
import PickyDateTime from "react-picky-date-time";
import "./CalendarPicker.css";
import moment from 'moment'
import PropTypes from "prop-types";

export default function CalendarPicker({onDateSelect, datetime}) {

    if(datetime.absolute === null) {
        const now = moment()
        datetime.absolute = {
            year: now.format("YYYY"),
            month: now.format("MM"),
            meridiem: now.format('a'),
            date: now.format("DD"),
            hour: now.format('hh'),
            minute: now.format('mm'),
            second: now.format("ss"),
        }
    }

    const [year, setYear] = useState(datetime?.absolute?.year);
    const [month, setMonth] = useState(datetime?.absolute?.month);
    const [meridiem, setMeridiem] = useState(datetime?.absolute?.meridiem);
    const [day, setDay] = useState(datetime?.absolute?.date);
    const [second, setSecond] = useState(datetime?.absolute?.second);
    const [minute, setMinute] = useState(datetime?.absolute?.minute);
    const [hour, setHour] = useState(datetime?.absolute?.hour);

    useEffect(() => {
        let date = {
            absolute: {
                year:year,
                month:month,
                meridiem:meridiem,
                date:day,
                hour:hour,
                minute:minute,
                second:second,
            },
            delta: null,
            now: null
        }
        onDateSelect(date);
    },[year, month, day, hour, minute, second, meridiem, onDateSelect])

    const onResetTime = (d) => {
        setHour(d?.clockHandHour?.value);
        setMinute(d?.clockHandMinute?.value);
        setSecond(d?.clockHandSecond?.value);
        setMeridiem(d?.meridiem);
    }

    const onResetDefaultTime = (d) => {
        setHour(d?.clockHandHour?.value);
        setMinute(d?.clockHandMinute?.value);
        setSecond(d?.clockHandSecond?.value);
        setMeridiem(d?.meridiem);
    }

    const onResetDefaultDate = (d) => {
        setDay(d?.date);
        setMonth(d?.month);
        setYear(d?.year);
    }

    const onResetDate = (d) => {
        setDay(d.date);
        setMonth(d.month);
        setYear(d.year);
    }

    const onClearTime = (d) => {
        setHour(d.clockHandHour.value);
        setMinute(d.clockHandMinute.value);
        setSecond(d.clockHandSecond.value);
        setMeridiem(d.meridiem);
    }

    return  <PickyDateTime
        size="xs"
        mode={1}
        show={true}
        locale="en-us"
        onClose={() => {}}
        defaultTime={`${hour}:${minute}:${second} ${meridiem}`} // OPTIONAL. format: "HH:MM:SS AM"
        defaultDate={`${month}/${day}/${year}`}
        onYearPicked={(d) => setYear(d.year)}
        onMonthPicked={(d) => setMonth(d.month)}
        onDatePicked={(d) => setDay(d.date)}
        onResetDate={onResetDate}
        onResetDefaultDate={onResetDefaultDate}
        onSecondChange={(d) => setSecond(d.value)}
        onMinuteChange={(d) => setMinute(d.value)}
        onHourChange={(d) => setHour(d.value)}
        onMeridiemChange={setMeridiem}
        onResetTime={onResetTime}
        onResetDefaultTime={onResetDefaultTime}
        onClearTime={onClearTime}
    />
}

CalendarPicker.propTypes = {
    datetime: PropTypes.object,
    onDateSelect: PropTypes.func,
  };