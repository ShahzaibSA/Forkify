import * as model from '../model/model';
import addRecipeView from '../views/addRecipeView';
import bookmarkView from '../views/bookmarkView';
import paginationView from '../views/paginationView';
import recipeView from '../views/recipeView';
import resultView from '../views/resultView';
import searchView from '../views/searchView';

///////////////////////////////////////
console.log('FORKIFY');

// if (module.hot) {
//   module.hot.accept();
// }

const controlRecipe = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    //> Rendering Spinner..
    recipeView.renderSpinner();

    //> Update results view to mark selected search result..
    // resultView.update(model.state.recipe);
    resultView.update(model.getSearchResultsPage());

    //> Update bookmark view to..
    bookmarkView.update(model.state.bookmarks);

    //> Loading Recipe..
    await model.loadRecipe(id);

    //> Sending Recipe data to model..
    recipeView.render(model.state.recipe);

    //> Rendering Recipe..
    // recipeView.renderRecipe();
  } catch (error) {
    console.log('Controller 🔴🔴', error);
    recipeView.renderError();
  }
  //
};

const controlSearchRecipe = async function () {
  try {
    //> Rendering Spinner..
    resultView.renderSpinner();

    // resultView.update(model.state.recipe)

    //> 1) Get search query..
    const query = searchView.getQuery();
    // const query = 'mushrooms';
    if (!query) return;

    //> 2) Load search resullts..
    await model.loadSearchResult(query);

    //> 3) Render results..
    resultView.render(model.getSearchResultsPage());

    //> 4) Render initials pagination buttons..
    paginationView.render(model.state.search);
    //
  } catch (error) {
    console.log(error);
    resultView.renderError();
  }
};

const controlPagination = function (goToPage) {
  //> 1) Render NEW results

  resultView.render(model.getSearchResultsPage(goToPage));

  //> 2) Render NEW pagination button
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  model.updateServings(newServings);

  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);

  recipeView.update(model.state.recipe);

  bookmarkView.render(model.state.bookmarks);
};

const controlBookmark = function () {
  bookmarkView.render(model.state.bookmarks);
};

const controlUpload = async function (newRecipe) {
  try {
    //> 1) Rendering Spinner..
    addRecipeView.renderSpinner();

    //> 2) Uploading recipe..
    await model.uploadRecipe(newRecipe);

    //> 3) Render recipe..
    recipeView.render(model.state.recipe);

    //> 4) Render success message..
    addRecipeView.renderMessage();

    //> 5) Render bookmark..
    bookmarkView.render(model.state.bookmarks);

    //> 6) Changing url without reloading page..
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //> 7) Closing add recipe form..
    setTimeout(() => {
      addRecipeView.toggleWidow();
    }, 2500);
    //
  } catch (error) {
    console.log(error);
    addRecipeView.renderError(error);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipe);
  recipeView.addHandlerServings(controlServings);
  recipeView.addHandlerBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchRecipe);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlUpload);
};
init();
// (function () {
//   recipeView.addHanderRender(controlRecipe);
// })();
