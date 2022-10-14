import React from "react";

const TimeDifference = ({ date }) => {
  const days = getTimeDifference(date);
  return (
    <div>
      {`passed ${days.passed !== "" ? days.passed : "0 days"}, will happen in ${
        days.willHappen !== "" ? days.willHappen : "0 days"
      }`}
    </div>
  );
};

function calcTimeDifference(present, baseDate) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const diff = baseDate - present;
  const _days = Math.floor(diff / day);

  if (_days <= -1) {
    const seconds = Math.floor((present.getTime() - baseDate.getTime()) / 1000);
    let minutes = Math.floor(seconds / 60);
    let hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    hours = hours - days * 24;
    minutes = minutes - days * 24 * 60 - hours * 60;

    return {
      days,
      hours,
      minutes,
      _willHappen: _days >= 0,
      _havePassed: _days <= -1,
    };
  }

  if (_days >= 0) {
    const days = Math.abs(_days);
    const hours = Math.abs(Math.floor((diff % day) / hour));
    const minutes = Math.abs(Math.floor((diff % hour) / minute)) + 1;

    return {
      days,
      hours,
      minutes,
      _willHappen: _days >= 0,
      _havePassed: _days <= -1,
    };
  }
}

function getTimeDifference(date) {
  if (typeof date !== "string" || isNaN(new Date(date))) {
    console.error(`Invalid input, ${date} should be a date string.`);
    return "";
  }

  const baseDate = new Date(date);
  const present = new Date(Date.now());

  const { 
    days, 
    hours, 
    minutes, 
    _willHappen, 
    _havePassed 
  } = calcTimeDifference(present, baseDate);

  const _days = `${Math.abs(days)} ${Math.abs(days) > 1 ? "days" : "day"}`;
  const _hours = `${
    hours >= 1
      ? `${hours} ${hours > 1 ? "hours" : "hour"}`
      : `${minutes} ${minutes > 1 ? "minutes" : "minute"}`
  }`;

  return {
    willHappen: _willHappen ? (days > 0 ? `${_days} ${_hours}` : `${_hours}`) : "",
    passed: _havePassed ? (days > 0 ? `${_days} ${_hours}` : `${_hours}`) : "",
  };
}

export default TimeDifference;
