import { renderUploadImageComponent } from "./upload-image-component.js";
import { renderHeaderComponent } from "./header-component.js";

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
  let imageUrl = "";
  let description = "";

  const appHtml = `
    <div class="page-container">
      <div class="header-container"></div>
      <div class="form">
        <h3 class="form-title">Добавить пост</h3>
        <div class="form-inputs">
          <div class="upload-image-container"></div>
          <textarea
            class="input textarea"
            id="description-input"
            placeholder="Описание поста"
          ></textarea>
          <p class="form-error" id="form-error"></p>
          <button class="button" id="add-button">Добавить</button>
        </div>
      </div>
    </div>`;

  appEl.innerHTML = appHtml;

  renderHeaderComponent({
    element: document.querySelector(".header-container"),
  });

  renderUploadImageComponent({
    element: document.querySelector(".upload-image-container"),
    onImageUrlChange: (url) => {
      imageUrl = url;
    },
  });

  const textarea = document.getElementById("description-input");
  const errorEl = document.getElementById("form-error");

  textarea.addEventListener("input", (e) => {
    description = e.target.value;
    errorEl.textContent = ""; 
  });

  document.getElementById("add-button").addEventListener("click", () => {
    errorEl.textContent = "";

    if (!description.trim()) {
      errorEl.textContent = "Введите описание поста";
      return;
    }
    if (!imageUrl) {
      errorEl.textContent = "Загрузите изображение";
      return;
    }

    onAddPostClick({
      description: description.trim(),
      imageUrl,
    });
  });
}