import View from './View.js';
import icons from 'url:../../img/icons.svg';
class BookmarkView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = ` there is no bookmarks yet !😅 `;
  _message = ` `;

  addHandlerRender(handler){
    window.addEventListener('load',handler)
  }
  _generateMarkup() {
    
    const id=window.location.hash.slice(1);
    return this._data
      .map(res => {
        
        return `
           <li class="preview">
              <a class="preview__link ${res.id===id?'preview__link--active':""} "   href="#${res.id}">
                <figure class="preview__fig">
                  <img src="${res.imageUrl}" alt="${res.title}" />
                </figure>
              <div class="preview__data">
                  <h4 class="preview__title">${res.title}</h4>
                  <p class="preview__publisher">${res.publisher}</p> 
                  <div class="preview__user-generated ${res.key?"":"hidden"}">
                   <svg>
                     <use href="${icons}#icon-user"></use>
                  </svg>
                 </div>
              </div>
                
              </a>
            </li>
            `;
      })
      .join('');
  }
  
}
export default new BookmarkView();