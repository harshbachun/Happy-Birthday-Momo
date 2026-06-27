const parallaxLily = document.querySelector('.header-lily');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  parallaxLily.style.transform = `translateX(-50%) translateY(${y * 0.1}px)`;
});


const giftBtn = document.getElementById('giftBtn');
const giftCard = document.getElementById('giftCard');
const giftOverlay = document.getElementById('giftOverlay');
const giftCloseBtn = document.getElementById('giftCloseBtn');

function openGift() {
  giftOverlay.classList.add('is-visible');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      giftCard.classList.add('is-visible');
    });
  });
  document.body.style.overflow = 'hidden';
}

function closeGift() {
  giftCard.classList.remove('is-visible');
  giftOverlay.classList.remove('is-visible');
  document.body.style.overflow = '';
}

giftBtn.addEventListener('click', openGift);
giftCloseBtn.addEventListener('click', closeGift);
giftOverlay.addEventListener('click', closeGift);

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeGift();
});