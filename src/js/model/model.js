import { API_KEY, API_URL, RES_PER_PAGE } from '../config/config';
import { AJAX } from '../helper/helper';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RES_PER_PAGE,
  },
  bookmarks: [],
};

const createRecipeObject = function (data) {
  const { recipe } = data.data;
  console.log(recipe);
  return {
    id: recipe.id,
    image: recipe.image_url,
    publisher: recipe.publisher,
    ingredients: recipe.ingredients,
    sourceUrl: recipe.source_url,
    servings: recipe.servings,
    title: recipe.title,
    cookingTime: recipe.cooking_time,
    ...(recipe.key && { key: recipe.key }),
  };
};

export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}/${id}?key=${API_KEY}`);

    if (data.status === 'fail') throw new Error(data.message);

    state.recipe = createRecipeObject(data);

    if (state.bookmarks.some(bookmark => bookmark.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
    //
  } catch (error) {
    throw error;
  }
  //
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;

    // const data = await getJSON(`${API_URL}?search=${query}`);
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);

    const { recipes } = data.data;

    if (data.error) throw new Error(data.error);

    state.search.results = recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });

    state.search.page = 1;
  } catch (error) {
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage; //10
  const end = page * state.search.resultsPerPage;
  // const end = page * 10;

  return state.search.results.slice(start, end);
};

export const updateServings = function (newServings) {
  const updateServingsIngredients = state.recipe.ingredients.map(ing => {
    return {
      quantity: (ing.quantity * newServings) / state.recipe.servings,
      unit: ing.unit,
      description: ing.description,
    };
  });
  state.recipe.ingredients = updateServingsIngredients;

  state.recipe.cookingTime = Math.round(
    (state.recipe.cookingTime * newServings) / state.recipe.servings
  );

  state.recipe.servings = newServings;
  // console.log(
  //   `${state.recipe.cookingTime} * ${newServings} / ${state.recipe.servings} = ${
  //     (state.recipe.cookingTime * newServings) / state.recipe.servings
  //   }`
  // );
};

const presistBookmark = function () {
  localStorage.setItem('Bookmarks', JSON.stringify(state.bookmarks));
};

export const addBookmark = function (recipe) {
  //> Adding recipe to bookmarks
  state.bookmarks.push(recipe);

  //> Marking recipe as bookmarked
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;

  //> Adding new recipe to local storage
  presistBookmark();
};

export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;

  //> Removing recipe from local storage
  presistBookmark();
};

const init = function () {
  const storage = localStorage.getItem('Bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ing => {
        // const ingArr = ing[1].replaceAll(' ', '').split(',');
        const ingArr = ing[1].split(',').map(el => el.trim());
        if (ingArr.length !== 3)
          throw new Error(
            'Wrong ingredient fromat! Please use the correct format :)'
          );

        const [quantity, unit, description] = ingArr;

        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };

    const data = await AJAX(`${API_URL}/?key=${API_KEY}`, recipe);

    //> Adding personal recipe to state recipe object
    state.recipe = createRecipeObject(data);

    //> Adding personal recipe to bookmarks
    addBookmark(state.recipe);
    //
  } catch (err) {
    throw err;
  }
};
