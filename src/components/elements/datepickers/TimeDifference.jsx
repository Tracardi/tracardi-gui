import React from "react";
import {makeTzAwareDate} from "../../../misc/converters";

const TimeDifference = ({ date }) => {

  if(date === null) {
    return ""
  }

  const passedTime = getTimeDifference(date);

  const getSign = () => {
    if(passedTime.passed === "") {
      return "+"
    }
    return "-"
  }

  const render = () => {
    const sign = getSign()

    if (sign === '+') {
      return `${sign} ${passedTime.willHappen}`
    }

    return `${sign} ${passedTime.passed}`
  }

  return (
    <span style={{backgroundColor: 'rgba(128,149,196, 0.5)', color: 'rgba(0,0,0, 1)', padding: "1px 7px", borderRadius: 6}}>
      {render()}
    </span>
  );
};

function calcTimeDifference(present, eventDate) {

  let diff
  diff = eventDate - present;

  let plusMinus
  if(diff < 0) {
    plusMinus = -1
  } else {
    plusMinus = 1
  }

  diff = diff * plusMinus

  const seconds = Math.floor(diff / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  hours = hours - days * 24;
  minutes = minutes - days * 24 * 60 - hours * 60;

  return {
      days,
      hours,
      minutes,
      _willHappen: plusMinus > 0,
      _havePassed: plusMinus < 0,
    }
}

function getTimeDifference(date) {
  if (typeof date !== "string" || isNaN(new Date(date))) {
    return "";
  }

  date = makeTzAwareDate(date)

  const baseDate = new Date(date);
  const utc_base = Date.UTC(
      baseDate.getUTCFullYear(),
      baseDate.getUTCMonth(),
      baseDate.getUTCDate(),
      baseDate.getUTCHours(),
      baseDate.getUTCMinutes(),
      baseDate.getUTCSeconds()
  );
  const utc_present = Date.now()

  const { 
    days, 
    hours, 
    minutes, 
    _willHappen, 
    _havePassed 
  } = calcTimeDifference(utc_present, utc_base);

  const _days = `${Math.abs(days)}d`;
  const _hours = `${
    hours >= 1
      ? `${hours}h`
      : `${minutes}m`
  }`;

  return {
    willHappen: _willHappen ? (days > 0 ? `${_days} ${_hours}` : `${_hours}`) : "",
    passed: _havePassed ? (days > 0 ? `${_days} ${_hours}` : `${_hours}`) : "",
  };
}

export default TimeDifference;
