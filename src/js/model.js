import { API_URL, RESULT_PER_PAGE ,apiKey } from './config.js';
import { getJson, sendJson  } from './helpers.js';
export { getJson ,sendJson } from './helpers.js';
export const state = {
  recipe: {},
  search: {
    page: 1,
    query: '',
    resultPerPage: RESULT_PER_PAGE,
    results: [],
  },
  bookmarks: [],
};
const createRecipeObject=function(recipeData){
  const { recipe } = recipeData.data;
  return  {
    cookingTime: recipe.cooking_time,
    id: recipe.id,
    imageUrl: recipe.image_url,
    ingredients: recipe.ingredients,
    publisher: recipe.publisher,
    servings: recipe.servings,
    sourceUrl: recipe.source_url,
    title: recipe.title,
    ...(recipe.key && {key:recipe.key}),
  };
}
export const loadRecipe = async function (id) {
  try {
    const recipeData = await getJson(`${API_URL}${id}?key=${apiKey}`);
    state.recipe=createRecipeObject(recipeData)
  
    if (state.bookmarks.some(bookmark => bookmark.id === id)) {
      state.recipe.bookmarked = true;
    } else {
      state.recipe.bookmarked = false;
    }
  } catch (error) {
    console.error(`${error}😒💀`);
    throw error;
  }
};

export const loadSearchResult = async function (query) {
  try {
    state.search.query = query;
    const recipesData = await getJson(`${API_URL}?search=${query}&key=${apiKey}`);
    state.search.results = recipesData.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        imageUrl: recipe.image_url,
        title: recipe.title,
        publisher: recipe.publisher,
         ...(recipe.key && { key:recipe.key}),
      };
    });
    state.search.page = 1;
    
  } catch (error) {
    console.error(`${error}😒💀`);
    throw error;
  }
};

export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultPerPage;
  const end = page * state.search.resultPerPage;
  return state.search.results.slice(start, end);
};

export const updateRecipeServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = (ing.quantity * newServings) / state.recipe.servings;
  });
  state.recipe.servings = newServings;
};

export const addBookmark = function (recipe) {
  //add bookmark
  state.bookmarks.push(recipe);

  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  saveBookmarks();
};
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);

  if (id === state.recipe.id) state.recipe.bookmarked = false;
  saveBookmarks();
};
const saveBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

export const uploadRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
    .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
    .map(ing => {
      const ingArray=ing[1].split(',').map(el=>el.trim())
      if(ingArray.length !== 3 ) throw new Error("'wrong ingredient format!")
      const [quantity, unit, description] = ingArray
        return {quantity:quantity? +quantity:null ,unit,description}
    });
    const recipe={
      title:newRecipe.title,
      source_url:newRecipe.sourceUrl,
      image_url:newRecipe.image,
      publisher:newRecipe.publisher,
      cooking_time:+newRecipe.cookingTime,
      servings:+newRecipe.servings,
      ingredients,
    };
  

   const data = await sendJson(`${API_URL}?key=${apiKey}`,recipe)
   state.recipe=createRecipeObject(data);
   addBookmark(state.recipe)
  } catch (error) {
    throw error;
  }
  

};
