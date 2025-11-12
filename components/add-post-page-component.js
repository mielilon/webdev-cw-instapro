import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";
import { goToPage, user } from "../index.js";

let imageUrl = "";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container"></div>
          <label>
          Опишите фотографию:
          <textarea class="input textarea" rows="4"></textarea>
          </label>
           <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>
  `;

    appEl.innerHTML = appHtml;

    document.getElementById("add-button").addEventListener("click", () => {
      const textarea = document.querySelector("textarea");
      onAddPostClick({
        description: textarea.value,
        imageUrl,
      });
    });

    renderHeaderComponent({
      element: document.querySelector(".header-container"),
      user,
      goToPage,
    });
    const uploadImageContainer = appEl.querySelector(".upload-image-container");
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }
  };

  render();
}
