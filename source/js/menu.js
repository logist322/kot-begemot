'use strict';

(function () {
  document.querySelector('.header__burger')
    .addEventListener('click', function (evt) {
      evt.preventDefault();
      document.querySelector('.header__nav').classList.toggle('header__nav--hidden');
      document.querySelector('.header__burger').classList.toggle('header__burger--opened');
    });
})();
