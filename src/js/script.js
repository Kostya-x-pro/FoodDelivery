'use strict';

window.addEventListener('DOMContentLoaded', () => {
  //  Tabs
  const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

// Функция скрытия информации табов
  function hideTabContent() {
    tabsContent.forEach(item => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });

    tabs.forEach(item => {
    item.classList.remove('tabheader__item_active');
    }); 
  }
// Фуекция показа информации табов
  function showTabContent(i = 0) {   /* (i = 0 - если в функцию не передан аргумент то по умолчанию i === 0) */
  tabsContent[i].classList.add('show', 'fade');
  tabsContent[i].classList.remove('hide');
  tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent();

  // Обработчик события клика на определенный таб
  tabsParent.addEventListener('click', (event) => {
    const target = event.target;

    if(target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i)  => {
        if(target == item) {
          hideTabContent();
          showTabContent(i);
        }
      }); 
    }
  });

  // Timer

  const dedline = '2023-06-25';

  // Функция вычисления разницы между текущей датой и датой окончания акции
  function getTimeRemaning(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()),
          days = Math.floor(t / (1000 * 60 * 60 * 24)),
          hours = Math.floor((t / (1000 * 60 * 60)) % 24),
          minutes = Math.floor((t / 1000 / 60) % 24),
          seconds = Math.floor((t / 1000) % 24);

    return {
      total: t,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  // Функция добавление 0 если число однозначное
  function getZero(num) {
    if(num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  //Функция установки таймера
  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
          days = timer.querySelector('#days'),
          hours = timer.querySelector('#hours'),
          minutes = timer.querySelector('#minutes'),
          seconds = timer.querySelector('#seconds'),
          timeInterval = setInterval(updateClock, 1000);

    updateClock();   

    // Функция обновления таймера
    function updateClock() {
      const t = getTimeRemaning(endtime);
      
      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
      clearInterval(timeInterval);
      }
    }
  }

  setClock('.timer', dedline);

  //Modal window

  const modalTriger = document.querySelectorAll('[data-modal]'), 
        modal = document.querySelector('.modal'),
        modalCloseBtn = document.querySelector('[data-close]');

  //открытие модального окна
  modalTriger.forEach(btn => {
   
    btn.addEventListener('click', () => {
      modal.classList.add('show');
      modal.classList.remove('hide');
      document.body.style.overflow = 'hidden';
    });
  });

  //закрытие модального окна
  function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }
   
  modalCloseBtn.addEventListener('click', closeModal);

  // закрытие при нажатии на область за модальным окном
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // закрытие модального окна клавишей ESC
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.classList.contains('show')) {
    closeModal();
    }
  });

  // Калькулятор расчёта колорий

  const result = document.querySelector('.calculating__result span');
  let sex, height, weight, age, ratio;

  if (localStorage.getItem('sex')) {
     sex = localStorage.getItem('sex');
  } else {
    sex = 'female';
    localStorage.setItem('sex', 'female');
  }

  if (localStorage.getItem('ratio')) {
     ratio = localStorage.getItem('ratio');
  } else {
    ratio = 'female';
    localStorage.setItem('ratio', '1.375');
  }
// Функция сравнения что кликнул пользователь с данными из localstorage
  function initLocalStorage(selector, activeClass) {
    const elements = document.querySelectorAll(selector);

    elements.forEach(elem => {
      elem.classList.remove(activeClass);
      if (elem.getAttribute('id') === localStorage.getItem('sex')){
        elem.classList.add(activeClass);
      }
      if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')){
        elem.classList.add(activeClass);
      }
    });
  }

  initLocalStorage('#gender div', 'calculating__choose-item_active');
  initLocalStorage('.calculating__choose_big div', 'calculating__choose-item_active');


  function calcTotal() {
    if (!sex || !height || !weight || !age || !ratio) {
      result.textContent = '__';
      return;
    }

    if (sex === 'female') {
      result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
    } else {
      result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
    }
  }

  calcTotal();

  function getStaticInformation(selector, activeClass) {
    const elements = document.querySelectorAll(selector);

    elements.forEach(elem => {
      elem.addEventListener('click', (e) => {
        if (e.target.getAttribute('data-ratio')) {
          ratio = +e.target.getAttribute('data-ratio');
          localStorage.setItem('ratio', +e.target.getAttribute('data-ratio'));

        } else {
          sex = e.target.getAttribute('id');
          localStorage.setItem('sex', +e.target.getAttribute('data-ratio'));
        }
        
        elements.forEach(elem => {
          elem.classList.remove(activeClass);
        });
  
        e.target.classList.add(activeClass);
  
        calcTotal();
      });
    });
  }

getStaticInformation('#gender div', 'calculating__choose-item_active');
getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

function getDynamicInformation(selector) {
  const input = document.querySelector(selector);

  input.addEventListener('input', () => {

    if (input.value.match(/\D/g)) {
      input.style.border = '1px solid red';
    } else {
      input.style.border = 'none';
    }

    switch(input.getAttribute('id')) {
      case 'height':
        height = +input.value;
        break;
      case 'weight':
        weight = +input.value;
        break;
      case 'age':
        age = +input.value;
        break;
    }
    calcTotal();
  });
}

getDynamicInformation('#height');
getDynamicInformation('#weight');
getDynamicInformation('#age');

// Slider
const slides = document.querySelectorAll('.offer__slide'),
      prev = document.querySelector('.offer__slider-prev'),
      next = document.querySelector('.offer__slider-next'),
      total = document.querySelector('#total'),
      current = document.querySelector('#current');

let slideIndex = 1;

showSliedes(slideIndex);

if (slides.length < 10) {
  total.textContent = `0${slides.length}`;
} else {
  total.textContent = slides.length;
}

function showSliedes(n) {
  if (n > slides.length) {
    slideIndex = 1;
  }

  if (n < 1) {
    slideIndex = slides.length; 
  }

  slides.forEach(item => item.style.display = 'none');

  slides[slideIndex - 1].style.display = 'block';

  if (slides.length < 10) {
    current.textContent = `0${slideIndex}`;
  } else {
    current.textContent = slideIndex;
  }

}

function plusSlides(n) {
  showSliedes(slideIndex += n);
}

prev.addEventListener('click', () => {
  plusSlides(-1);
});
next.addEventListener('click', () => {
  plusSlides(1);
});

  
});