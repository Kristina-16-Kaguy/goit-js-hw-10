import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const inputEl = document.querySelector('#datetime-picker');
const startButton = document.querySelector('[data-start]');
const daysEl = document.querySelector('[data-days]');
const hoursEl = document.querySelector('[data-hours]');
const minutesEl = document.querySelector('[data-minutes]');
const secondsEL = document.querySelector('[data-seconds]');

startButton.disabled = true;
let userSelectedDate = null;
let intervalId;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    userSelectedDate = selectedDates[0].getTime();

    const currentTime = Date.now();

    if (userSelectedDate <= currentTime) {
      // window.alert('Please choose a date in the future');
      iziToast.error({
        title: 'Error',
        message: 'Please choose a date in the future',
        position: 'topRight',
      });

      startButton.disabled = true;
    } else {
      startButton.disabled = false;
    }
  },
};

flatpickr(inputEl, options);

function updateTimer() {
  let remainingTime = userSelectedDate - Date.now();

  if (remainingTime <= 0) {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    startButton.disabled = false;
    inputEl.disabled = false;
    setDateOnUi({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  } else {
    const dateObj = convertMs(remainingTime);
    setDateOnUi(dateObj);
  }
}

function setDateOnUi({ days, hours, minutes, seconds }) {
  daysEl.textContent = days.toString().padStart(2, '0');
  hoursEl.textContent = hours.toString().padStart(2, '0');
  minutesEl.textContent = minutes.toString().padStart(2, '0');
  secondsEL.textContent = seconds.toString().padStart(2, '0');
}

startButton.addEventListener('click', e => {
  startButton.disabled = true;
  inputEl.disabled = true;
  updateTimer();
  intervalId = setInterval(updateTimer, 1000);
});

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

console.log(convertMs(2000)); // {days: 0, hours: 0, minutes: 0, seconds: 2}
console.log(convertMs(140000)); // {days: 0, hours: 0, minutes: 2, seconds: 20}
console.log(convertMs(24140000)); // {days: 0, hours: 6 minutes: 42, seconds: 20}

// iziToast.show({
//   title: 'Привіт',
//   message: 'заміни мене на windows.alert',
// });
