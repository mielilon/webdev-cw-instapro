import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from './upload-image-component.js'
export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  
  const render = () => {
    // @TODO: Реализовать страницу добавления поста
    let appHtml = `
    <div class="page-container">
          <div class="header-container"></div>
          <div class="form">
              <h3 class="form-title">Добавить пост</h3>
              <div class="form-inputs">
                  <div class="upload-image-container">
                  </div>
                  <label>
                      Опишите фотографию:
                      <textarea class="input textarea" placeholder="Введите текст" id="post-description" rows="4"></textarea>
                  </label>
                  <button class="button center" id="add-button">Добавить</button>
              </div>
          </div>
      </div>
  `;
    let imageUrl = '';
    appEl.innerHTML = appHtml;
    renderHeaderComponent({element: document.querySelector('.header-container')})
    renderUploadImageComponent({element: document.querySelector('.upload-image-container'),
                                onImageUrlChange:(url)=> imageUrl = url})
    let textAreaElement = document.getElementById('post-description')
   
    document.getElementById("add-button").addEventListener("click", () => {
      if (!textAreaElement.value || !imageUrl){
        alert ('Заполните все поля')
        return
      } 

      onAddPostClick({
        description: textAreaElement.value,
        imageUrl: imageUrl,
      });
      
    });
  };

  render();
  
}
