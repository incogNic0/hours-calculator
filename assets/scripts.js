const calcBtn = document.querySelector('.calc-btn');
const timesIn = document.querySelectorAll('.time-in')
const timesOut = document.querySelectorAll('.time-out');
const hrsWorked = document.querySelectorAll('.hours-worked');


window.addEventListener('keypress', evt => {
  if(evt.key === 'Enter') handleCalculate();
});

calcBtn.addEventListener('click', handleCalculate);

function handleCalculate(evt) {
  clearErrs();
  const inputErrs = validInOut(timesIn, timesOut);

  if(inputErrs.messages.length) {
    notifyErrors(inputErrs);
  }

  const convertedIns = Array.from(timesIn)
    .map(inTime => convertTime(inTime.value));

  const convertedOuts = Array.from(timesOut)
    .map(outTime => convertTime(outTime.value));

}

function convertTime(str) {
  if(!str) return null;
  const timeArr = str.split(':');
  return timeArr.map(numStr => Number(numStr))
}

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
    inIndexs: [],
    outIndexs: [],
    messages: []
  }

  for(let i=0; i<inTimes.length; i++) {
    const day = days[Math.floor(i / 2)];
    if(inTimes[i].value && !outTimes[i].value) {
      errs.outIndexs.push(i);
      errs.messages.push(`'Time Out' missing for ${day}`);
    }
    if(outTimes[i].value && !inTimes[i].value) {
      errs.inIndexs.push(i);
      errs.messages.push(`'Time In' missing for ${day}`);
    }
  }

  return errs;
}

function notifyErrors(errs) {
  errs.inIndexs
    .forEach( i => timesIn[i].classList.add('missing-required'));
  errs.outIndexs
    .forEach( i => timesOut[i].classList.add('missing-required'));

  errs.messages.forEach( msg => showErr(msg) )
}

function showErr(msg) {
  const errMsgs = document.querySelector('.error-messages');
  const node = document.createElement('P');
  const textNode = document.createTextNode(msg);
  node.appendChild(textNode)
  document.querySelector('.error-messages').appendChild(node);
  errMsgs.classList.add('show-errors');
}

function clearErrs() {
  const errMsgs = document.querySelector('.error-messages');
  const missingInputs = document.querySelectorAll('.missing-required');
  for(const elem of missingInputs) {
    elem.classList.remove('missing-required');
  }
  while(errMsgs.firstChild) {
    errMsgs.removeChild(errMsgs.firstChild);
  }
  errMsgs.classList.remove('show-errors')
  window.scrollTo(0,0);
}