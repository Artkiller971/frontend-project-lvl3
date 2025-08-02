import './styles.scss'

const form = document.querySelector('form');
console.log(form)
form.addEventListener('submit', (e) => {
  e.preventDefault();
})