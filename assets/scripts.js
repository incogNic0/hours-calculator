const calcBtn = document.querySelector('.calc-btn');

const hrsWorked = document.querySelectorAll('.hours-worked');


window.addEventListener('keypress', evt => {
  if(evt.key === 'Enter') handleCalculate();
});

calcBtn.addEventListener('click', handleCalculate);

function handleCalculate(evt) {
  const timesIn = document.querySelectorAll('.time-in')
  const timesOut = document.querySelectorAll('.time-out');
  const convertedIns = convertInputs(timesIn, 'in');
  const convertedOuts = convertInputs(timesOut, 'out');
  let totalHrs = 0;

  clearErrs();
  const inputErrs = validInOut(convertedIns, convertedOuts);

  if(inputErrs) {
    return notifyErrors(inputErrs);
  }

  calculateHrs(convertedIns, convertedOuts);

}

// CLEAR ALL ERROR NOTIFICATIONS
function clearErrs() {
  const errMsgs = document.querySelector('.error-messages');
  const missingInputs = document.querySelectorAll('.missing-invalid');
  for(const elem of missingInputs) {
    elem.classList.remove('missing-invalid');
  }
  while(errMsgs.firstChild) {
    errMsgs.removeChild(errMsgs.firstChild);
  }
  errMsgs.classList.remove('show-errors')
  window.scrollTo(0,0);
}

// VALIDATE TIME INPUTS
function validInOut(inTimes, outTimes) {
  const days = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ]
  const errs = {
    ins: [],
    outs: [],
    messages: []
  }
  let isErrors;

  for(let i=0; i<14; i+=2) {
    const day = days[ i / 2 ];

    if (inTimes[i] && !outTimes[i]) {
      errs.outs.push(i);
      errs.messages.push(`'Time Out' missing for ${day}`);
    }
    if (inTimes[i+1] && !outTimes[i+1]) {
      errs.outs.push(i+1);
      errs.messages.push(`'Time Out' missing for ${day}`);
    }
 
    if (outTimes[i] && !inTimes[i]) {
      errs.ins.push(i);
      errs.messages.push(`'Time In' missing for ${day}`);
    }

    if (outTimes[i+1] && !inTimes[i+1]) {
      errs.ins.push(i+1);
      errs.messages.push(`'Time In' missing for ${day}`);
    } 

    if( inTimes[i] && outTimes[i]) {
      if(inTimes[i].hour > outTimes[i].hour) {
        errs.outs.push(i);
        errs.messages.push(`Invalid 'Time Out' for ${day}`);
      }
    }
    
    if(inTimes[i+1] && outTimes[i+1]) {
      if (inTimes[i+1].hour < outTimes[i].hour) {
        errs.ins.push(i+1);
        errs.messages.push(`Invalid 'Time In' for ${day}`);
      }
      if(inTimes[i+1].hour > outTimes[i+1].hour) {
        errs.outs.push(i+1);
        errs.messages.push(`Invalid 'Time Out' for ${day}`);
      }
    }
  }

  return errs.messages.length ? errs : false;
}

// HIGHLIGHT INVALID/MISSING INPUTS
function notifyErrors(errs) {
  const timesIn = document.querySelectorAll('.time-in');
  const timesOut = document.querySelectorAll('.time-out'); 
  errs.ins
    .forEach( i => timesIn[i].classList.add('missing-invalid'));
  errs.outs
    .forEach( i => timesOut[i].classList.add('missing-invalid'));

  errs.messages.forEach( msg => showErr(msg) )
}

// DISPLAY ERROR MESSAGES
function showErr(msg) {
  const errMsgs = document.querySelector('.error-messages');
  const node = document.createElement('P');
  const textNode = document.createTextNode(msg);
  node.appendChild(textNode)
  document.querySelector('.error-messages').appendChild(node);
  errMsgs.classList.add('show-errors');
}


// CONVERT TIME INPUTS
function convertInputs(timeInputs, timeType = 'in') {
  const plusDays = document.querySelectorAll('.plus-day-checkbox');
  const output = [];
  for (let i=0; i<14; i+=2) {
    const addHrs = plusDays[i / 2].checked;
    // first time in/out input of day
    // don't include +1 day for the first time-in of each day
    const time0 = timeType === 'in' ? 
      convertTime(timeInputs[i].value, false) :
      convertTime(timeInputs[i].value, addHrs);

    // second time in/out input of day
    const time1 = convertTime(timeInputs[i+1].value, addHrs);
    output.push(time0);
    output.push(time1);
  }
  return output;
}


// CONVERT TIME INPUT STRINGS TO NUMBERS
function convertTime(str, plusDay = false) {
  // Add additional hours if +1 day is checked
  const addHrs = plusDay ? 24 : 0;
  let output;

  if(str) {
    const splitStr = str.split(':');
    output = {};
    output.hour = Number(splitStr[0]) + addHrs;
    output.minutes = Number(splitStr[1]);
  }
  return ( output ? output : null);
}


// CALCULATE HOURS WORKED
function calculateHrs(inTimes, outTimes) {
  let totalWeek = 0
  for (let i=0; i<14; i+=2) {
    let totalDay = 0
    if(inTimes[i])
      totalDay = calcTimeWorked(inTimes[i], outTimes[i])

    if(inTimes[i+1])
      totalDay += calcTimeWorked(inTimes[i+1], outTimes[i+1]);

    if (totalDay > 0) {
      const totalHrs = Math.floor(totalDay / 60);
      const totalMins = totalDay % 60;
      document.querySelectorAll('.hours-worked')[i / 2].textContent = 
      `${totalHrs}h${totalMins}m`
    }
    totalWeek += totalDay;
  }
  if (totalWeek > 0) {
    const totalHrs = Math.floor(totalWeek / 60);
    const totalMins = totalWeek % 60;
    document.querySelector('.total-hours').textContent = 
    `${totalHrs}h${totalMins}m`
  }
}

function calcTimeWorked(inTime, outTime) {
  const minutesIn = inTime.hour * 60 + inTime.minutes;
  const minutesOut = outTime.hour * 60 + outTime.minutes;

  return minutesOut - minutesIn;
}

const foo = {
  hour: 8,
  minutes: 50
}
const barr = {
  hour: 10,
  minutes: 10
}
