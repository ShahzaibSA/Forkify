import { View } from './View.js';

class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _message = 'Recipe was successfully uploaded 🙂';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  constructor() {
    super();
    this.addHandlerShowWindow();
    this.addHandlerCloseWindow();
  }

  addHandlerUpload(handler) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();
      // this = this.parenetElement
      // FromData return an Prototype Object so to get form data make array
      const dataArr = [...new FormData(this)];
      const newRecipe = Object.fromEntries(dataArr);
      handler(newRecipe);
    });
  }

  toggleWidow() {
    this._window.classList.toggle('hidden');
    this._overlay.classList.toggle('hidden');
  }

  addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWidow.bind(this));
  }

  addHandlerCloseWindow() {
    this._btnClose.addEventListener('click', this.toggleWidow.bind(this));
    this._overlay.addEventListener('click', this.toggleWidow.bind(this));
  }
}

export default new AddRecipeView();
