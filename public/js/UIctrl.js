const UIctrl = (function() {
  const mainContent = document.getElementById('main-content');
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ]

  // -------- CREATE HEADER | START -------------
  // CONTAINER
  function createHeader(day) {
    const container = document.createElement('div');
  
    const headerTitle = createHeaderTitle(day);
    const headerInput = createHeaderInput(day);

    container.appendChild(headerTitle);
    container.appendChild(headerInput);

  
    return container;
  }
  
  // DAY AND TIME WORKED
  function createHeaderTitle(day) {
    const title = document.createElement('h3');
    const hoursText = document.createElement('span');
  
    title.classList.add('day');
    title.textContent = `${day}: `
  
    hoursText.id = `total-time-${day}`;
    hoursText.textContent = '0';
  
  
    title.append(hoursText);
  
    return title;
  }
  
  // CHECKBOX FOR '+1 DAY'
  function createHeaderInput(day) {
    const container = document.createElement('div');
    container.classList.add('plus-day')
  
    const checkbox = document.createElement('input')
    checkbox.id = `checkbox-${day}`
    checkbox.type = 'checkbox'
    checkbox.checked = false;
    checkbox.classList.add('plus-day-input')
  
    const label = document.createElement('span')
    label.textContent = '+1 day';
  
    container.appendChild(checkbox);
    container.appendChild(label);
  
    return container
  }
  //------------ CREATE HEADER | END ----------------
  
  
  //----------- CREATE TABLE | START ---------------
  // TIME IN/OUT COLUMN LABELS
  function createTableHead() {
    const head = document.createElement('thead');
    const row = document.createElement('tr');
    const timeIn = document.createElement('th');
    const timeOut = document.createElement('th');
  
    timeIn.textContent = 'Time In';
    timeOut.textContent = 'Time Out';
  
    row.appendChild(timeIn);
    row.appendChild(timeOut);
  
    head.appendChild(row);
  
    return head;
  }
  
  // CREATE TIME INPUT
  function createTimeInput(day, timeEvt) {
    const tData = document.createElement('td');
  
    const timeInput = document.createElement('input');
    timeInput.type = 'time';
    timeInput.setAttribute(`data-${timeEvt}`, day);
  
    tData.appendChild(timeInput);
  
    return tData
  }
  
  // CREATE ROW OF TIME IN/OUT INPUTS
  function createTimeRow(day) {
    const row = document.createElement('tr');
  
    const timeIn = createTimeInput(day, 'time-in');
    const timeOut = createTimeInput(day, 'time-out');
  
    row.appendChild(timeIn);
    row.appendChild(timeOut);
    
    return row;
  }
  
  // TIME IN/OUT INPUTS
  function createTableBody(day) {
    const body = document.createElement('tbody');
  
    const timeRow1 = createTimeRow(day);
    const timeRow2 = createTimeRow(day);
  
    body.appendChild(timeRow1);
    body.appendChild(timeRow2);
  
    return body;
  }
  
  // TIME INPUT TABLE FOR DAY
  function createInputTable(day) {
    const inputTable = document.createElement('table');
  
    const header = createTableHead();
    const body = createTableBody(day);
  
    inputTable.appendChild(header);
    inputTable.appendChild(body);
  
    return inputTable;
  }
  //------------ CREATE TABLE | END -----------------
  

  // CREATE DAY CONTENT
  const createDayContent = (day) => {
    const container = document.createElement('div');
    const header = createHeader(day);
  
    const inputTable = createInputTable(day);
  
    container.appendChild(header);
    container.appendChild(inputTable);
  
    return container;
  }
  
  // CREATE MAIN CONTENT
  function loadMainContent() {
    for (const day of days) {
      const dayContent = createDayContent(day);
      mainContent.appendChild(dayContent);
    }
  }

    // DISPLAY TOTAL TIME
  function displayTotal(totalMins, day) {
    const hours = Math.floor(totalMins / 60);
    const minutes = totalMins % 60;

    const currentDay = day || 'week';
    const timeDisplay = document.querySelector(`#total-time-${currentDay}`);

    timeDisplay.textContent = `${hours}h${minutes}m`;
  }

    // ------------ DISPLAY ERRORS | START -------------

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


  // HIGHLIGHT INVALID/MISSING INPUTS
  function displayErrors(errs) {
    // All errors for the day
    for(const err of errs.details) {
      const inputs = document.querySelectorAll(`[data-${err.event}=${errs.day}]`);
      inputs[err.index].classList.add('missing-invalid');

      showErr(err.message);
    }
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
  // ----------- DISPLAY ERRORS | END ---------------------
  return { loadMainContent, displayTotal, clearErrs, displayErrors };
})();