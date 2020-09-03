const modal = document.querySelector('.main-modal');
const closeButton = document.querySelectorAll('.modal-close');
const modalClose = () => {
  modal.classList.remove('opacity-100');
  modal.classList.add('opacity-0');
  setTimeout(() => {
    modal.classList.remove('duration-500');
    modal.style.display = 'none';
  }, 500);
}
const openModal = () => {
  modal.style.display = 'flex';
  modal.classList.add('duration-500');
  setTimeout(() => {
    modal.classList.remove('opacity-0');
    modal.classList.add('opacity-100');
  }, 100)
}
for (let i = 0; i < closeButton.length; i++) {
  const elements = closeButton[i];
  elements.onclick = (e) => modalClose();
  modal.style.display = 'none';
  window.onclick = function (event) {
    if (event.target == modal) modalClose();
  }
}