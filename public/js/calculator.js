const Calc = (function() { 

  //------- GET, CONVERT, & VALIDATE INPUTS | START--------

  // GET TIMES
  function getInputValues(day) {
    const timesIn = document.querySelectorAll(`[data-time-in=${day}]`);
    const timesOut = document.querySelectorAll(`[data-time-out=${day}]`);
    const timeValues = {
      in: [],
      out: []
    }

    timeValues.in = Array.from(timesIn)
      .map( input => convertTimeValue(input.value));

    timeValues.out = Array.from(timesOut)
      .map( input => convertTimeValue(input.value));

    return timeValues;
  }

  // CONVERT TIME STRING TO NUMBER
  function convertTimeValue(val) {
    if(!val) return null; // no time entered
    const valArr = val.split(':');
    const hours = Number(valArr[0]);
    const minutes = Number(valArr[1]);

    // Total minutes into the day
    return hours * 60 + minutes;
  }

  // CHECK FOR MISSING TIME INPUTS
  function validateData(vals, day) {
    class InputError {
      constructor(msg, event, index) {
        this.message = msg,
        this.event = event,
        this.index = index
      }
    }
    const capDay = day[0].toUpperCase() + day.slice(1);

    const errs = {
      day,
      details: []
    }
    const missingIn = `Missing 'Time In' for ${capDay}`
    const missingOut = `Missing 'Time Out' for ${capDay}`
    const invalidIn = `Invalid 'Time In' for ${capDay}`;
    const invalidOut = `Invalid 'Time Out' for ${capDay}`;

    const firstIn = vals.in[0];
    const firstOut = vals.out[0];
    const secondIn = vals.in[1];
    const secondOut = vals.out[1];
  
    if (firstIn === null && firstOut !== null)
      errs.details.push(new InputError(missingIn, 'time-in', 0));

    if (secondIn === null && secondOut !== null)
      errs.details.push(new InputError(missingIn, 'time-in', 1));

    if (firstOut === null && firstIn !== null)
      errs.details.push(new InputError(missingOut, 'time-out', 0));

    if (secondOut === null && secondIn !== null)
      errs.details.push(new InputError(missingOut, 'time-out', 1));

    if (firstOut !== null && firstOut < firstIn )
      errs.details.push(new InputError(invalidOut, 'time-out', 0));
    
    if (secondIn !== null && secondIn < firstOut)
      errs.details.push(new InputError(invalidIn, 'time-in', 1));
    
    if (secondOut !== null && secondOut < secondIn)
      errs.details.push(new InputError(invalidOut, 'time-out', 1));

    return errs.details.length ? errs : null;
  }

  // ADJUST TIMES THAT CARRY INTO NEXT DAY
  function adjustTimes(times) {
    const addMins = 1440 // num minutes in 24 hours
    const firstIn = times.in[0];
    const firstOut = times.out[0];
    const secondIn = times.in[1];
    const secondOut = times.out[1];

    const adjusted = {
      in: [...times.in],
      out: [...times.out]
    }

    if(firstOut !== null && firstOut < firstIn) {
      // Change firstOut, secondIn, secondOut
      adjusted.out[0] += addMins;
      adjusted.in[1] = secondIn !== null ? secondIn + addMins : null;
      adjusted.out[1] = secondOut !== null ? secondOut + addMins : null;

    } else if (secondIn !==null && secondIn < firstOut) {
      // Ajust secondIn and secondOut
      adjusted.in[1] += addMins;
      adjusted.out[1] = secondOut !==null ? secondOut + addMins : null;

    } else if (secondOut !==null && secondOut < secondIn) {
      // Adjust secondOut only
      adjusted.out[1] += addMins;

    } else {};

    return adjusted;
  }
  // ----------- GET, CONVERT, & VALIDATE INPUTS | END ---------

  // CALCULATE HOURS WORKED
  function calculateHrs(vals) {
    let totalDay = 0;
    totalDay += vals.out[0] - vals.in[0];
    totalDay += vals.out[1] - vals.in[1];

    return totalDay;
  }

  return { getInputValues, validateData, adjustTimes, calculateHrs };

})();