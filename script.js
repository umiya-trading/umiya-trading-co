const track = document.getElementById('sliderTrack');
const dotsContainer = document.getElementById('sliderDots');

let currentSlide = 0;
let slides = [];
let dots = [];
let slideInterval = null;

async function loadImagesAuto() {
  const maxImagesToTest = 50;
  const extensions = ['jpeg', 'jpg', 'png'];
  const validImages = [];

  const checkImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(src);
      img.onerror = () => resolve(null);
      img.src = src;
    });
  };

  for (let i = 1; i <= maxImagesToTest; i++) {
    for (const ext of extensions) {
      const path = `Images/${i}.${ext}`;
      const loadedSrc = await checkImage(path);
      if (loadedSrc) {
        validImages.push(loadedSrc);
        break;
      }
    }
  }

  if (validImages.length === 0) return;

  validImages.forEach((src, index) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide' + (index === 0 ? ' active' : '');
    // Creates adaptive blurred backdrop + clear foreground
    slide.innerHTML = `
      <img class="slide-bg" src="${src}" alt="" aria-hidden="true">
      <img class="slide-main" src="${src}" alt="Showcase ${index + 1}" loading="lazy">
    `;
    track.appendChild(slide);

    const dot = document.createElement('span');
    dot.className = 'dot' + (index === 0 ? ' active' : '');
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });

  slides = document.querySelectorAll('.carousel-slide');
  dots = document.querySelectorAll('.dot');
  startAutoSlide();
}

function showSlide(index) {
  if (!slides.length) return;
  slides.forEach((s, i) => {
    s.classList.toggle('active', i === index);
    dots[i].classList.toggle('active', i === index);
  });
  currentSlide = index;
}

function nextSlide() {
  if (!slides.length) return;
  let next = (currentSlide + 1) % slides.length;
  showSlide(next);
}

function changeSlide(direction) {
  clearInterval(slideInterval);
  let next = (currentSlide + direction + slides.length) % slides.length;
  showSlide(next);
  startAutoSlide();
}

function goToSlide(index) {
  clearInterval(slideInterval);
  showSlide(index);
  startAutoSlide();
}

function startAutoSlide() {
  clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 3500);
}

const wrapper = document.querySelector('.carousel-wrapper');
if (wrapper) {
  wrapper.addEventListener('mouseenter', () => clearInterval(slideInterval));
  wrapper.addEventListener('mouseleave', startAutoSlide);
}

loadImagesAuto();