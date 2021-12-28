const calcBtn = document.querySelector('.calc-btn');

const hrsWorked = document.querySelectorAll('.hours-worked');


window.addEventListener('keypress', evt => {
  if(evt.key === 'Enter') handleCalculate();
});

calcBtn.addEventListener('click', handleCalculate);

function handleCalculate(evt) {
  const timesIn = document.querySelectorAll('.time-in')
  const timesOut = document.querySelectorAll('.time-out');
  const inTimes = convertInputs(timesIn, 'in');
  const outTimes = convertInputs(timesOut, 'out');

  clearErrs();
  const inputErrs = validInOut(inTimes, outTimes);

  if(inputErrs) {
    return notifyErrors(inputErrs);
  }

  calculateHrs(inTimes, outTimes);

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

  for(let i=0; i<14; i+=2) {
    const day = days[ i / 2 ];

    if (inTimes[i] >= 0 && outTimes[i] < 0) {
      errs.outs.push(i);
      errs.messages.push(`'Time Out' missing for ${day}`);
    }
    if (inTimes[i+1] >= 0 && outTimes[i+1] < 0) {
      errs.outs.push(i+1);
      errs.messages.push(`'Time Out' missing for ${day}`);
    }
 
    if (outTimes[i] >= 0 && inTimes[i] < 0) {
      errs.ins.push(i);
      errs.messages.push(`'Time In' missing for ${day}`);
    }

    if (outTimes[i+1] >= 0 && inTimes[i+1] < 0) {
      errs.ins.push(i+1);
      errs.messages.push(`'Time In' missing for ${day}`);
    } 

    if(inTimes[i] >= 0 && outTimes[i] >= 0) {
      if(inTimes[i] > outTimes[i]) {
        errs.outs.push(i);
        errs.messages.push(`Invalid 'Time Out' for ${day}`);
      }
    }
    
    if(inTimes[i+1] >= 0 && outTimes[i+1] >= 0) {
      if (inTimes[i+1] < outTimes[i]) {
        errs.ins.push(i+1);
        errs.messages.push(`Invalid 'Time In' for ${day}`);
      }
      if(inTimes[i+1] > outTimes[i+1]) {
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
    const addDay = plusDays[i / 2].checked;
    // don't include +1 day for the first time-in of each day
    const time0 = timeType === 'in' ? 
      convertToMins(timeInputs[i].value, false) :
      convertToMins(timeInputs[i].value, addDay);

    // second time in/out input of day
    const time1 = convertToMins(timeInputs[i+1].value, addDay);
    output.push(time0);
    output.push(time1);
  }
  return output;
}


// CONVERT TIME INPUT STRINGS TO NUMBERS
function convertToMins(str, plusDay = false) {
  // Add additional minutes if +1 day is checked
  const additionalMins = plusDay ? 1440 : 0; // 1440mins === 24hr
  let minutes = -1;

  if(str) {
    const splitStr = str.split(':');
    minutes = Math.floor(Number(splitStr[0]) * 60 + additionalMins);
    minutes += Number(splitStr[1]);
  }
  return minutes;
}


// CALCULATE HOURS WORKED
function calculateHrs(inTimes, outTimes) {
  let totalWeek = 0
  for (let i=0; i<14; i+=2) {
    let totalDay = 0
    if(inTimes[i])
      totalDay += outTimes[i] - inTimes[i];

    if(inTimes[i+1])
      totalDay += outTimes[i+1] - inTimes[i+1]

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

