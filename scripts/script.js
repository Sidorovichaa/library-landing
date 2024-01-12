
const NAV_BTN = document.querySelector('.nav-icon-btn');
const NAV_ICON = document.querySelector('.nav-icon');
const NAV = document.querySelector('.header__nav');

const PROFILE_BTN = document.querySelector('.header__icon');
const PROFILE_BTN_AUTH = document.querySelector('.header__icon-auth');
const PROFILE_UNL = document.querySelector('.profile-unlogged');
const PROFILE_LOG = document.querySelector('.profile-logged');

const MODAL_BUTTONS = document.querySelectorAll('[data-modal-button]');
const MODAL_CLOSE_BTNS = document.querySelectorAll('[data-modal-close]');
const ALL_MODALS = document.querySelectorAll('[data-modal]');

const LOG_FORM = document.getElementById('logForm');
const REG_FORM = document.getElementById('regForm');



/*------------------NAVIGATION BUTTON----------------*/

NAV_BTN.onclick = function () {
  NAV_ICON.classList.toggle('nav-icon--active');
  NAV.classList.toggle('header__nav--mobile');
}

/*------------------MODAL WINDOWS----------------*/

// Кнопки - Открыть Модалку
MODAL_BUTTONS.forEach(function (item) {
  item.addEventListener('click', function () {

    // Скрыть все modal
    ALL_MODALS.forEach(function (item) {
      item.classList.add('hidden');
    });

    const MODAL_ID = this.dataset.modalButton;
    const MODAL = document.querySelector('#' + MODAL_ID);
    MODAL.classList.remove('hidden');

    // Находим внутри открываемой модалки блок .modal-window и запрещаем ему передавать клики "наверх"
    MODAL.querySelector('.modal-window').addEventListener('click', function (e) {
      e.stopPropagation();
    });
  })
})

// Кнопки - Закрыть Модалку
MODAL_CLOSE_BTNS.forEach(function (item) {
  item.addEventListener('click', function () {
    const MODAL = this.closest('[data-modal]');
    MODAL.classList.add('hidden');
  })
})

// Закрытие модалок по фейду
ALL_MODALS.forEach(function (item) {
  item.addEventListener('click', function () {
    this.classList.add('hidden');
  });
});

/*------------------PROFILE MODAL----------------*/

// open USER PROFILE with or without Authentification

PROFILE_BTN.addEventListener('click', function () {
  PROFILE_UNL.style.display = (PROFILE_UNL.style.display === 'none') ? 'flex' : 'none';
});
PROFILE_BTN_AUTH.addEventListener('click', function () {
  PROFILE_LOG.style.display = (PROFILE_LOG.style.display === 'none') ? 'flex' : 'none';
});

PROFILE_UNL.addEventListener('click', function () {
  PROFILE_UNL.style.display = 'none';
})
PROFILE_LOG.addEventListener('click', function () {
  PROFILE_LOG.style.display = 'none';
})


/*------------------REGISTRATION----------------*/

REG_FORM.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();

  const randomNUM = Array.from({ length: 32 }, () => "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))).slice(0, 9).join('');
  const data = Object.fromEntries(new FormData(e.target).entries());

  if (data.name.trim() === "" || data.surname.trim() === "" || data.password.trim() === "" || data.email.trim() === "") {
    alert("All fields must be filled in!");
  }
  else if (data.password.length < 8) {
    alert("Password must be at least 8 characters!");
  }
  else {
    for (key in data) {
      localStorage.setItem(key, data[key])
    }
    localStorage.setItem('cardNum', randomNUM);
    localStorage.setItem('count', 1);
    localStorage.setItem('isRegistered', 'true');
    alert(`You are registered! Your card number: ${localStorage.getItem('cardNum')}`);
    location.reload();
  }
});


/*------------------LOGIN----------------*/

LOG_FORM.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();

  const data = Object.fromEntries(new FormData(e.target).entries());

  if (data['email-or-card'] !== localStorage.getItem('email') && data['email-or-card'] !== localStorage.getItem('cardNum')) {
    alert('Incorrect email address or card number!');
  } else if (data.password !== localStorage.getItem('password')) {
    alert('Incorrect password!');
  } else {
    const count = localStorage.getItem('count');
    localStorage.setItem('isLogin', 'true');
    localStorage.setItem('count', +count + 1);
    alert("You are logged into your account!");
    location.reload();
  }
});


/*------------------LIBRARY CARD----------------*/

//show Library Card with or without Registration

