const cards = [...document.querySelectorAll('.shot-card')];
const mainShot = document.querySelector('#main-shot');
const fullImageLink = document.querySelector('#full-image-link');
const sourceLink = document.querySelector('#source-link');
const number = document.querySelector('#shot-number');
const title = document.querySelector('#shot-title');
const description = document.querySelector('#shot-description');
const sourceBase = 'https://github.com/block/buzz/blob/ebe99a46e8802b9ff20fdf6a1028ce93bdefaa43/docs/assets/screenshots/';

for (const card of cards) {
  card.addEventListener('click', () => {
    for (const item of cards) {
      item.classList.toggle('is-active', item === card);
      item.setAttribute('aria-pressed', String(item === card));
    }
    mainShot.src = card.dataset.src;
    mainShot.alt = card.dataset.alt;
    fullImageLink.href = card.dataset.src;
    fullImageLink.setAttribute('aria-label', `在新窗口打开${card.dataset.title}的截图原图`);
    sourceLink.href = sourceBase + card.dataset.source;
    number.textContent = card.dataset.number;
    title.textContent = card.dataset.title;
    description.textContent = card.dataset.description;
  });
}
