import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', event => {
  event.preventDefault();
  const delay = event.target.elements.delay.value;

  if (delay < 0) {
    iziToast.error({
      title: 'Error',
      message: `invalid ${delay} value`,
    });
  }
  const radioBtn = event.target.elements.state.value;
  event.target.reset();
  new Promise((resolve, reject) => {
    setTimeout(() => {
      if (radioBtn === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    });
  }, delay)
    .then(delay => {
      iziToast.success({
        title: 'OK',
        message: `✅ Fulfilled promise in ${delay}ms`,
        position: 'topRight',
      });
    })
    .catch(delay => {
      iziToast.error({
        title: 'Error',
        message: `❌ Rejected promise in ${delay}ms`,
        position: 'topRight',
      });
    });
});
