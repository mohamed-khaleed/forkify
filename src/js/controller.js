import 'core-js/actual';
import 'regenerator-runtime/runtime';
import  recipeView from './views/recipeView.js';
import * as model from './model.js';
import  searchView from './views/searchView.js'
import  resultsView from "./views/resultsView.js"
import  bookmarksView from "./views/bookmarkView.js"
import  paginationView from './views/paginationView.js'
import  addRecipeView from "./views/addRecipeView.js"
import  {MODAL_CLOSE_SEC} from "./config.js"
import { async } from 'regenerator-runtime';


if(module.hot){
 module.hot.accept()
}

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    recipeView.renderSpinner();
    ///
    resultsView.update(model.getSearchResultsPage())
    bookmarksView.update(model.state.bookmarks)
   
    //load recipe
    await model.loadRecipe(id); 
    //render recipe
    recipeView.render(model.state.recipe) ;
  
  } catch (error) {
    recipeView.renderError();
  }
};
const controlSearch = async function(){
  try {
    resultsView.renderSpinner()


    const query=searchView.getQuery()
    if(!query) return
    await model.loadSearchResult(query)


  
    // resultsView.render(model.state.search.results) 
    resultsView.render(model.getSearchResultsPage())
    
    //render pagination
    paginationView.render(model.state.search)
  } catch (error) {
    console.error(error);
  }
}

const controlPagination=function(goTo){

    resultsView.render(model.getSearchResultsPage(goTo))
    paginationView.render(model.state.search);
}

const controlAddBookMark=function(){
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id)
  
  recipeView.update(model.state.recipe)

  bookmarksView.render(model.state.bookmarks)
}

const controlServings=function(newServings){
   // update recipe from modal
   model.updateRecipeServings(newServings)
   //render recipe
   recipeView.update(model.state.recipe) 
}
const controlBookmarks=function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe= async function(newRecipe){
  try {
    addRecipeView.renderSpinner()
    await model.uploadRecipe(newRecipe)
    recipeView.render(model.state.recipe)
  
    addRecipeView.renderMessage();
    bookmarksView.render(model.state.bookmarks)
    //change id in url
    window.history.pushState(null,"",`#${model.state.recipe.id}`)
    setTimeout( function(){
      addRecipeView.toggleWindow()
    },MODAL_CLOSE_SEC*1000)
    
    
  } catch (error) {
    console.error(`😒 ${error} `)
    addRecipeView.renderError(error.message)
  }
  
}

const init=function(){
    bookmarksView.addHandlerRender(controlBookmarks)
    recipeView.addHandlerRender(controlRecipes)
    recipeView.addHandlerUpdateServings(controlServings)
    recipeView.addBookMarkHandler(controlAddBookMark)
    searchView.addHandlerSearch(controlSearch)  
    paginationView.addHandlerClick(controlPagination)
    addRecipeView.addHandlerUpload(controlAddRecipe)
}
init()

const clearBookmarks= function(){
  localStorage.clear('bookmarks')
}