const CARD_FORM = document.getElementById('cardForm');
const READER_NAME = document.getElementById('reader_name_auth');
const CARD_NUMBER2 = document.getElementById('card_number2_auth');
const CARD_LEFT = document.getElementById('cards__left');
const CARD_LEFT_AUTH = document.getElementById('cards__left-auth');
const CARD_FORM_BTN = document.getElementById('card_form_submit');

READER_NAME.value = `${localStorage.getItem('name')} ${localStorage.getItem('surname')}`;
CARD_NUMBER2.value = localStorage.getItem('cardNum');

CARD_FORM.addEventListener('submit', (e) => {
  e.preventDefault();
  e.stopPropagation();

  const data = Object.fromEntries(new FormData(e.target).entries());


  if (data['name'].trim() === "" || data['card_number'].trim() === "") {
    alert("All fields must be filled in!");
  } else if (localStorage.getItem('isRegistered')) {

    if ((data['name'] === localStorage.getItem('name') || data['name'] === localStorage.getItem('surname') || data['name'] === `${localStorage.getItem('name')} ${localStorage.getItem('surname')}`)
      && data['card_number'] === localStorage.getItem('cardNum')) {
      CARD_LEFT.style.display = 'none';
      CARD_LEFT_AUTH.style.display = 'flex';
      setTimeout(() => {
        CARD_LEFT.style.display = 'flex';
        CARD_LEFT_AUTH.style.display = 'none';
      }, 10000);
    }
  }
})


/*------------------AUTHENTIFICATION----------------*/
localStorage.setItem('bookArr', JSON.stringify(new Array()));
localStorage.setItem('books', 0);

const CARD_NUMBER = document.getElementById('card-number');
const USER_INITIALS = document.getElementById('profilecard__user-icon');
const USER_NAME = document.getElementById('profilecard__user-name');
const BOOK_LIST = JSON.parse(localStorage.getItem('bookArr'));
const USER_BOOK_LIST = document.getElementById('profilecard__rented-list');
let BOOK = JSON.parse(localStorage.getItem('bookArr'));
//let BOOK = JSON.parse(localStorage.getItem('bookArr')).sort((a, b) => (+(a["title"]).slice(0, -1)) - ((b["title"]).slice(0, -1)));

const BOOK_NUM = document.getElementById('bookNum');
const VISITS = document.getElementById('visits');



function hideProfileBtn() {
  PROFILE_BTN.style.display = 'none';
  PROFILE_BTN_AUTH.style.display = 'block';
}

function checkAuth() {
  if (localStorage.getItem('isLogin') === 'true') {
    hideProfileBtn();
    CARD_NUMBER.textContent = localStorage.getItem('cardNum');
    USER_INITIALS.textContent = `${localStorage.getItem('name').toUpperCase()[0]}${localStorage.getItem('surname').toUpperCase()[0]}`;
    USER_NAME.textContent = `${localStorage.getItem('name')} ${localStorage.getItem('surname')}`;
    BOOK_NUM.textContent = localStorage.getItem('books');
    VISITS.textContent = localStorage.getItem('count'); 

    if (JSON.parse(localStorage.getItem('bookArr')).length === 0) {
      USER_BOOK_LIST.textContent = 'You haven\'t bought any book yet!';
      
    } else {
      USER_BOOK_LIST.textContent = '';
      JSON.parse(localStorage.getItem('bookArr')).map(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `${item.title}, ${item.author}`;
        USER_BOOK_LIST.insertAdjacentElement('afterbegin', listItem);
        
      })
    }

    CARD_LEFT.style.display = 'none';
    CARD_LEFT_AUTH.style.display = 'flex';

  }
}


checkAuth();

function addBook(obj) {
  BOOK.push(obj);
  localStorage.setItem('bookArr', JSON.stringify(BOOK));
  checkAuth();
}


/*------------------LOG OUT----------------*/
const LOGOUT_BTN = document.getElementById('logOut');
LOGOUT_BTN.addEventListener('click', () => {
  localStorage.removeItem('isLogin');
  location.reload();
})


/*------------------BUY A LIBRARY CARD----------------*/
const BUY_CARD_BTNS = document.querySelectorAll('[data-book="buy-card-btn"]');
const BUY_FORM = document.getElementById('buyForm');
const BUY_MODAL = document.getElementById('modal-3');
const BUYCARD_CLOSE_BTN = document.getElementById('buycardCloseBtn');

