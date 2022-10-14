import React from "react";

const DaysPassed = ({ date }) => {
  const daysPassed = getDaysPassed(date);

  return (
    <div>
      {daysPassed.inPresent} {daysPassed.inFuture}
    </div>
  );
};

function calcDaysPassed(future, now) {
  const seconds = Math.floor((future - now) / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  hours = hours - days * 24;
  minutes = minutes - days * 24 * 60 - hours * 60;

  return { days, hours, minutes };
}

function buildDaysPassedString(type, data) {
  switch (type) {
    case "days":
      return `${data.days} ${data.days > 1 ? "days" : "day"}`;
    case "hours":
      return data.hours >= 1
        ? `${data.hours} ${data.hours > 1 ? "hours" : "hour"}`
        : `${data.minutes} ${data.minutes > 1 ? "minutes" : "minute"}`;
    default:
      return "";
  }
}

function getDaysPassed(date) {
  if (typeof date !== "string" || isNaN(new Date(date))) {
    console.error(`Invalid input, ${date} should be a date string.`);
    return "";
  }

  const past = new Date(date).getTime();
  const present = new Date(Date.now()).getTime();

  let future = new Date(present);
  future.setDate(future.getDate() + 1);
  future = future.getTime();

  // using present
  const {
    days: daysPassedInPresent,
    hours: hoursPassedInPresent,
    minutes: minutesPassedInPresent,
  } = calcDaysPassed(present, past);

  const daysInPresent = buildDaysPassedString("days", {
    days: daysPassedInPresent,
  });

  const hoursInPresent = buildDaysPassedString("hours", {
    hours: hoursPassedInPresent,
    minutes: minutesPassedInPresent,
  });

  // using future
  const {
    days: daysPassedInFuture,
    hours: hoursPassedInFuture,
    minutes: minutesPassedInFuture,
  } = calcDaysPassed(future, past);

  const daysInFuture = buildDaysPassedString("days", {
    days: daysPassedInFuture,
  });

  const hoursInFuture = buildDaysPassedString("hours", {
    hours: hoursPassedInFuture,
    minutes: minutesPassedInFuture,
  });

  return {
    inPresent:
      daysPassedInPresent >= 1
        ? `${daysInPresent} ${hoursInPresent}`
        : `${hoursInPresent}`,
    inFuture:
      daysPassedInFuture >= 1
        ? `${daysInFuture} ${hoursInFuture}`
        : `${hoursInFuture}`,
  };
}

export default DaysPassed;
