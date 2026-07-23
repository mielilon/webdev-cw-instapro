import { replaceMethod } from "../security.js";
import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>

        <h1>Создать пост</h1>

        <div class="input-container">
          <input 
            type="text"
            class="add-post-input__text"
          />

          <div class="upload-image-container"></div>

          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;
    
    renderHeaderComponent({
      element: document.querySelector(".header-container"),
    });

    const uploadImageContainer = appEl.querySelector('.upload-image-container');
    let imagePost = ''
    
    renderUploadImageComponent({
      element: uploadImageContainer,
      onImageUrlChange(newImageUrl) {
        imagePost = newImageUrl;
      },
    })

    document.getElementById("add-button").addEventListener("click", () => {
      const description = replaceMethod(document.querySelector('.add-post-input__text'))

      onAddPostClick({
        description: description,
        imageUrl: imagePost,
      });
    });
  };

  render();
}
