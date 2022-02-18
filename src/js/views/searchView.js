class SearchView {
  #parentElemet = document.querySelector('.search');

  getQuery() {
    const query = this.#parentElemet.querySelector('.search__field').value;
    this.#parentElemet.querySelector('.search__field').value = '';
    return query;
  }

  addHandlerSearch(handler) {
    this.#parentElemet.addEventListener('submit', function (e) {
      e.preventDefault();
      handler();
    });
  }
}

export default new SearchView();
