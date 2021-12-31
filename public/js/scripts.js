const calcBtn = document.querySelector('.calc-btn');

UIctrl.loadMainContent();

window.addEventListener('keypress', evt => {
  if(evt.key === 'Enter') handleCalculate();
});

calcBtn.addEventListener('click', handleCalculate);

function handleCalculate(evt) {
  const days = [
    'sunday',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday'
  ];
  let totalMinsWeek = 0

  // Clear any proir error notifications
  UIctrl.clearErrs();

  for (const day of days) {
    const plusDay = document.querySelector(`#checkbox-${day}`).checked;
    let timeValues = Calc.getInputValues(day);

    if(plusDay) timeValues = Calc.adjustTimes(timeValues);

    const errs = Calc.validateData(timeValues, day);
    if(errs) return UIctrl.displayErrors(errs);

    const totalMinsDay = Calc.calculateHrs(timeValues);

    if (totalMinsDay > 0) UIctrl.displayTotal(totalMinsDay, day);

    totalMinsWeek += totalMinsDay
  }

  if(totalMinsWeek > 0) UIctrl.displayTotal(totalMinsWeek);
}