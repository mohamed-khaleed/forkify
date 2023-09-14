import icons from 'url:../../img/icons.svg';
export default class View {
  _data;
  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const html = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
  update(data) {
    
    this._data = data;
    const newHtml = this._generateMarkup();
    //we will create new html but not render it instead we will generate this html and then compare it to the current html and change the text and attributes that only changed from the old to new one

    // to be able to compare we must convert the string html to DOM object
    const newDOM = document.createRange().createContextualFragment(newHtml);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElements = Array.from(this._parentElement.querySelectorAll('*') );

    newElements.forEach((newEl,i)=>{
       const curEl=currentElements[i]
           
        // update changed text only
        if(!newEl.isEqualNode(curEl) && newEl.firstChild?.nodeValue.trim() !=="" ){
          curEl.textContent=newEl.textContent
        } 

        if(!newEl.isEqualNode(curEl)){
           Array.from(newEl.attributes).forEach(attr=>{
            curEl.setAttribute(attr.name , attr.value)
           })
        }
    })
  }
  renderSpinner() {
    const html = `
             <div class="spinner">
                <svg>
                  <use href="${icons}#icon-loader"></use>
                </svg>
              </div>
         `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderError(message = this._errorMessage) {
    const html = `
        <div class="error">
          <div>
            <svg>
              <use href="${icons}#icon-alert-triangle"></use>
            </svg>
          </div>
         <p>${message}</p>
        </div>
        `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', html);
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
         this._clear();
         this._parentElement.insertAdjacentHTML('afterbegin', html);
  }
  
}
