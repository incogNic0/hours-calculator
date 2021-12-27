const calcBtn = document.querySelector('.calc-btn');
const shiftsIn = document.querySelectorAll('.shift-in')
const shiftsOut = document.querySelectorAll('.shift-out');
const breaksOut = document.querySelectorAll('.break-out');
const breaksIn = document.querySelectorAll('.break-in');
const hrsWorked = document.querySelectorAll('.hours-worked');

window.addEventListener('keypress', evt => {
  if(evt.key === 'Enter') handleCalculate();
});

calcBtn.addEventListener('click', handleCalculate);

function handleCalculate(evt) {
  const shiftErrors = validInOut(shiftsIn, shiftsOut);
  const breakErrors = validInOut(breaksIn, breaksOut);

  if(shiftErrors.messages.length) {
    notifyErrors(shiftErrors, 'shift');
  }
  if(breakErrors.messages.length) {
    notifyErrors(breakErrors, 'break');
  }

  const convertedTIs = Array.from(shiftsIn)
    .map(shiftIn => convertTime(shiftIn.value));
  const convertedTOs = Array.from(shiftsOut)
    .map(shiftOut => convertTime(shiftOut.value));
  const convertedBOs = Array.from(breaksOut)
    .map(breakOut => convertTime(breakOut.value))
  const convertedBIs = Array.from(breaksIn)
    .map(breakIn => convertTime(breakIn.value));

}

function convertTime(str) {
  if(!str) return null;
  const timeArr = str.split(':');
  return timeArr.map(numStr => Number(numStr))
}

function validInOut(inTimes, outTimes) {
  const errors = {
    inIndexs: [],
    outIndexs: [],
    messages: []
  }
  if(inTimes.length !== outTimes.length) {
    errors.messages.push('Unmatched in/out times');
  }
  for(let i=0; i<inTimes.length; i++) {
    if(inTimes[i] && !outTimes[i]) {
      errors.messages.push('Time Out required for entered Time In');
    }
    if(!inTimes[i] && outTimes[i]) {
      errors.messages.push('Time In required for entered Time Out')
    }
  }
  return errors;
}

function notifyErrors(errors, errType) {
  if(errType === 'shift') {
    errors.shifts.inIndexs
      .forEach( i => shiftsIn[i].classList.add('missing-required'));
    errors.shifts.outIndexs
      .forEach( i => shiftsOut[i].classList.add('missing-required'));
  }
  if(errType === 'break') {
    errors.breaks.inIndexs
      .forEach( i => breaksIn[i].classList.add('missing-required'));
    errors.breaks.outIndexs
      .forEach( i => breaksOut[i].classList.add('missing-required'));
  }
  errors.messages.forEach(msg => showMsg(msg) )
}

function showMsg(msg) {
  const errMsgs = document.querySelector('.error-messages');
  const node = document.createElement('P');
  const textNode = document.createTextNode(msg);
  node.appendChild(textNode)
  document.querySelector('.error-messages').appendChild(node);
}