import { onAddPostClick } from "../api.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    // @TODO: Реализовать страницу добавления поста
    const appHtml = `
    <div class="page-container">
      <div class="header-container">
      <div class="page-header">
      <h1 class="logo">instapro</h1>
      <button class="header-button add-or-login-button">
      <div title="Добавить пост" class="add-post-sign"></div>
      </button>
      <button title="Админ" class="header-button logout-button">Выйти</button>  
    </div>
    </div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container">
            <div class="upload=image">
              <label class="file-upload-label secondary-button">
                  <input type="file" class="file-upload-input" style="display:none">
                  Выберите фото
              </label>
            </div>
          </div>
          <label>
            Опишите фотографию:
            <textarea class="input textarea" id="description" rows="4"></textarea>
          </label>
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>`;

    appEl.innerHTML = appHtml;

    let imageUrl = "";
    const descriptionEl = document.getElementById("description");
    const uploadImageContainer = document.querySelector(
      ".upload-image-container",
    );
    const buttonAdd = document.getElementById("add-button");
    if (uploadImageContainer) {
      renderUploadImageComponent({
        element: uploadImageContainer,
        onImageUrlChange(newImageUrl) {
          imageUrl = newImageUrl;
        },
      });
    }
    buttonAdd.addEventListener("click", () => {
      if (!descriptionEl.value.trim() || imageUrl == "") {
        alert("Заполните форму!");
        return;
      }
      onAddPostClick(
        descriptionEl.value.replaceAll("<", "&lt;").replaceAll(">", "&gt;"),
        imageUrl,
      );
    });
  };
  render();
}
