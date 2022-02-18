import icons from 'url:../../img/icons.svg';

export class View {
  _data;

  update(data) {
    this._data = data;
    const newMarkup = this._generateHtml();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // console.log(curEl, newEl.isEqualNode(curEl));

      // Updates changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log('💥', newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // Updates changed ATTRIBUES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  render(data) {
    this._data = data;
    const html = this._generateHtml();
    this._injectHtml(html);
  }

  renderSpinner() {
    const html = `
    <div class="spinner">
          <svg>
            <use href="${icons}#icon-loader"></use>
          </svg>
    </div>
  `;
    this._injectHtml(html);
  }

  renderError(error = this._errorMessage) {
    const html = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${error}</p>
      </div>
    `;
    this._injectHtml(html);
  }

  renderMessage(message = this._message) {
    const html = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._injectHtml(html);
  }

  _injectHtml(html) {
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
}