BUY_CARD_BTNS.forEach((btn) => {
  btn.addEventListener('click', () => {
    if (!localStorage.getItem('isRegistered')) {
      alert('You must be registered to buy a book');
    } else if (localStorage.getItem('isRegistered')) {
      BUY_MODAL.classList.remove('hidden');

      BUY_FORM.addEventListener('submit', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const data = Object.fromEntries(new FormData(e.target).entries());
        const values = Object.values(data);

        if (values.includes('')) {
          alert("All fields must be filled in!");
        } else {
          const parentBtn = btn.offsetParent;
          const bookObj = {};
          bookObj.title = parentBtn.childNodes[3].childNodes[1].textContent;
          bookObj.author = parentBtn.childNodes[3].childNodes[3].textContent.slice(3);
          addBook(bookObj);

          btn.setAttribute('disabled', "disabled")
          btn.textContent = 'Own';
          btn.style.color = '#BB945F';
          btn.style.border = '1px solid #BB945F';

          BUY_MODAL.classList.add('hidden');

          const books = localStorage.getItem('books');
          localStorage.setItem('books', +books + 1);

        }
      })
    }
  })
})

BUYCARD_CLOSE_BTN.addEventListener('click', () => {
  BUY_MODAL.classList.add('hidden');
})

/*------------------SLIDER----------------*/

const SLIDER = document.querySelector('.slider');
const ARROW_LEFT = document.querySelector('.left');
const ARROW_RIGHT = document.querySelector('.right');
const INDICATOR_PARETNTS = document.querySelector('.pagination ul');
var position_index = 0;

document.querySelectorAll('.pagination li').forEach(function (indicator, ind) {

  indicator.addEventListener('click', function () {
    position_index = ind;
    document.querySelector('.pagination .btn-active').classList.remove('btn-active');
    indicator.classList.add('btn-active');
    SLIDER.style.transform = `translate(${position_index * -470}px)`;
  })
});

ARROW_RIGHT.addEventListener('click', function () {
  position_index = (position_index < 4) ? position_index + 1 : 4;
  document.querySelector('.pagination .btn-active').classList.remove('btn-active');
  INDICATOR_PARETNTS.children[position_index].classList.add('btn-active');
  SLIDER.style.transform = `translate(${position_index * -470}px)`;
});

ARROW_LEFT.addEventListener('click', function () {
  position_index = (position_index > 0) ? position_index - 1 : 0;
  document.querySelector('.pagination .btn-active').classList.remove('btn-active');
  INDICATOR_PARETNTS.children[position_index].classList.add('btn-active');
  SLIDER.style.transform = `translate(${position_index * -470}px)`;
});


// бесконечный слайдер
// const SLIDER = document.querySelector('.slider');
// const ARROW_LEFT = document.querySelector('.left');
// const ARROW_RIGHT = document.querySelector('.right');
// const SLIDES = Array.from(SLIDER.querySelectorAll('img'));
// const slideCount = SLIDES.length;
// let slideIndex = 0;

// ARROW_LEFT.addEventListener('click', () => {
//   slideIndex = (slideIndex - 1 + slideCount) % slideCount;
//   slide();
// });

// ARROW_RIGHT.addEventListener('click', () => {
//   slideIndex = (slideIndex + 1) % slideCount;
//   slide();
// });

// const slide = () => {
//   const imageWidth = slider.clientWidth;
//   const slideOffset = -slideIndex * imageWidth;
//   SLIDER.style.transform = `translateX(${slideOffset}px)`;
// }

// window.addEventListener('load', () => {
//   slide();
// });


/*------------------RADIO CHOICE----------------*/

// Нашли все заголовки табов по data атрибуту
const TAB_HEADERS = document.querySelectorAll('[data-tab]');
// Нашли все контент боксы
const CONTENT_BOXES = document.querySelectorAll('[data-tab-content]');

TAB_HEADERS.forEach(function (item) {
  item.addEventListener('click', function () {

    // 1. Скрыть все content box
    CONTENT_BOXES.forEach(function (item) {
      //item.classList.add('display-on-check');
      item.classList.add('none');
      item.style.opacity = "0";
    });

    // 2. Выбрать нужный content box и показать его
    const CONTENT_BOX = document.querySelector('#' + this.dataset.tab);
    //CONTENT_BOX.classList.remove('display-on-check');
    CONTENT_BOX.classList.remove('none');
    CONTENT_BOX.style.opacity = "1";

  })
})


console.log("Не выполнены пару пунктов по мелочам, в частности, панель навигации слайдера не сделана по технологии sticky (-2 балла)./n В My Profile не работает счетчик для Visits и Books, хотя он вроде есть (-4 балла)./n Когда появляется скролл в Rented Books в My Profile, пропадают маркеры списка, хотя в инспекторе они есть. Не знаю, это ошибка или нет./n Все остальные критерии выполнены - 194 балла")
