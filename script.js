'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const contents = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
const h1 = document.querySelector('h1');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const header = document.querySelector('.header');
const allSection = document.querySelectorAll('.section');
const allButtons = document.getElementsByTagName('button');

const slides = document.querySelectorAll('.slide');
const slider = document.querySelector('.slider');
const btnRight = document.querySelector('.slider__btn--right');
const btnLeft = document.querySelector('.slider__btn--left');

///////////////////////////////////////
// Modal window

// Callback for opening the modal
const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

// Callback for closing the modal
const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

// Event listener for opening the modal
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

// Event listener for closing the modal
btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

// Event listener for closing modal when 'Escape' is pressed
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
});

// Implementing smooth scrolling////////////////////////

btnScrollTo.addEventListener('click', () =>
  section1.scrollIntoView({ behavior: 'smooth' })
);

// Event delegation /////////////////////////////////

// Scrolling clicked section into view
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();

  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

// Activate clicked operations tab
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  if (!clicked) return;

  // Activate tab
  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Activate content area
  contents.forEach(content =>
    content.classList.remove('operations__content--active')
  );
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// Nav menu fade animation/////////////////////////////

/**
 * Handles hover events on navigation links.
 *
 * @param {MouseEvent} e - The mouse event object.
 * @return {void} This function does not return a value.
 */
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
      logo.style.opacity = this;
    });
  }
};

nav.addEventListener('mouseover', handleHover.bind(0.5));

nav.addEventListener('mouseout', handleHover.bind(1));

/**
 * Toggles the 'sticky' class on the nav element based on the intersection of the nav element with the viewport.
 *
 * @param {IntersectionObserverEntry[]} entries - An array of intersection observer entries.
 * @return {void} This function does not return a value.
 */
const stickyNav = function (entries) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) {
      nav.classList.add('sticky');
    } else nav.classList.remove('sticky');
  });
};

const navHeight = nav.getBoundingClientRect().height;
const obsOptions = {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
};

const headerObserver = new IntersectionObserver(stickyNav, obsOptions);
headerObserver.observe(header);

/**
 * Reveals a section when it is intersecting with the viewport.
 *
 * @param {IntersectionObserverEntry[]} entries - The entries observed by the IntersectionObserver.
 * @return {void} This function does not return a value.
 */
const revealSection = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  sectionObserver.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});
allSection.forEach(sec => {
  sectionObserver.observe(sec);
  sec.classList.add('section--hidden');
});

const imgTargets = document.querySelectorAll('img[data-src]');

/**
 * Loads images based on intersection observer entries.
 *
 * @param {IntersectionObserverEntry[]} entries - An array of intersection observer entries.
 * @return {void} This function does not return a value.
 */
const loadImg = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });

  imgObserver.unobserve(entry.target);
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

// Slider//////////////////////////////////////////

let curSlide = 0;
const maxSlides = slides.length;
const dotContainer = document.querySelector('.dots');

// Create dots
const createDots = () => {
  slides.forEach((_, i) => {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class='dots__dot' data-slide='${i}'></button>`
    );
  });
};

// Activate dots
const activateDots = function (slide) {
  document
    .querySelectorAll('.dots__dot')
    .forEach(dot => dot.classList.remove('dots__dot--active'));

  document
    .querySelector(`.dots__dot[data-slide='${slide}']`)
    .classList.add('dots__dot--active');
};

// slider.style.transform = 'scale(0.5)';
// slider.style.overflow = 'visible';

slides.forEach(
  (slide, i) => (slide.style.transform = `translateX(${100 * i}%)`)
);

const goToSlide = curSlide => {
  slides.forEach((slide, i) => {
    slide.style.transform = `translateX(${100 * (i - curSlide)}%)`;
  });
  activateDots(curSlide);
};

const init = function () {
  createDots();
  goToSlide(curSlide);
};
init();

// Slide right
const nextSlide = function () {
  if (curSlide === maxSlides - 1) curSlide = 0;
  else curSlide++;

  goToSlide(curSlide);
};

// Slide left
const prevSlide = function () {
  if (curSlide === 0) curSlide = maxSlides - 1;
  else curSlide--;

  goToSlide(curSlide);
};

btnRight.addEventListener('click', nextSlide);
btnLeft.addEventListener('click', prevSlide);

document.addEventListener('keydown', function (e) {
  if (e.key === 'ArrowRight') nextSlide();
  if (e.key === 'ArrowLeft') prevSlide();
});

dotContainer.addEventListener('click', function (e) {
  if (e.target.classList.contains('dots__dot')) {
    curSlide = +e.target.dataset.slide;
    goToSlide(curSlide);
  }
});
