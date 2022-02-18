import { View } from './View.js';
import icons from 'url:../../img/icons.svg';
import Fraction from 'fractional';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;

      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateHtml() {
    const currentPage = this._data.page;
    //prettier-ignore
    const numPage = Math.ceil(this._data.results.length / this._data.resultsPerPage);

    //> Page 1, and there are other pages
    if (currentPage === 1 && numPage > 1) {
      return this._generateButtonHtml(currentPage + 1, currentPage, 'right');
    }

    //> Other page can go forward -> & backward <-
    if (currentPage < numPage) {
      return `
        <button data-goto="${
          currentPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
        </button>
        <button data-goto="${
          currentPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button> 
        `;
    }
    //> Last Page only go backward <-
    if (currentPage === numPage && numPage > 1) {
      return this._generateButtonHtml(currentPage - 1, currentPage);
    }

    //> Only 1 page
    return '';
  }

  _generateButtonHtml(goToPage, currentPage) {
    return `
        <button data-goto="${goToPage}" class="btn--inline pagination__btn--${
      goToPage > currentPage ? 'next' : 'prev'
    }">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-${
      goToPage > currentPage ? 'right' : 'left'
    }"></use>
            </svg>
            <span>Page ${goToPage}</span>
        </button>
      `;
  }
}

export default new PaginationView();
