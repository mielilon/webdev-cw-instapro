import { renderHeaderComponent } from "./header-component.js";
import { renderUploadImageComponent } from "./upload-image-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  const render = () => {
    const appHtml = `
      <div class="page-container">
        <div class="header-container"></div>
        <div class="form">
          <h3 class="form-title">Добавить публикацию</h3>
          <div class="form-inputs">
            <textarea
              class="input textarea"
              id="description-input"
              placeholder="Описание фотографии"
              rows="4"
            ></textarea>
            <div class="upload-image-container"></div>
            <div class="form-error"></div>
            <button class="button" id="add-button">Добавить</button>
          </div>
        </div>
      </div>
    `;

    appEl.innerHTML = appHtml;

    renderHeaderComponent({
      element: appEl.querySelector(".header-container"),
    });

    let imageUrl = "";

    renderUploadImageComponent({
      element: appEl.querySelector(".upload-image-container"),
      onImageUrlChange(newImageUrl) {
        imageUrl = newImageUrl;
      },
    });

    const descriptionInputElement = appEl.querySelector("#description-input");
    const addButtonElement = appEl.querySelector("#add-button");
    const errorElement = appEl.querySelector(".form-error");

    addButtonElement.addEventListener("click", () => {
      errorElement.textContent = "";

      const description = descriptionInputElement.value.trim();

      if (!description) {
        errorElement.textContent = "Введите описание фотографии";
        return;
      }

      if (!imageUrl) {
        errorElement.textContent = "Загрузите фотографию";
        return;
      }

      addButtonElement.disabled = true;
      addButtonElement.textContent = "Добавляем...";

      onAddPostClick({ description, imageUrl }).catch((error) => {
        errorElement.textContent = error.message;
        addButtonElement.disabled = false;
        addButtonElement.textContent = "Добавить";
      });
    });
  };

  render();
}
